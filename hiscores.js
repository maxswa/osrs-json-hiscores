const statsURL = {
  main: 'http://services.runescape.com/m=hiscore_oldschool/index_lite.ws?player=',
  iron: 'http://services.runescape.com/m=hiscore_oldschool_ironman/index_lite.ws?player=',
  ult: 'http://services.runescape.com/m=hiscore_oldschool_ultimate/index_lite.ws?player=',
  hc: 'http://services.runescape.com/m=hiscore_oldschool_hardcore_ironman/index_lite.ws?player='
},
  scoresURL = {
  main: 'http://services.runescape.com/m=hiscore_oldschool/overall.ws?',
  iron: 'http://services.runescape.com/m=hiscore_oldschool_ironman/overall.ws?',
  ult: 'http://services.runescape.com/m=hiscore_oldschool_ultimate/overall.ws?',
  hc: 'http://services.runescape.com/m=hiscore_oldschool_hardcore_ironman/overall.ws?'
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
  validModes = ['full', 'main', 'iron', 'hc', 'ult']

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

async function getPlayerStats (rsn, mode) {
  let player = {
    rsn: rsn,
    mode: mode,
    dead: false,
    deironed: false,
    main: {},
    iron: {},
    hc: {},
    ult: {}
  }
  if(mode === 'full') {
    const responses = []
    let csv

    responses[0] = await fetch(statsURL.main + encodeURIComponent(rsn))
    if (responses[0].ok) {
      responses[1] = await fetch(statsURL.iron + encodeURIComponent(rsn))
      if (responses[1].ok) {
        responses[2] = await fetch(statsURL.hc + encodeURIComponent(rsn))
        if (responses[2].ok) {
          player.mode = 'hc'
        }
        else {
          responses[3] = await fetch(statsURL.ult + encodeURIComponent(rsn))
          if (responses[3].ok) {
            player.mode = 'ult'
          }
          else {
            player.mode = 'iron'
          }
        }
      }
      else {
        player.mode = 'main'
      }
    }
    else {
      throw Error('Player not found')
    }

    //TODO make a function to handle the csv
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
    const response = await fetch(statsURL[mode] + encodeURIComponent(rsn))
    if(!response.ok) {
      throw Error('Player not found')
    }
    const csv = await response.text()
    player[mode] = parseStats(csv)
    return player
  }
}

async function getHiscores (mode, category, page) {
  let url = scoresURL[mode.toLowerCase()]

  if(hiscores.skills.includes(category.toLowerCase())) {
    url += 'table=' + hiscores.skills.indexOf(category.toLowerCase()) + '&page=' + page
  }
  else if(hiscores.other.includes(category.toLowerCase())) {
    url += 'category_type=1' + '&table=' + hiscores.other.indexOf(category.toLowerCase()) + '&page=' + page
  }
  const response = await fetch(url)
  let playersHTML, players = [], element = document.createElement('html')
  element.innerHTML = await response.text()
  playersHTML = element.querySelectorAll('.personal-hiscores__row')

  for(let player of playersHTML) {
    let attributes = player.querySelectorAll('td')
    if(hiscores.skills.includes(category.toLowerCase())) {
      players.push({
        category: category,
        rank: attributes[0].innerHTML.slice(1, -1),
        rsn: attributes[1].childNodes[1],
        level: attributes[2].innerHTML.slice(1, -1),
        xp: attributes[3].innerHTML.slice(1, -1),
        mode: mode
      })
    }
    else {
      players.push({
        category: category,
        rank: attributes[0].innerHTML.slice(1, -1),
        rsn: attributes[1].childNodes[1],
        score: attributes[2].innerHTML.slice(1, -1),
        mode: mode
      })
    }
  }

  return players
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

module.exports = {getStats, getHiscores}