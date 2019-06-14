import axios from 'axios';
import * as cheerio from 'cheerio';
import {
  Player,
  Mode,
  Activity,
  Skill,
  Stats,
  Skills,
  BH as BHStats,
  Clues,
  Gamemode,
  Category,
} from './types';
import {
  getStatsURL,
  SKILLS,
  BH,
  CLUES,
  MODES,
  getPlayerTableURL,
  getHiscoresPageURL,
} from './utils';

export async function getStats(
  rsn: string,
  mode: Mode = 'full'
): Promise<Player> {
  if (typeof rsn !== 'string') {
    throw Error('RSN must be a string');
  } else if (!/^[a-zA-Z0-9 _]+$/.test(rsn)) {
    throw Error('RSN contains invalid character');
  } else if (rsn.length > 12 || rsn.length < 1) {
    throw Error('RSN must be between 1 and 12 characters');
  } else if (!MODES.includes(mode)) {
    throw Error('Invalid game mode');
  }
  if (mode === 'full') {
    const mainRes = await axios(getStatsURL('main', rsn));
    if (mainRes.status === 200) {
      const otherResponses = await Promise.all([
        axios(getStatsURL('iron', rsn)).catch(err => err),
        axios(getStatsURL('hc', rsn)).catch(err => err),
        axios(getStatsURL('ult', rsn)).catch(err => err),
        getRSNFormat(rsn),
      ]);

      let gameMode: Gamemode = 'main';
      const [ironRes, hcRes, ultRes, formattedName] = otherResponses;

      if (ironRes.status === 200) {
        if (hcRes.status === 200) {
          gameMode = 'hc';
        } else if (ultRes.status === 200) {
          gameMode = 'ult';
        } else {
          gameMode = 'iron';
        }
      } else {
        gameMode = 'main';
      }

      const player: Player = {
        rsn,
        mode: gameMode,
        dead: false,
        deironed: false,
      };

      switch (gameMode) {
        case 'iron':
          player.main = parseStats(mainRes.data);
          player.iron = parseStats(ironRes.data);
          if (player.main.skills.overall.xp !== player.iron.skills.overall.xp) {
            player.deironed = true;
            player.mode = 'main';
          }
          break;
        case 'hc':
          player.main = parseStats(mainRes.data);
          player.iron = parseStats(ironRes.data);
          player.hc = parseStats(hcRes.data);
          if (player.iron.skills.overall.xp !== player.hc.skills.overall.xp) {
            player.dead = true;
            player.mode = 'iron';
          }
          if (player.main.skills.overall.xp !== player.iron.skills.overall.xp) {
            player.deironed = true;
            player.mode = 'main';
          }
          break;
        case 'ult':
          player.main = parseStats(mainRes.data);
          player.iron = parseStats(ironRes.data);
          player.ult = parseStats(ultRes.data);
          if (player.main.skills.overall.xp !== player.iron.skills.overall.xp) {
            player.deironed = true;
            player.mode = 'main';
          }
          break;
      }

      return player;
    }
    throw Error('Player not found');
  } else {
    const response = await axios(getStatsURL(mode, rsn));
    if (response.status !== 200) {
      throw Error('Player not found');
    }
    const player: Player = {
      rsn,
      mode,
      dead: false,
      deironed: false,
      [mode]: parseStats(response.data),
    };
    return player;
  }
}

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

// async function getHiscoresPage(
//   mode: Gamemode,
//   category: Category,
//   page: number
// ) {
//   const url = getHiscoresPageURL(mode, category, page);

//   const players = [];
//   const response = await axios(url);
//   const $ = cheerio.load(response.data);
//   const playersHTML = $('.personal-hiscores__row').toArray();

//   for (const player of playersHTML) {
//     const attributes = player.children.filter(node => node.name === 'td');

//     let playerInfo = {
//       mode,
//       category,
//       rank: (attributes[0].children[0].data || '').slice(1, -1),
//       rsn: (attributes[1].children[1].children[0].data || '').replace(
//         /\uFFFD/g,
//         ' '
//       ),
//     };

//     SKILLS.includes(category)
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

export const getRSNFormat = async (rsn: string) => {
  const url = getPlayerTableURL('main', rsn);

  try {
    const response = await axios(url);
    const $ = cheerio.load(response.data);
    const rawName = $('[style="color:#AA0022;"]')[1].children[0].data;
    if (rawName) {
      return rawName.replace(/\uFFFD/g, ' ');
    }
    throw Error('Player not found');
  } catch {
    throw Error('Player not found');
  }
};

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
