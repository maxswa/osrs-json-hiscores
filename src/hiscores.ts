import { JSDOM } from 'jsdom';
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
  Bosses
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
  httpGet,
  BOSSES
} from './utils';

/**
 * Screen scrapes the hiscores to get the formatted rsn of a player.
 *
 * @param rsn Username of the player.
 * @returns Formatted version of the rsn.
 */
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
    const response = await httpGet(url);
    const dom = new JSDOM(response.data);
    const spans = dom.window.document.querySelectorAll(
      'span[style="color:#AA0022;"]'
    );
    if (spans.length >= 2) {
      const nameSpan = spans[1];
      return rsnFromElement(nameSpan);
    }
    throw Error('Player not found');
  } catch {
    throw Error('Player not found');
  }
}

/**
 * Parses CSV string of raw stats and returns a stats object.
 *
 * @param csv Raw CSV from the official OSRS API.
 * @returns Parsed stats object.
 */
export function parseStats(csv: string): Stats {
  const splitCSV = csv
    .split('\n')
    .filter((entry) => !!entry)
    .map((stat) => stat.split(','));

  const skillObjects: Skill[] = splitCSV
    .filter((stat) => stat.length === 3)
    .map((stat) => {
      const [rank, level, xp] = stat;
      const skill: Skill = {
        rank: parseInt(rank, 10),
        level: parseInt(level, 10),
        xp: parseInt(xp, 10)
      };
      return skill;
    });

  const activityObjects: Activity[] = splitCSV
    .filter((stat) => stat.length === 2)
    .map((stat) => {
      const [rank, score] = stat;
      const activity: Activity = {
        rank: parseInt(rank, 10),
        score: parseInt(score, 10)
      };
      return activity;
    });

  const [leaguePoints] = activityObjects.splice(0, 1);
  const bhObjects = activityObjects.splice(0, BH_MODES.length);
  const clueObjects = activityObjects.splice(0, CLUES.length);
  const [lastManStanding, soulWarsZeal] = activityObjects.splice(0, 2);
  const bossObjects = activityObjects.splice(0, BOSSES.length);

  const skills: Skills = skillObjects.reduce<Skills>((prev, curr, index) => {
    const newSkills = { ...prev };
    newSkills[SKILLS[index]] = curr;
    return newSkills;
  }, {} as Skills);

  const bountyHunter: BH = bhObjects.reduce<BH>((prev, curr, index) => {
    const newBH = { ...prev };
    newBH[BH_MODES[index]] = curr;
    return newBH;
  }, {} as BH);

  const clues: Clues = clueObjects.reduce<Clues>((prev, curr, index) => {
    const newClues = { ...prev };
    newClues[CLUES[index]] = curr;
    return newClues;
  }, {} as Clues);

  const bosses: Bosses = bossObjects.reduce<Bosses>((prev, curr, index) => {
    const newBosses = { ...prev };
    newBosses[BOSSES[index]] = curr;
    return newBosses;
  }, {} as Bosses);

  const stats: Stats = {
    skills,
    leaguePoints,
    bountyHunter,
    lastManStanding,
    soulWarsZeal,
    clues,
    bosses
  };

  return stats;
}

/**
 * Fetches stats from the OSRS API and consolidates the info into a player object.
 *
 * **Note:** This function will make up to 5 separate network requests.
 * As such, it is highly subject to the performance of the official OSRS API.
 *
 * @param rsn Username of the player.
 * @returns Player object.
 */
export async function getStats(rsn: string): Promise<Player> {
  if (typeof rsn !== 'string') {
    throw Error('RSN must be a string');
  } else if (!/^[a-zA-Z0-9 _]+$/.test(rsn)) {
    throw Error('RSN contains invalid character');
  } else if (rsn.length > 12 || rsn.length < 1) {
    throw Error('RSN must be between 1 and 12 characters');
  }

  const mainRes = await httpGet(getStatsURL('main', rsn));
  if (mainRes.status === 200) {
    const otherResponses = await Promise.all([
      httpGet(getStatsURL('ironman', rsn)).catch((err) => err),
      httpGet(getStatsURL('hardcore', rsn)).catch((err) => err),
      httpGet(getStatsURL('ultimate', rsn)).catch((err) => err),
      getRSNFormat(rsn).catch(() => undefined)
    ]);

    const [ironRes, hcRes, ultRes, formattedName] = otherResponses;

    const player: Player = {
      name: formattedName ?? rsn,
      mode: 'main',
      dead: false,
      deulted: false,
      deironed: false
    };
    player.main = parseStats(mainRes.data);

    if (ironRes.status === 200) {
      player.ironman = parseStats(ironRes.data);
      if (hcRes.status === 200) {
        player.mode = 'hardcore';
        player.hardcore = parseStats(hcRes.data);
        if (
          player.ironman.skills.overall.xp !== player.hardcore.skills.overall.xp
        ) {
          player.dead = true;
          player.mode = 'ironman';
        }
        if (
          player.main.skills.overall.xp !== player.ironman.skills.overall.xp
        ) {
          player.deironed = true;
          player.mode = 'main';
        }
      } else if (ultRes.status === 200) {
        player.mode = 'ultimate';
        player.ultimate = parseStats(ultRes.data);
        if (
          player.ironman.skills.overall.xp !== player.ultimate.skills.overall.xp
        ) {
          player.deulted = true;
          player.mode = 'ironman';
        }
        if (
          player.main.skills.overall.xp !== player.ironman.skills.overall.xp
        ) {
          player.deironed = true;
          player.mode = 'main';
        }
      } else {
        player.mode = 'ironman';
        if (
          player.main.skills.overall.xp !== player.ironman.skills.overall.xp
        ) {
          player.deironed = true;
          player.mode = 'main';
        }
      }
    }

    return player;
  }
  throw Error('Player not found');
}

/**
 * Fetches stats from the OSRS API and returns them as an object.
 *
 * @param rsn Username of the player.
 * @param mode Gamemode to fetch ranks for.
 * @returns Stats object.
 */
export async function getStatsByGamemode(
  rsn: string,
  mode: Gamemode = 'main'
): Promise<Stats> {
  if (typeof rsn !== 'string') {
    throw Error('RSN must be a string');
  } else if (!/^[a-zA-Z0-9 _]+$/.test(rsn)) {
    throw Error('RSN contains invalid character');
  } else if (rsn.length > 12 || rsn.length < 1) {
    throw Error('RSN must be between 1 and 12 characters');
  } else if (!GAMEMODES.includes(mode)) {
    throw Error('Invalid game mode');
  }
  const response = await httpGet(getStatsURL(mode, rsn));
  if (response.status !== 200) {
    throw Error('Player not found');
  }
  const stats = parseStats(response.data);

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

  const response = await httpGet(url);
  const dom = new JSDOM(response.data);
  const playersHTML = dom.window.document.querySelectorAll(
    '.personal-hiscores__row'
  );

  const players: PlayerSkillRow[] = [];
  playersHTML.forEach((row) => {
    const rankEl = row.querySelector('td');
    const nameEl = row.querySelector('td a');
    const levelEl = row.querySelector('td.left + td');
    const xpEl = row.querySelector('td.left + td + td');
    const isDead = !!row.querySelector('td img');

    players.push({
      name: rsnFromElement(nameEl),
      rank: numberFromElement(rankEl),
      level: numberFromElement(levelEl),
      xp: numberFromElement(xpEl),
      dead: isDead
    });
  });

  return players;
}

/**
 * Screen scrapes a hiscores page of an activity or boss and returns an array of up to 25 players.
 *
 * @param activity Name of the activity or boss to fetch hiscores for.
 * @param mode Gamemode to fetch ranks for.
 * @param page Page number.
 * @returns Array of `PlayerActivityRow` objects.
 */
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

  const response = await httpGet(url);
  const dom = new JSDOM(response.data);
  const playersHTML = dom.window.document.querySelectorAll(
    '.personal-hiscores__row'
  );

  const players: PlayerActivityRow[] = [];
  playersHTML.forEach((row) => {
    const rankEl = row.querySelector('td');
    const nameEl = row.querySelector('td a');
    const scoreEl = row.querySelector('td.left + td');
    const isDead = !!row.querySelector('td img');

    players.push({
      name: rsnFromElement(nameEl),
      rank: numberFromElement(rankEl),
      score: numberFromElement(scoreEl),
      dead: isDead
    });
  });

  return players;
}
