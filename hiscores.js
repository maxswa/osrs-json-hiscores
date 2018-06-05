const URLs = {
    main: 'http://services.runescape.com/m=hiscore_oldschool/',
    iron: 'http://services.runescape.com/m=hiscore_oldschool_ironman/',
    ult: 'http://services.runescape.com/m=hiscore_oldschool_ultimate/',
    hc: 'http://services.runescape.com/m=hiscore_oldschool_hardcore_ironman/',
    dmm: 'http://services.runescape.com/m=hiscore_oldschool_deadman/',
    sdmm: 'http://services.runescape.com/m=hiscore_oldschool_seasonal/',
    dmmt: 'http://services.runescape.com/m=hiscore_oldschool_tournament/',
    stats: 'index_lite.ws?player=',
    scores: 'overall.ws?'
  },
  hiscores = {
    skills: [
      'overall',
      'attack',
      'defence',
      'strength',
      'hitpoints',
      'ranged',
      'prayer',
      'magic',
      'cooking',
      'woodcutting',
      'fletching',
      'fishing',
      'firemaking',
      'crafting',
      'smithing',
      'mining',
      'herblore',
      'agility',
      'thieving',
      'slayer',
      'farming',
      'runecraft',
      'hunter',
      'construction'],
    other: [
      'easyclues',
      'mediumclues',
      'allclues',
      'roguebh',
      'hunterbh',
      'hardclues',
      'lms',
      'eliteclues',
      'masterclues'
    ]
  },
  validModes = ['full', 'main', 'iron', 'hc', 'ult', 'dmm', 'sdmm', 'dmmt']

/**
 * Gets a player's stats.
 *
 * Gets CSV from OSRS API and converts to JS object.
 *
 * @access public
 *
 * @param {string} rsn    The player's username.
 * @param {string} [mode] The game mode.
 *
 * @returns {Object} A player object.
 */
async function getStats (rsn, mode = 'full') {
  if(typeof rsn !== 'string') {
    throw Error('RSN must be a string')
  }
  else if(!/^[a-zA-Z0-9 _]+$/.test(rsn)) {
    throw Error('RSN contains invalid character')
  }
  else if(rsn.length > 12 || rsn.length < 1) {
    throw Error('RSN must be between 1 and 12 characters')
  }
  else if(!validModes.includes(mode.toLowerCase())) {
    throw Error('Invalid game mode')
  }
  else {
    return await getPlayerStats(rsn, mode.toLowerCase())
  }
}

/**
 * Gets a player's stats.
 *
 * Gets CSV from OSRS API and converts to JS object.
 *
 * @access private
 *
 * @param {string} rsn  The player's username.
 * @param {string} mode The game mode.
 *
 * @returns {Object} A player object.
 */
async function getPlayerStats (rsn, mode) {
  let player = {
    rsn: rsn,
    mode: mode,
    dead: false,
    deironed: false
  }

  if(mode === 'full') {
    const responses = []
    let csv

    responses[0] = await fetch(URLs.main + URLs.stats + encodeURIComponent(rsn))
    if (responses[0].ok) {
      const otherResponses = await Promise.all([
        fetch(URLs.iron + URLs.stats + encodeURIComponent(rsn)),
        fetch(URLs.hc + URLs.stats + encodeURIComponent(rsn)),
        fetch(URLs.ult + URLs.stats + encodeURIComponent(rsn)),
        getRSNFormat(rsn)
      ])

      player.rsn = otherResponses.pop()

      for (let res of otherResponses) {
        responses.push(res)
      }

      if (responses[1].ok) {
        if (responses[2].ok) {
          player.mode = 'hc'
        }
        else if (responses[3].ok) {
          player.mode = 'ult'
        }
        else {
          player.mode = 'iron'
        }
      }
      else {
        player.mode = 'main'
      }
    }
    else {
      throw Error('Player not found')
    }

    switch (player.mode) {
      case 'main':
        csv = await responses[0].text()
        player.main = parseStats(csv)
        break
      case 'iron':
        csv = await responses[0].text()
        player.main = parseStats(csv)
        csv = await responses[1].text()
        player.iron = parseStats(csv)
        if(player.main.stats.overall.xp !== player.iron.stats.overall.xp) {
          player.deironed = true
          player.mode = 'main'
        }
        break
      case 'hc':
        csv = await responses[0].text()
        player.main = parseStats(csv)
        csv = await responses[1].text()
        player.iron = parseStats(csv)
        csv = await responses[2].text()
        player.hc = parseStats(csv)
        if(player.iron.stats.overall.xp !== player.hc.stats.overall.xp) {
          player.dead = true
          player.mode = 'iron'
        }
        if(player.main.stats.overall.xp !== player.iron.stats.overall.xp) {
          player.deironed = true
          player.mode = 'main'
        }
        break
      case 'ult':
        csv = await responses[0].text()
        player.main = parseStats(csv)
        csv = await responses[1].text()
        player.iron = parseStats(csv)
        csv = await responses[3].text()
        player.ult = parseStats(csv)
        if(player.main.stats.overall.xp !== player.iron.stats.overall.xp) {
          player.deironed = true
          player.mode = 'main'
        }
        break
    }

    return player
  }
  else {
    const response = await fetch(URLs[mode] + URLs.stats + encodeURIComponent(rsn))
    if(!response.ok) {
      throw Error('Player not found')
    }
    const csv = await response.text()
    player[mode] = parseStats(csv)
    return player
  }
}

/**
 * Gets a hiscore page.
 *
 * Scrapes OSRS hiscores and converts to objects.
 *
 * @access public
 *
 * @param {string} mode       The game mode.
 * @param {string} [category] The category of hiscores.
 * @param {number} [page]     The page of players.
 *
 * @returns {Object[]} Array of player objects.
 */
async function getHiscores (mode, category = 'overall', page = 1) {
  if(!validModes.includes(mode.toLowerCase()) || mode.toLowerCase() === 'full') {
    throw Error('Invalid game mode')
  }
  else if(!Number.isInteger(page) || page < 1) {
    throw Error('Page must be an integer greater than 0')
  }
  else if(!hiscores.skills.includes(category.toLowerCase()) && !hiscores.other.includes(category.toLowerCase())) {
    throw Error('Invalid category')
  }
  else {
    return await getHiscoresPage(mode.toLowerCase(), category.toLowerCase(), page)
  }
}

/**
 * Gets a hiscore page.
 *
 * Scrapes OSRS hiscores and converts to objects.
 *
 * @access private
 *
 * @param {string} mode       The game mode.
 * @param {string} category   The category of hiscores.
 * @param {number} page       The page of players.
 *
 * @returns {Object[]} Array of player objects.
 */
async function getHiscoresPage(mode, category, page) {
  const url = URLs[mode] + URLs.scores +
    (hiscores.skills.includes(category) ?
      'table=' + hiscores.skills.indexOf(category) :
      'category_type=1' + '&table=' + hiscores.other.indexOf(category)) +
    '&page=' + page

  const response = await fetch(url)
  let players = [], element = document.createElement('html')
  element.innerHTML = await response.text()
  const playersHTML = element.querySelectorAll('.personal-hiscores__row')

  for(let player of playersHTML) {
    const attributes = player.querySelectorAll('td')
    let playerInfo = {
      mode: mode,
      category: category,
      rank: attributes[0].innerHTML.slice(1, -1),
      rsn: attributes[1].childNodes[1].innerHTML.replace(/\uFFFD/g, ' ')
    }

    hiscores.skills.includes(category.toLowerCase()) ?
      playerInfo = Object.assign(
        {level: attributes[2].innerHTML.slice(1, -1),
          xp: attributes[3].innerHTML.slice(1, -1)}, playerInfo) :
      playerInfo.score = attributes[2].innerHTML.slice(1, -1)

    if(mode === 'hc') {
      playerInfo.dead = attributes[1].childElementCount > 1
    }

    players.push(playerInfo)
  }

  return players
}

/**
 * Returns proper capitalization and punctuation in a username.
 *
 * Searches hiscores table with rsn and returns the text from the username cell.
 *
 * @access public
 *
 * @param {string} rsn The player's username.
 *
 * @returns {string}   The player's formatted username.
 */
async function getRSNFormat(rsn) {
  const url = URLs.main + URLs.scores + 'table=0&user=' + rsn

  const response = await fetch(url)
  let element = document.createElement('html')
  element.innerHTML = await response.text()
  const cells = element.querySelectorAll('[style="color:#AA0022;"]')

  if(cells.length >= 2) {
    return cells[1].innerHTML.replace(/\uFFFD/g, ' ')
  }
  else {
    throw Error('Player not found')
  }
}

let parseStats = (csv) => {
  let stats = {
    stats:{
      overall:{rank:0,level:0,xp:0},
      attack:{rank:0,level:0,xp:0},
      defence:{rank:0,level:0,xp:0},
      strength:{rank:0,level:0,xp:0},
      hitpoints:{rank:0,level:0,xp:0},
      ranged:{rank:0,level:0,xp:0},
      prayer:{rank:0,level:0,xp:0},
      magic:{rank:0,level:0,xp:0},
      cooking:{rank:0,level:0,xp:0},
      woodcutting:{rank:0,level:0,xp:0},
      fletching:{rank:0,level:0,xp:0},
      fishing:{rank:0,level:0,xp:0},
      firemaking:{rank:0,level:0,xp:0},
      crafting:{rank:0,level:0,xp:0},
      smithing:{rank:0,level:0,xp:0},
      mining:{rank:0,level:0,xp:0},
      herblore:{rank:0,level:0,xp:0},
      agility:{rank:0,level:0,xp:0},
      thieving:{rank:0,level:0,xp:0},
      slayer:{rank:0,level:0,xp:0},
      farming:{rank:0,level:0,xp:0},
      runecraft:{rank:0,level:0,xp:0},
      hunter:{rank:0,level:0,xp:0},
      construction:{rank:0,level:0,xp:0}
    },
    clues:{
      all:{rank:0,score:0},
      easy:{rank:0,score:0},
      medium:{rank:0,score:0},
      hard:{rank:0,score:0},
      elite:{rank:0,score:0},
      master:{rank:0,score:0}
    },
    bh:{
      rogue:{rank:0,score:0},
      hunter:{rank:0,score:0}
    },
    lms:{rank:0,score:0}
  }, splitCSV = csv.split('\n'), i = 0, skillInfo
  for (let skill of hiscores.skills) {
    skillInfo = splitCSV[i].split(',')
    stats.stats[skill].rank = skillInfo[0]
    stats.stats[skill].level = skillInfo[1]
    stats.stats[skill].xp = skillInfo[2]
    i++
  }

  skillInfo = splitCSV[26].split(',')
  stats.clues.all.rank = skillInfo[0]
  stats.clues.all.score = skillInfo[1]
  skillInfo = splitCSV[24].split(',')
  stats.clues.easy.rank = skillInfo[0]
  stats.clues.easy.score = skillInfo[1]
  skillInfo = splitCSV[25].split(',')
  stats.clues.medium.rank = skillInfo[0]
  stats.clues.medium.score = skillInfo[1]
  skillInfo = splitCSV[29].split(',')
  stats.clues.hard.rank = skillInfo[0]
  stats.clues.hard.score = skillInfo[1]
  skillInfo = splitCSV[31].split(',')
  stats.clues.elite.rank = skillInfo[0]
  stats.clues.elite.score = skillInfo[1]
  skillInfo = splitCSV[32].split(',')
  stats.clues.master.rank = skillInfo[0]
  stats.clues.master.score = skillInfo[1]

  skillInfo = splitCSV[27].split(',')
  stats.bh.rogue.rank = skillInfo[0]
  stats.bh.rogue.score = skillInfo[1]
  skillInfo = splitCSV[28].split(',')
  stats.bh.hunter.rank = skillInfo[0]
  stats.bh.hunter.score = skillInfo[1]

  skillInfo = splitCSV[30].split(',')
  stats.lms.rank = skillInfo[0]
  stats.lms.score = skillInfo[1]

  return stats
}

export default {getStats, getHiscores, getRSNFormat}