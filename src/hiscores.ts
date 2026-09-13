import { ELEMENT_NODE, ElementNode, Node, TEXT_NODE, parse } from 'ultrahtml';
import {
  Player,
  Activity,
  Stats,
  Skills,
  PlayerSkillRow,
  PlayerActivityRow,
  GetStatsOptions,
  HiscoresResponse
} from './types.js';
import {
  getStatsURL,
  SKILLS,
  BH_MODES,
  CLUES,
  getPlayerTableURL,
  getSkillPageURL,
  GAMEMODES,
  ACTIVITIES,
  getActivityPageURL,
  BOSSES,
  PlayerNotFoundError,
  HiScoresError,
  validateRSN,
  FORMATTED_SKILL_NAMES,
  FORMATTED_BH_NAMES,
  FORMATTED_CLUE_NAMES,
  FORMATTED_BOSS_NAMES,
  FORMATTED_LEAGUE_POINTS,
  FORMATTED_LMS,
  FORMATTED_PVP_ARENA,
  FORMATTED_SOUL_WARS,
  FORMATTED_RIFTS_CLOSED,
  FORMATTED_DEADMAN_POINTS,
  FORMATTED_COLOSSEUM_GLORY,
  FORMATTED_COLLECTIONS_LOGGED,
  Gamemode,
  SkillName,
  ActivityName,
  HttpError
} from './utils/index.js';
import { httpGet } from './utils/helpers.js';

/** Direct children only, so a nested table cannot add cells. */
const rowCells = (row: Node) =>
  (row.type === ELEMENT_NODE ? row.children : []).filter(
    (n): n is ElementNode =>
      n.type === ELEMENT_NODE && (n.name === 'td' || n.name === 'th')
  );

const hasClass = (el: ElementNode, cls: string) =>
  (el.attributes.class ?? '').split(/\s+/).includes(cls);

const findAll = (
  node: Node | undefined,
  pred: (el: ElementNode) => boolean
): ElementNode[] =>
  ((node?.children ?? []) as Node[])
    .filter((n): n is ElementNode => n.type === ELEMENT_NODE)
    .flatMap((el) => [...(pred(el) ? [el] : []), ...findAll(el, pred)]);

const find = (node: Node | undefined, pred: (el: ElementNode) => boolean) =>
  findAll(node, pred)[0] ?? null;

const byTag = (name: string) => (el: ElementNode) => el.name === name;

const textFromNode = (node: Node | undefined): string =>
  node?.type === TEXT_NODE
    ? String(node.value)
    : ((node?.children ?? []) as Node[]).map(textFromNode).join('');

/**
 * Extracts a number from an OSRS hiscores table cell element.
 *
 * @param el OSRS hiscores table cell element.
 * @returns Number parsed from cell text.
 */
const numberFromElement = (el: Node | null) => {
  const number = el ? textFromNode(el).replace(/[\n|,]/g, '') : '-1';
  return parseInt(number, 10);
};

/**
 * Extracts a RSN from an OSRS hiscores table cell element.
 *
 * @param el OSRS hiscores table cell element.
 * @returns RSN parsed from cell text.
 */
const rsnFromElement = (el: Node | null) =>
  el ? textFromNode(el).replace(/\uFFFD/g, ' ') : '';

/** Jagex spells a name with spaces. Callers may pass -, _ or stray whitespace. */
const normalizeName = (name: string) =>
  name
    .replace(/[ _-]+/g, ' ')
    .trim()
    .toLowerCase();

const sameName = (a: string, b: string) =>
  normalizeName(a) === normalizeName(b);

/**
 * Gets a player's stats from the official OSRS JSON endpoint.
 *
 * @param rsn Username of the player.
 * @param mode Gamemode to fetch ranks for.
 * @param config Optional fetch request config object.
 * @returns Official JSON stats object.
 */
export async function getOfficialStats(
  rsn: string,
  mode: Gamemode = 'main',
  config?: RequestInit
): Promise<HiscoresResponse> {
  validateRSN(rsn);

  const url = getStatsURL(mode, rsn);
  try {
    const response = await httpGet(url, config);
    return (await response.json()) as HiscoresResponse;
  } catch (err) {
    if (err instanceof HttpError && err.status === 404) {
      throw new PlayerNotFoundError();
    }

    throw new HiScoresError();
  }
}

/**
 * Screen scrapes the hiscores to get the formatted rsn of a player.
 *
 * @param rsn Username of the player.
 * @param config Optional fetch request config object.
 * @returns Formatted version of the rsn.
 */
export async function getRSNFormat(
  rsn: string,
  config?: RequestInit
): Promise<string> {
  validateRSN(rsn);

  const url = getPlayerTableURL('main', rsn);
  try {
    const response = await httpGet(url, config);
    const root = parse(await response.text());
    const row = find(
      root,
      (el) =>
        el.name === 'tr' &&
        hasClass(el, 'personal-hiscores__row--type-highlight')
    );
    if (row) {
      const nameAnchor = find(
        row,
        (el) => el.name === 'a' && (el.attributes.href ?? '').includes('user1=')
      );
      const name = rsnFromElement(nameAnchor);
      return name && sameName(name, rsn) ? name : rsn;
    }
  } catch {
    throw new HiScoresError();
  }
  throw new PlayerNotFoundError();
}

/**
 * Parses official JSON object of raw stats and returns a stats object.
 *
 * @param json Raw JSON from the official OSRS API.
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
    keys: readonly Key[],
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
  const deadmanPoints = getActivity(FORMATTED_DEADMAN_POINTS);
  const lastManStanding = getActivity(FORMATTED_LMS);
  const pvpArena = getActivity(FORMATTED_PVP_ARENA);
  const soulWarsZeal = getActivity(FORMATTED_SOUL_WARS);
  const riftsClosed = getActivity(FORMATTED_RIFTS_CLOSED);
  const colosseumGlory = getActivity(FORMATTED_COLOSSEUM_GLORY);
  const collectionsLogged = getActivity(FORMATTED_COLLECTIONS_LOGGED);

  const stats: Stats = {
    skills,
    leaguePoints,
    deadmanPoints,
    bountyHunter,
    lastManStanding,
    pvpArena,
    soulWarsZeal,
    riftsClosed,
    colosseumGlory,
    collectionsLogged,
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

  const main = await getOfficialStats(
    rsn,
    'main',
    options?.requestConfigs?.main
  );

  const getModeStats = async (
    mode: Extract<Gamemode, 'ironman' | 'hardcore' | 'ultimate'>
  ): Promise<HiscoresResponse | undefined> =>
    otherGamemodes.includes(mode)
      ? getOfficialStats(rsn, mode, options?.requestConfigs?.[mode]).catch(
          () => undefined
        )
      : undefined;
  const formattedName = shouldGetFormattedRsn
    ? await getRSNFormat(rsn, options?.requestConfigs?.rsn).catch(
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
  player.main = parseJsonStats(main);

  const iron = await getModeStats('ironman');
  if (iron) {
    player.ironman = parseJsonStats(iron);
    const hc = await getModeStats('hardcore');
    const ult = await getModeStats('ultimate');
    if (hc) {
      player.mode = 'hardcore';
      player.hardcore = parseJsonStats(hc);
      if (
        player.ironman.skills.overall.xp !== player.hardcore.skills.overall.xp
      ) {
        player.dead = true;
        player.mode = 'ironman';
      }
      if (player.main.skills.overall.xp !== player.ironman.skills.overall.xp) {
        player.deironed = true;
        player.mode = 'main';
      }
    } else if (ult) {
      player.mode = 'ultimate';
      player.ultimate = parseJsonStats(ult);
      if (
        player.ironman.skills.overall.xp !== player.ultimate.skills.overall.xp
      ) {
        player.deulted = true;
        player.mode = 'ironman';
      }
      if (player.main.skills.overall.xp !== player.ironman.skills.overall.xp) {
        player.deironed = true;
        player.mode = 'main';
      }
    } else {
      player.mode = 'ironman';
      if (player.main.skills.overall.xp !== player.ironman.skills.overall.xp) {
        player.deironed = true;
        player.mode = 'main';
      }
    }
  }

  return player;
}

/**
 * Fetches stats from the OSRS API and returns them as an object.
 *
 * @param rsn Username of the player.
 * @param mode Gamemode to fetch ranks for.
 * @param config Optional fetch request config object.
 * @returns Stats object.
 */
export async function getStatsByGamemode(
  rsn: string,
  mode: Gamemode = 'main',
  config?: RequestInit
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
  config?: RequestInit
): Promise<PlayerSkillRow[]> {
  if (!GAMEMODES.includes(mode)) {
    throw Error('Invalid game mode');
  } else if (!Number.isInteger(page) || page < 1) {
    throw Error('Page must be an integer greater than 0');
  } else if (!SKILLS.includes(skill)) {
    throw Error('Invalid skill');
  }
  const url = getSkillPageURL(mode, skill, page);

  const response = await httpGet(url, config);
  const root = parse(await response.text());
  const rows = findAll(
    root,
    (el) => el.name === 'tr' && hasClass(el, 'personal-hiscores__row')
  );

  const players: PlayerSkillRow[] = [];
  rows.forEach((row) => {
    // Omit first cell (pre-sailing link)
    const [, rankCell, nameCell, levelCell, xpCell] = rowCells(row);
    const isDead = !!find(nameCell, byTag('img'));
    const nameElement = find(nameCell, byTag('a'));

    players.push({
      name: rsnFromElement(nameElement),
      rank: numberFromElement(rankCell),
      level: numberFromElement(levelCell),
      xp: numberFromElement(xpCell),
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
 * @param config Optional fetch request config object.
 * @returns Array of `PlayerActivityRow` objects.
 */
export async function getActivityPage(
  activity: ActivityName,
  mode: Gamemode = 'main',
  page: number = 1,
  config?: RequestInit
): Promise<PlayerActivityRow[]> {
  if (!GAMEMODES.includes(mode)) {
    throw Error('Invalid game mode');
  } else if (!Number.isInteger(page) || page < 1) {
    throw Error('Page must be an integer greater than 0');
  } else if (!ACTIVITIES.includes(activity)) {
    throw Error('Invalid activity');
  }
  const url = getActivityPageURL(mode, activity, page);

  const response = await httpGet(url, config);
  const root = parse(await response.text());
  const rows = findAll(
    root,
    (el) => el.name === 'tr' && hasClass(el, 'personal-hiscores__row')
  );

  const players: PlayerActivityRow[] = [];
  rows.forEach((row) => {
    const [rankCell, nameCell, scoreCell] = rowCells(row);
    const isDead = !!find(nameCell, byTag('img'));
    const nameElement = find(nameCell, byTag('a'));

    players.push({
      name: rsnFromElement(nameElement),
      rank: numberFromElement(rankCell),
      score: numberFromElement(scoreCell),
      dead: isDead
    });
  });

  return players;
}
