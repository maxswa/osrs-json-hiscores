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
  GetStatsOptions,
  HiscoresResponse
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
  validateRSN,
  PLAYER_NOT_FOUND_ERROR,
  FORMATTED_SKILL_NAMES,
  FORMATTED_BH_NAMES,
  FORMATTED_CLUE_NAMES,
  FORMATTED_BOSS_NAMES,
  FORMATTED_LEAGUE_POINTS,
  FORMATTED_LMS,
  FORMATTED_PVP_ARENA,
  FORMATTED_SOUL_WARS,
  FORMATTED_RIFTS_CLOSED
} from './utils';

/**
 * Gets a player's stats from the official OSRS JSON endpoint.
 *
 * @param rsn Username of the player.
 * @param mode Gamemode to fetch ranks for.
 * @param config Optional axios request config object.
 * @returns Official JSON stats object.
 */
export async function getOfficialStats(
  rsn: string,
  mode: Gamemode = 'main',
  config?: AxiosRequestConfig
): Promise<HiscoresResponse> {
  validateRSN(rsn);

  const url = getStatsURL(mode, rsn, true);
  try {
    const response = await httpGet<HiscoresResponse>(url, config);
    return response.data;
  } catch {
    throw Error(PLAYER_NOT_FOUND_ERROR);
  }
}

/**
 * Screen scrapes the hiscores to get the formatted rsn of a player.
 *
 * @param rsn Username of the player.
 * @param config Optional axios request config object.
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
    throw Error(PLAYER_NOT_FOUND_ERROR);
  } catch {
    throw Error(PLAYER_NOT_FOUND_ERROR);
  }
}

/**
 * Parses official JSON object of raw stats and returns a stats object.
 *
 * @param csv Raw JSON from the official OSRS API.
 * @returns Parsed stats object.
 */
export function parseJsonStats(json: HiscoresResponse): Stats {
  const getActivity = (formattedName: string): Activity => {
    const hiscoresActivity = json.activities.find(
      // We must match on name here since id is not guaranteed to be the same between updates
      ({ name }) => name.toLowerCase() === formattedName.toLowerCase()
    );
    return {
      rank: hiscoresActivity?.rank ?? -1,
      score: hiscoresActivity?.score ?? -1
    };
  };
  const reduceActivity = <Key extends string, Reduced = Record<Key, Activity>>(
    keys: Key[],
    formattedNames: Record<Key, string>
  ): Reduced =>
    keys.reduce<Reduced>(
      (reducer, key) => ({
        ...reducer,
        [key]: getActivity(formattedNames[key])
      }),
      {} as Reduced
    );

  const skills = SKILLS.reduce<Skills>((skillsObject, skillName) => {
    const hiscoresSkill = json.skills.find(
      // We must match on name here since id is not guaranteed to be the same between updates
      ({ name }) =>
        name.toLowerCase() === FORMATTED_SKILL_NAMES[skillName].toLowerCase()
    );
    return {
      ...skillsObject,
      [skillName]: {
        rank: hiscoresSkill?.rank ?? -1,
        level: hiscoresSkill?.level ?? -1,
        xp: hiscoresSkill?.xp ?? -1
      }
    };
  }, {} as Skills);

  const bountyHunter = reduceActivity(BH_MODES, FORMATTED_BH_NAMES);
  const clues = reduceActivity(CLUES, FORMATTED_CLUE_NAMES);
  const bosses = reduceActivity(BOSSES, FORMATTED_BOSS_NAMES);

  const leaguePoints = getActivity(FORMATTED_LEAGUE_POINTS);
  const lastManStanding = getActivity(FORMATTED_LMS);
  const pvpArena = getActivity(FORMATTED_PVP_ARENA);
  const soulWarsZeal = getActivity(FORMATTED_SOUL_WARS);
  const riftsClosed = getActivity(FORMATTED_RIFTS_CLOSED);

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
  const [lastManStanding, pvpArena, soulWarsZeal, riftsClosed] =
    activityObjects.splice(0, 4);
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

  const mainRes = await httpGet<HiscoresResponse>(
    getStatsURL('main', rsn, true),
    options?.axiosConfigs?.main
  );
  if (mainRes.status === 200) {
    const emptyResponse: AxiosResponse<HiscoresResponse> = {
      status: 404,
      data: { skills: [], activities: [] },
      statusText: '',
      headers: {},
      config: {}
    };
    const getModeStats = async (
      mode: Extract<Gamemode, 'ironman' | 'hardcore' | 'ultimate'>
    ): Promise<AxiosResponse<HiscoresResponse>> =>
      otherGamemodes.includes(mode)
        ? httpGet<HiscoresResponse>(
            getStatsURL(mode, rsn, true),
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
    player.main = parseJsonStats(mainRes.data);

    const ironRes = await getModeStats('ironman');
    if (ironRes.status === 200) {
      player.ironman = parseJsonStats(ironRes.data);
      const hcRes = await getModeStats('hardcore');
      const ultRes = await getModeStats('ultimate');
      if (hcRes.status === 200) {
        player.mode = 'hardcore';
        player.hardcore = parseJsonStats(hcRes.data);
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
        player.ultimate = parseJsonStats(ultRes.data);
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
  throw Error(PLAYER_NOT_FOUND_ERROR);
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
  const response = await getOfficialStats(rsn, mode, config);
  const stats = parseJsonStats(response);

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
 * @param config Optional axios request config object.
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
