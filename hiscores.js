const axios = require('axios');
const cheerio = require('cheerio');

const URLs = {
    main: 'http://services.runescape.com/m=hiscore_oldschool/',
    iron: 'http://services.runescape.com/m=hiscore_oldschool_ironman/',
    ult: 'http://services.runescape.com/m=hiscore_oldschool_ultimate/',
    hc: 'http://services.runescape.com/m=hiscore_oldschool_hardcore_ironman/',
    dmm: 'http://services.runescape.com/m=hiscore_oldschool_deadman/',
    sdmm: 'http://services.runescape.com/m=hiscore_oldschool_seasonal/',
    dmmt: 'http://services.runescape.com/m=hiscore_oldschool_tournament/',
    stats: 'index_lite.ws?player=',
    scores: 'overall.ws?',
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
      'construction',
    ],
    clues: ['all', 'beginner', 'easy', 'medium', 'hard', 'elite', 'master'],
    bh: ['rouge', 'hunter'],
    other: [
      'hunterbh',
      'roguebh',
      'lms',
      'allclues',
      'beginnerclues',
      'easyclues',
      'mediumclues',
      'hardclues',
      'eliteclues',
      'masterclues',
    ],
  },
  validModes = ['full', 'main', 'iron', 'hc', 'ult', 'dmm', 'sdmm', 'dmmt'];

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
async function getStats(rsn, mode = 'full') {
  if (typeof rsn !== 'string') {
    throw Error('RSN must be a string');
  } else if (!/^[a-zA-Z0-9 _]+$/.test(rsn)) {
    throw Error('RSN contains invalid character');
  } else if (rsn.length > 12 || rsn.length < 1) {
    throw Error('RSN must be between 1 and 12 characters');
  } else if (!validModes.includes(mode.toLowerCase())) {
    throw Error('Invalid game mode');
  } else {
    return await getPlayerStats(rsn, mode.toLowerCase());
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
async function getPlayerStats(rsn, mode) {
  let player = {
    rsn: rsn,
    mode: mode,
    dead: false,
    deironed: false,
  };

  if (mode === 'full') {
    const responses = [];

    responses[0] = await axios(
      URLs.main + URLs.stats + encodeURIComponent(rsn)
    );

    if (responses[0].status === 200) {
      const otherResponses = await Promise.all([
        axios(URLs.iron + URLs.stats + encodeURIComponent(rsn)).catch(
          res => res
        ),
        axios(URLs.hc + URLs.stats + encodeURIComponent(rsn)).catch(res => res),
        axios(URLs.ult + URLs.stats + encodeURIComponent(rsn)).catch(
          res => res
        ),
        getRSNFormat(rsn),
      ]);

      player.rsn = otherResponses.pop();

      for (let res of otherResponses) {
        responses.push(res);
      }

      if (responses[1].status === 200) {
        if (responses[2].status === 200) {
          player.mode = 'hc';
        } else if (responses[3].status === 200) {
          player.mode = 'ult';
        } else {
          player.mode = 'iron';
        }
      } else {
        player.mode = 'main';
      }
    } else {
      throw Error('Player not found');
    }

    switch (player.mode) {
      case 'main':
        player.main = parseStats(responses[0].data);
        break;
      case 'iron':
        player.main = parseStats(responses[0].data);
        player.iron = parseStats(responses[1].data);
        if (player.main.stats.overall.xp !== player.iron.stats.overall.xp) {
          player.deironed = true;
          player.mode = 'main';
        }
        break;
      case 'hc':
        player.main = parseStats(responses[0].data);
        player.iron = parseStats(responses[1].data);
        player.hc = parseStats(responses[2].data);
        if (player.iron.stats.overall.xp !== player.hc.stats.overall.xp) {
          player.dead = true;
          player.mode = 'iron';
        }
        if (player.main.stats.overall.xp !== player.iron.stats.overall.xp) {
          player.deironed = true;
          player.mode = 'main';
        }
        break;
      case 'ult':
        player.main = parseStats(responses[0].data);
        player.iron = parseStats(responses[1].data);
        player.ult = parseStats(responses[3].data);
        if (player.main.stats.overall.xp !== player.iron.stats.overall.xp) {
          player.deironed = true;
          player.mode = 'main';
        }
        break;
    }

    return player;
  } else {
    const response = await axios(
      URLs[mode] + URLs.stats + encodeURIComponent(rsn)
    );
    if (response.status !== 200) {
      throw Error('Player not found');
    }
    player[mode] = parseStats(response.data);
    return player;
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
async function getHiscores(mode, category = 'overall', page = 1) {
  if (
    !validModes.includes(mode.toLowerCase()) ||
    mode.toLowerCase() === 'full'
  ) {
    throw Error('Invalid game mode');
  } else if (!Number.isInteger(page) || page < 1) {
    throw Error('Page must be an integer greater than 0');
  } else if (
    !hiscores.skills.includes(category.toLowerCase()) &&
    !hiscores.other.includes(category.toLowerCase())
  ) {
    throw Error('Invalid category');
  } else {
    return await getHiscoresPage(
      mode.toLowerCase(),
      category.toLowerCase(),
      page
    );
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
  const url =
    URLs[mode] +
    URLs.scores +
    (hiscores.skills.includes(category)
      ? 'table=' + hiscores.skills.indexOf(category)
      : 'category_type=1' + '&table=' + hiscores.other.indexOf(category)) +
    '&page=' +
    page;

  const players = [];
  const response = await axios(url);
  const $ = cheerio.load(response.data);
  const playersHTML = $('.personal-hiscores__row').toArray();

  for (let player of playersHTML) {
    const attributes = player.children.filter(node => node.name === 'td');
    console.log();
    let playerInfo = {
      mode: mode,
      category: category,
      rank: attributes[0].children[0].data.slice(1, -1),
      rsn: attributes[1].children[1].children[0].data.replace(/\uFFFD/g, ' '),
    };

    hiscores.skills.includes(category.toLowerCase())
      ? (playerInfo = Object.assign(
          {
            level: attributes[2].children[0].data.slice(1, -1),
            xp: attributes[3].children[0].data.slice(1, -1),
          },
          playerInfo
        ))
      : (playerInfo.score = attributes[2].children[0].data.slice(1, -1));

    if (mode === 'hc') {
      playerInfo.dead = attributes[1].children.length > 1;
    }

    players.push(playerInfo);
  }

  return players;
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
  const url =
    URLs.main + URLs.scores + 'table=0&user=' + encodeURIComponent(rsn);

  try {
    const response = await axios(url);
    const $ = cheerio.load(response.data);
    return $('[style="color:#AA0022;"]')[1].children[0].data.replace(
      /\uFFFD/g,
      ' '
    );
  } catch {
    throw Error('Player not found');
  }
}

let parseStats = csv => {
  const stats = {
    stats: {},
    clues: {},
    bh: {},
    lms: {},
  };
  const splitCSV = csv.split('\n');

  const statObjects = splitCSV
    .filter(stat => !!stat)
    .map(stat => {
      const splitStat = stat.split(',');
      const obj = {};
      if (splitStat.length === 3) {
        [obj.rank, obj.level, obj.xp] = splitStat;
      } else {
        [obj.rank, obj.score] = splitStat;
      }
      return obj;
    });

  statObjects.forEach((obj, index) => {
    if (index < hiscores.skills.length) {
      stats.stats[hiscores.skills[index]] = obj;
    } else if (index < hiscores.skills.length + hiscores.bh.length) {
      stats.bh[hiscores.bh[index - hiscores.skills.length]] = obj;
    } else if (index < hiscores.skills.length + hiscores.bh.length + 1) {
      stats.lms = obj;
    } else {
      stats.clues[
        hiscores.clues[index - hiscores.skills.length - hiscores.bh.length - 1]
      ] = obj;
    }
  });

  return stats;
};

module.exports = { getStats, getHiscores, getRSNFormat };
