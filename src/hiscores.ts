import axios from 'axios';
import * as cheerio from 'cheerio';
import {
  Player,
  Activity,
  Skill,
  Stats,
  Skills,
  BH,
  Clues,
  Gamemode,
  SkillName,
  PlayerSkillRow,
  ActivityName,
  PlayerActivityRow,
  Bosses,
  LeagueStats,
  Boss,
} from './types';
import {
  getStatsURL,
  SKILLS,
  BH_MODES,
  CLUES,
  getPlayerTableURL,
  getSkillPageURL,
  GAMEMODES,
  ACTIVITIES,
  numberFromElement,
  rsnFromElement,
  getActivityPageURL,
  BOSSES,
} from './utils';

export async function getStats(rsn: string): Promise<Player> {
  if (typeof rsn !== 'string') {
    throw Error('RSN must be a string');
  } else if (!/^[a-zA-Z0-9 _]+$/.test(rsn)) {
    throw Error('RSN contains invalid character');
  } else if (rsn.length > 12 || rsn.length < 1) {
    throw Error('RSN must be between 1 and 12 characters');
  }

  const mainRes = await axios(getStatsURL('main', rsn));
  if (mainRes.status === 200) {
    const otherResponses = await Promise.all([
      axios(getStatsURL('iron', rsn)).catch(err => err),
      axios(getStatsURL('hc', rsn)).catch(err => err),
      axios(getStatsURL('ult', rsn)).catch(err => err),
      getRSNFormat(rsn),
    ]);

    const [ironRes, hcRes, ultRes, formattedName] = otherResponses;

    const player: Player = {
      rsn: formattedName,
      mode: 'main',
      dead: false,
      deulted: false,
      deironed: false,
    };
    player.main = parseStats(mainRes.data);

    if (ironRes.status === 200) {
      player.iron = parseStats(ironRes.data);
      if (hcRes.status === 200) {
        player.mode = 'hc';
        player.hc = parseStats(hcRes.data);
        if (player.iron.skills.overall.xp !== player.hc.skills.overall.xp) {
          player.dead = true;
          player.mode = 'iron';
        }
        if (player.main.skills.overall.xp !== player.iron.skills.overall.xp) {
          player.deironed = true;
          player.mode = 'main';
        }
      } else if (ultRes.status === 200) {
        player.mode = 'ult';
        player.ult = parseStats(ultRes.data);
        if (player.iron.skills.overall.xp !== player.ult.skills.overall.xp) {
          player.deulted = true;
          player.mode = 'iron';
        }
        if (player.main.skills.overall.xp !== player.iron.skills.overall.xp) {
          player.deironed = true;
          player.mode = 'main';
        }
      } else {
        player.mode = 'iron';
        if (player.main.skills.overall.xp !== player.iron.skills.overall.xp) {
          player.deironed = true;
          player.mode = 'main';
        }
      }
    }

    return player;
  }
  throw Error('Player not found');
}

export async function getStatsByGamemode<T extends Gamemode = 'main'>(
  rsn: string,
  mode: T = 'main' as T
): Promise<T extends 'leagues' ? LeagueStats : Stats> {
  if (typeof rsn !== 'string') {
    throw Error('RSN must be a string');
  } else if (!/^[a-zA-Z0-9 _]+$/.test(rsn)) {
    throw Error('RSN contains invalid character');
  } else if (rsn.length > 12 || rsn.length < 1) {
    throw Error('RSN must be between 1 and 12 characters');
  } else if (!GAMEMODES.includes(mode)) {
    throw Error('Invalid game mode');
  }
  const response = await axios(getStatsURL(mode, rsn));
  if (response.status !== 200) {
    throw Error('Player not found');
  }
  const stats = parseStats(response.data, mode);

  return stats;
}

export async function getSkillPage(
  skill: SkillName,
  mode: Gamemode = 'main',
  page: number = 1
): Promise<PlayerSkillRow[]> {
  if (!GAMEMODES.includes(mode)) {
    throw Error('Invalid game mode');
  } else if (!Number.isInteger(page) || page < 1) {
    throw Error('Page must be an integer greater than 0');
  } else if (!SKILLS.includes(skill)) {
    throw Error('Invalid skill');
  }
  const url = getSkillPageURL(mode, skill, page);

  const response = await axios(url);
  const $ = cheerio.load(response.data);
  const playersHTML = $('.personal-hiscores__row').toArray();

  const players: PlayerSkillRow[] = playersHTML.map(row => {
    const cells = row.children.filter(el => el.name === 'td');
    const [rankEl, nameCell, levelEl, xpEl] = cells;
    const [nameEl] = nameCell.children.filter(el => el.name === 'a');

    return {
      rsn: rsnFromElement(nameEl),
      rank: numberFromElement(rankEl),
      level: numberFromElement(levelEl),
      xp: numberFromElement(xpEl),
      dead: nameCell.children.length === 4,
    };
  });

  return players;
}

export async function getActivityPage(
  activity: ActivityName,
  mode: Gamemode = 'main',
  page: number = 1
): Promise<PlayerActivityRow[]> {
  if (!GAMEMODES.includes(mode)) {
    throw Error('Invalid game mode');
  } else if (!Number.isInteger(page) || page < 1) {
    throw Error('Page must be an integer greater than 0');
  } else if (!ACTIVITIES.includes(activity)) {
    throw Error('Invalid activity');
  }
  const url = getActivityPageURL(mode, activity, page);

  const response = await axios(url);
  const $ = cheerio.load(response.data);
  const playersHTML = $('.personal-hiscores__row').toArray();

  const players: PlayerActivityRow[] = playersHTML.map(row => {
    const cells = row.children.filter(el => el.name === 'td');
    const [rankEl, nameCell, scoreEl] = cells;
    const [nameEl] = nameCell.children.filter(el => el.name === 'a');

    return {
      rsn: rsnFromElement(nameEl),
      rank: numberFromElement(rankEl),
      score: numberFromElement(scoreEl),
      dead: nameCell.children.length === 4,
    };
  });

  return players;
}

export async function getRSNFormat(rsn: string): Promise<string> {
  if (typeof rsn !== 'string') {
    throw Error('RSN must be a string');
  } else if (!/^[a-zA-Z0-9 _]+$/.test(rsn)) {
    throw Error('RSN contains invalid character');
  } else if (rsn.length > 12 || rsn.length < 1) {
    throw Error('RSN must be between 1 and 12 characters');
  }

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
}

export function parseStats<T extends Gamemode = 'main'>(
  csv: string,
  mode: T = 'main' as T
): T extends 'leagues' ? LeagueStats : Stats {
  const splitCSV = csv
    .split('\n')
    .filter(entry => !!entry)
    .map(stat => stat.split(','));

  const skillObjects: Skill[] = splitCSV
    .filter(stat => stat.length === 3)
    .map(stat => {
      const [rank, level, xp] = stat;
      const skill: Skill = {
        rank: parseInt(rank, 10),
        level: parseInt(level, 10),
        xp: parseInt(xp, 10),
      };
      return skill;
    });

  const activityObjects: Activity[] = splitCSV
    .filter(stat => stat.length === 2)
    .map(stat => {
      const [rank, score] = stat;
      const activity: Activity = {
        rank: parseInt(rank, 10),
        score: parseInt(score, 10),
      };
      return activity;
    });

  const [lp] = activityObjects.splice(0, 1);
  const bhObjects = activityObjects.splice(0, BH_MODES.length);
  const clueObjects = activityObjects.splice(0, CLUES.length);
  const [lms] = activityObjects.splice(0, 1);
  const bossObjects = activityObjects.splice(0, BOSSES.length);

  const skills: Skills = skillObjects.reduce<Skills>((prev, curr, index) => {
    const newSkills = { ...prev };
    newSkills[SKILLS[index]] = curr;
    return newSkills;
  }, {} as Skills);

  const bh: BH = bhObjects.reduce<BH>((prev, curr, index) => {
    const newBH = { ...prev };
    newBH[BH_MODES[index]] = curr;
    return newBH;
  }, {} as BH);

  const clues: Clues = clueObjects.reduce<Clues>((prev, curr, index) => {
    const newClues = { ...prev };
    newClues[CLUES[index]] = curr;
    return newClues;
  }, {} as Clues);

  // TODO Remove as soon as Jagex's API is fixed
  const brokenBosses: Boss[] = ['callisto', 'cerberus'];
  const TEMPBOSSES: Boss[] = BOSSES.reduce<Boss[]>(
    (prev, curr) => (brokenBosses.includes(curr) ? prev : [...prev, curr]),
    []
  );

  const bosses: Bosses = bossObjects.reduce<Bosses>((prev, curr, index) => {
    const newBosses = { ...prev };
    newBosses[TEMPBOSSES[index]] = brokenBosses.includes(BOSSES[index])
      ? { rank: -1, score: -1 }
      : curr;
    return newBosses;
  }, {} as Bosses);

  // TODO Remove as soon as Jagex's API is fixed
  brokenBosses.forEach(broken => {
    bosses[broken] = {
      rank: -1,
      score: -1,
    };
  });

  const stats: Stats = {
    skills,
    bh,
    lms,
    clues,
    bosses,
  };

  const leagueStats: LeagueStats = {
    skills,
    lp,
    clues,
    bosses,
  };

  return (mode === 'leagues' ? leagueStats : stats) as T extends 'leagues'
    ? LeagueStats
    : Stats;
}
