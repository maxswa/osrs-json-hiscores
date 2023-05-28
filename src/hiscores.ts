import { AxiosRequestConfig, AxiosResponse } from 'axios';
import { BinaryData, JSDOM } from 'jsdom';
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
  GetStatsOptions
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
  BOSSES,
  INVALID_FORMAT_ERROR,
  validateRSN
} from './utils';

/**
 * Screen scrapes the hiscores to get the formatted rsn of a player.
 *
 * @param rsn Username of the player.
 * @returns Formatted version of the rsn.
 */
export async function getRSNFormat(
  rsn: string,
  config?: AxiosRequestConfig
): Promise<string> {
  validateRSN(rsn);

  const url = getPlayerTableURL('main', rsn);
  try {
    const response = await httpGet<string | Buffer | BinaryData | undefined>(
      url,
      config
    );
    const dom = new JSDOM(response.data);
    const anchor = dom.window.document.querySelector(
      '.personal-hiscores__row.personal-hiscores__row--type-highlight a'
    );
    if (anchor) {
      return rsnFromElement(anchor);
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

  if (
    splitCSV.length !==
    SKILLS.length + BH_MODES.length + CLUES.length + BOSSES.length + 5
  ) {
    throw Error(INVALID_FORMAT_ERROR);
  }

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
  const [
    lastManStanding,
    pvpArena,
    soulWarsZeal,
    riftsClosed
  ] = activityObjects.splice(0, 4);
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
    pvpArena,
    soulWarsZeal,
    riftsClosed,
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
export async function getStats(
  rsn: string,
  options?: GetStatsOptions
): Promise<Player> {
  validateRSN(rsn);
  const otherGamemodes = options?.otherGamemodes ?? [
    'ironman',
    'hardcore',
    'ultimate'
  ];
  const shouldGetFormattedRsn = options?.shouldGetFormattedRsn ?? true;

  const mainRes = await httpGet<string>(
    getStatsURL('main', rsn),
    options?.axiosConfigs?.main
  );
  if (mainRes.status === 200) {
    const emptyResponse: AxiosResponse<string> = {
      status: 404,
      data: '',
      statusText: '',
      headers: {},
      config: {}
    };
    const getModeStats = async (
      mode: Extract<Gamemode, 'ironman' | 'hardcore' | 'ultimate'>
    ): Promise<AxiosResponse<string>> =>
      otherGamemodes.includes(mode)
        ? httpGet<string>(
            getStatsURL(mode, rsn),
            options?.axiosConfigs?.[mode]
          ).catch((err) => err)
        : emptyResponse;
    const formattedName = shouldGetFormattedRsn
      ? await getRSNFormat(rsn, options?.axiosConfigs?.rsn).catch(
          () => undefined
        )
      : undefined;

    const player: Player = {
      name: formattedName ?? rsn,
      mode: 'main',
      dead: false,
      deulted: false,
      deironed: false
    };
    player.main = parseStats(mainRes.data);

    const ironRes = await getModeStats('ironman');
    if (ironRes.status === 200) {
      player.ironman = parseStats(ironRes.data);
      const hcRes = await getModeStats('hardcore');
      const ultRes = await getModeStats('ultimate');
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
 * @param config Optional axios request config object.
 * @returns Stats object.
 */
export async function getStatsByGamemode(
  rsn: string,
  mode: Gamemode = 'main',
  config?: AxiosRequestConfig
): Promise<Stats> {
  validateRSN(rsn);
  if (!GAMEMODES.includes(mode)) {
    throw Error('Invalid game mode');
  }
  const response = await httpGet<string>(getStatsURL(mode, rsn), config);
  if (response.status !== 200) {
    throw Error('Player not found');
  }
  const stats = parseStats(response.data);

  return stats;
}

export async function getSkillPage(
  skill: SkillName,
  mode: Gamemode = 'main',
  page: number = 1,
  config?: AxiosRequestConfig
): Promise<PlayerSkillRow[]> {
  if (!GAMEMODES.includes(mode)) {
    throw Error('Invalid game mode');
  } else if (!Number.isInteger(page) || page < 1) {
    throw Error('Page must be an integer greater than 0');
  } else if (!SKILLS.includes(skill)) {
    throw Error('Invalid skill');
  }
  const url = getSkillPageURL(mode, skill, page);

  const response = await httpGet<string | Buffer | BinaryData | undefined>(
    url,
    config
  );
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
  page: number = 1,
  config?: AxiosRequestConfig
): Promise<PlayerActivityRow[]> {
  if (!GAMEMODES.includes(mode)) {
    throw Error('Invalid game mode');
  } else if (!Number.isInteger(page) || page < 1) {
    throw Error('Page must be an integer greater than 0');
  } else if (!ACTIVITIES.includes(activity)) {
    throw Error('Invalid activity');
  }
  const url = getActivityPageURL(mode, activity, page);

  const response = await httpGet<string | Buffer | BinaryData | undefined>(
    url,
    config
  );
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
