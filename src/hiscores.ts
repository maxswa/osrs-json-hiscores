import axios from 'axios';
// import cheerio from 'cheerio';
import {
  Player,
  Mode,
  Activity,
  Skill,
  Stats,
  Skills,
  BH as BHStats,
  Clues,
} from './types';
import { getStatsURL, SKILLS, BH, CLUES } from './utils';

// async function getStats(rsn, mode = 'full') {
//   if (typeof rsn !== 'string') {
//     throw Error('RSN must be a string');
//   } else if (!/^[a-zA-Z0-9 _]+$/.test(rsn)) {
//     throw Error('RSN contains invalid character');
//   } else if (rsn.length > 12 || rsn.length < 1) {
//     throw Error('RSN must be between 1 and 12 characters');
//   } else if (!validModes.includes(mode.toLowerCase())) {
//     throw Error('Invalid game mode');
//   } else {
//     return await getPlayerStats(rsn, mode.toLowerCase());
//   }
// }

// async function getPlayerStats(rsn: string, mode: Mode): Promise<Player> {
//   if (mode === 'full') {
//   } else {
//     const response = await axios(getStatsURL(mode, rsn));
//     if (response.status !== 200) {
//       throw Error('Player not found');
//     }
//     const player: Player = {
//       rsn,
//       mode,
//       dead: false,
//       deironed: false,
//       [mode]: parseStats(response.data),
//     };
//     return player;
//   }
// }

// /**
//  * Gets a hiscore page.
//  *
//  * Scrapes OSRS hiscores and converts to objects.
//  *
//  * @access public
//  *
//  * @param {string} mode       The game mode.
//  * @param {string} [category] The category of hiscores.
//  * @param {number} [page]     The page of players.
//  *
//  * @returns {Object[]} Array of player objects.
//  */
// async function getHiscores(mode, category = 'overall', page = 1) {
//   if (
//     !validModes.includes(mode.toLowerCase()) ||
//     mode.toLowerCase() === 'full'
//   ) {
//     throw Error('Invalid game mode');
//   } else if (!Number.isInteger(page) || page < 1) {
//     throw Error('Page must be an integer greater than 0');
//   } else if (
//     !hiscores.skills.includes(category.toLowerCase()) &&
//     !hiscores.other.includes(category.toLowerCase())
//   ) {
//     throw Error('Invalid category');
//   } else {
//     return await getHiscoresPage(
//       mode.toLowerCase(),
//       category.toLowerCase(),
//       page
//     );
//   }
// }

// /**
//  * Gets a hiscore page.
//  *
//  * Scrapes OSRS hiscores and converts to objects.
//  *
//  * @access private
//  *
//  * @param {string} mode       The game mode.
//  * @param {string} category   The category of hiscores.
//  * @param {number} page       The page of players.
//  *
//  * @returns {Object[]} Array of player objects.
//  */
// async function getHiscoresPage(mode, category, page) {
//   const url =
//     URLs[mode] +
//     URLs.scores +
//     (hiscores.skills.includes(category)
//       ? 'table=' + hiscores.skills.indexOf(category)
//       : 'category_type=1' + '&table=' + hiscores.other.indexOf(category)) +
//     '&page=' +
//     page;

//   const players = [];
//   const response = await axios(url);
//   const $ = cheerio.load(response.data);
//   const playersHTML = $('.personal-hiscores__row').toArray();

//   for (let player of playersHTML) {
//     const attributes = player.children.filter(node => node.name === 'td');
//     console.log();
//     let playerInfo = {
//       mode: mode,
//       category: category,
//       rank: attributes[0].children[0].data.slice(1, -1),
//       rsn: attributes[1].children[1].children[0].data.replace(/\uFFFD/g, ' '),
//     };

//     hiscores.skills.includes(category.toLowerCase())
//       ? (playerInfo = Object.assign(
//           {
//             level: attributes[2].children[0].data.slice(1, -1),
//             xp: attributes[3].children[0].data.slice(1, -1),
//           },
//           playerInfo
//         ))
//       : (playerInfo.score = attributes[2].children[0].data.slice(1, -1));

//     if (mode === 'hc') {
//       playerInfo.dead = attributes[1].children.length > 1;
//     }

//     players.push(playerInfo);
//   }

//   return players;
// }

// /**
//  * Returns proper capitalization and punctuation in a username.
//  *
//  * Searches hiscores table with rsn and returns the text from the username cell.
//  *
//  * @access public
//  *
//  * @param {string} rsn The player's username.
//  *
//  * @returns {string}   The player's formatted username.
//  */
// async function getRSNFormat(rsn) {
//   const url =
//     URLs.main + URLs.scores + 'table=0&user=' + encodeURIComponent(rsn);

//   try {
//     const response = await axios(url);
//     const $ = cheerio.load(response.data);
//     return $('[style="color:#AA0022;"]')[1].children[0].data.replace(
//       /\uFFFD/g,
//       ' '
//     );
//   } catch {
//     throw Error('Player not found');
//   }
// }

export const parseStats = (csv: string): Stats => {
  const splitCSV = csv
    .split('\n')
    .filter(entry => !!entry)
    .map(stat => stat.split(','));

  const skillObjects: Skill[] = splitCSV
    .filter(stat => stat.length === 3)
    .map(stat => {
      const skill: Skill = {
        rank: parseInt(stat[0], 10),
        level: parseInt(stat[1], 10),
        xp: parseInt(stat[2], 10),
      };
      return skill;
    });

  const activityObjects: Activity[] = splitCSV
    .filter(stat => stat.length === 2)
    .map(stat => {
      const activity: Activity = {
        rank: parseInt(stat[0], 10),
        score: parseInt(stat[1], 10),
      };
      return activity;
    });

  const bhObjects = activityObjects.splice(0, BH.length);
  const [lms] = activityObjects.splice(0, 1);
  const clueObjects = activityObjects.splice(0, CLUES.length);

  const skills: Skills = skillObjects.reduce<Skills>(
    (prev, curr, index) => {
      const newSkills = { ...prev };
      newSkills[SKILLS[index]] = curr;
      return newSkills;
    },
    {} as Skills
  );

  const bh: BHStats = bhObjects.reduce<BHStats>(
    (prev, curr, index) => {
      const newBH = { ...prev };
      newBH[BH[index]] = curr;
      return newBH;
    },
    {} as BHStats
  );

  const clues: Clues = clueObjects.reduce<Clues>(
    (prev, curr, index) => {
      const newClues = { ...prev };
      newClues[CLUES[index]] = curr;
      return newClues;
    },
    {} as Clues
  );

  const stats: Stats = {
    skills,
    bh,
    lms,
    clues,
  };

  return stats;
};
