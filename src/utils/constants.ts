import {
  BHType,
  Boss,
  ClueType,
  Gamemode,
  SkillName,
  ActivityName
} from '../types';

export const BASE_URL = 'https://secure.runescape.com/m=hiscore_oldschool';
export const STATS_URL = 'index_lite.ws?player=';
export const JSON_STATS_URL = 'index_lite.json?player=';
export const SCORES_URL = 'overall.ws?';

export type GamemodeUrl = {
  [key in Gamemode]: string;
};

export const GAMEMODE_URL: GamemodeUrl = {
  main: `${BASE_URL}/`,
  ironman: `${BASE_URL}_ironman/`,
  hardcore: `${BASE_URL}_hardcore_ironman/`,
  ultimate: `${BASE_URL}_ultimate/`,
  deadman: `${BASE_URL}_deadman/`,
  seasonal: `${BASE_URL}_seasonal/`,
  tournament: `${BASE_URL}_tournament/`,
  skiller: `${BASE_URL}_skiller/`,
  oneDefence: `${BASE_URL}_skiller_defence/`,
  freshStart: `${BASE_URL}_fresh_start/`
};
export const SKILLS: SkillName[] = [
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
  'construction'
];
export const CLUES: ClueType[] = [
  'all',
  'beginner',
  'easy',
  'medium',
  'hard',
  'elite',
  'master'
];
export const BH_MODES: BHType[] = ['hunterV2', 'rogueV2', 'hunter', 'rogue'];
export const GAMEMODES: Gamemode[] = [
  'main',
  'ironman',
  'hardcore',
  'ultimate',
  'deadman',
  'seasonal',
  'tournament'
];
export const BOSSES: Boss[] = [
  'abyssalSire',
  'alchemicalHydra',
  'amoxliatl',
  'araxxor',
  'artio',
  'barrows',
  'bryophyta',
  'callisto',
  'calvarion',
  'cerberus',
  'chambersOfXeric',
  'chambersOfXericChallengeMode',
  'chaosElemental',
  'chaosFanatic',
  'commanderZilyana',
  'corporealBeast',
  'crazyArchaeologist',
  'dagannothPrime',
  'dagannothRex',
  'dagannothSupreme',
  'derangedArchaeologist',
  'doomOfMokhaiotl',
  'dukeSucellus',
  'generalGraardor',
  'giantMole',
  'grotesqueGuardians',
  'hespori',
  'kalphiteQueen',
  'kingBlackDragon',
  'kraken',
  'kreeArra',
  'krilTsutsaroth',
  'lunarChests',
  'mimic',
  'nex',
  'nightmare',
  'phosanisNightmare',
  'obor',
  'phantomMuspah',
  'sarachnis',
  'scorpia',
  'scurrius',
  'skotizo',
  'solHeredit',
  'spindel',
  'tempoross',
  'gauntlet',
  'corruptedGauntlet',
  'hueycoatl',
  'leviathan',
  'royalTitans',
  'whisperer',
  'theatreOfBlood',
  'theatreOfBloodHardMode',
  'thermonuclearSmokeDevil',
  'tombsOfAmascut',
  'tombsOfAmascutExpertMode',
  'tzKalZuk',
  'tzTokJad',
  'vardorvis',
  'venenatis',
  'vetion',
  'vorkath',
  'wintertodt',
  'yama',
  'zalcano',
  'zulrah'
];
export const ACTIVITIES: ActivityName[] = [
  'leaguePoints',
  'deadmanPoints',
  'hunterBHV2',
  'rogueBHV2',
  'hunterBH',
  'rogueBH',
  'allClues',
  'beginnerClues',
  'easyClues',
  'mediumClues',
  'hardClues',
  'eliteClues',
  'masterClues',
  'lastManStanding',
  'pvpArena',
  'soulWarsZeal',
  'riftsClosed',
  'colosseumGlory',
  'collectionsLogged',
  ...BOSSES
];

export type FormattedBossNames = {
  [key in Boss]: string;
};

export const FORMATTED_BOSS_NAMES: FormattedBossNames = {
  abyssalSire: 'Abyssal Sire',
  alchemicalHydra: 'Alchemical Hydra',
  amoxliatl: 'Amoxliatl',
  araxxor: 'Araxxor',
  artio: 'Artio',
  barrows: 'Barrows Chests',
  bryophyta: 'Bryophyta',
  callisto: 'Callisto',
  calvarion: "Calvar'ion",
  cerberus: 'Cerberus',
  chambersOfXeric: 'Chambers of Xeric',
  chambersOfXericChallengeMode: 'Chambers of Xeric: Challenge Mode',
  chaosElemental: 'Chaos Elemental',
  chaosFanatic: 'Chaos Fanatic',
  commanderZilyana: 'Commander Zilyana',
  corporealBeast: 'Corporeal Beast',
  crazyArchaeologist: 'Crazy Archaeologist',
  dagannothPrime: 'Dagannoth Prime',
  dagannothRex: 'Dagannoth Rex',
  dagannothSupreme: 'Dagannoth Supreme',
  derangedArchaeologist: 'Deranged Archaeologist',
  doomOfMokhaiotl: 'Doom of Mokhaiotl',
  dukeSucellus: 'Duke Sucellus',
  generalGraardor: 'General Graardor',
  giantMole: 'Giant Mole',
  grotesqueGuardians: 'Grotesque Guardians',
  hespori: 'Hespori',
  kalphiteQueen: 'Kalphite Queen',
  kingBlackDragon: 'King Black Dragon',
  kraken: 'Kraken',
  kreeArra: "Kree'Arra",
  krilTsutsaroth: "K'ril Tsutsaroth",
  lunarChests: 'Lunar Chests',
  mimic: 'Mimic',
  nex: 'Nex',
  nightmare: 'Nightmare',
  phosanisNightmare: "Phosani's Nightmare",
  obor: 'Obor',
  phantomMuspah: 'Phantom Muspah',
  sarachnis: 'Sarachnis',
  scorpia: 'Scorpia',
  scurrius: 'Scurrius',
  skotizo: 'Skotizo',
  solHeredit: 'Sol Heredit',
  spindel: 'Spindel',
  tempoross: 'Tempoross',
  gauntlet: 'The Gauntlet',
  corruptedGauntlet: 'The Corrupted Gauntlet',
  hueycoatl: 'The Hueycoatl',
  leviathan: 'The Leviathan',
  royalTitans: 'The Royal Titans',
  whisperer: 'The Whisperer',
  theatreOfBlood: 'Theatre of Blood',
  theatreOfBloodHardMode: 'Theatre of Blood: Hard Mode',
  thermonuclearSmokeDevil: 'Thermonuclear Smoke Devil',
  tombsOfAmascut: 'Tombs of Amascut',
  tombsOfAmascutExpertMode: 'Tombs of Amascut: Expert Mode',
  tzKalZuk: 'TzKal-Zuk',
  tzTokJad: 'TzTok-Jad',
  vardorvis: 'Vardorvis',
  venenatis: 'Venenatis',
  vetion: "Vet'ion",
  vorkath: 'Vorkath',
  wintertodt: 'Wintertodt',
  yama: 'Yama',
  zalcano: 'Zalcano',
  zulrah: 'Zulrah'
};

export type FormattedSkillNames = {
  [key in SkillName]: string;
};

export const FORMATTED_SKILL_NAMES: FormattedSkillNames = {
  overall: 'Overall',
  attack: 'Attack',
  defence: 'Defence',
  strength: 'Strength',
  hitpoints: 'Hitpoints',
  ranged: 'Ranged',
  prayer: 'Prayer',
  magic: 'Magic',
  cooking: 'Cooking',
  woodcutting: 'Woodcutting',
  fletching: 'Fletching',
  fishing: 'Fishing',
  firemaking: 'Firemaking',
  crafting: 'Crafting',
  smithing: 'Smithing',
  mining: 'Mining',
  herblore: 'Herblore',
  agility: 'Agility',
  thieving: 'Thieving',
  slayer: 'Slayer',
  farming: 'Farming',
  runecraft: 'Runecraft',
  hunter: 'Hunter',
  construction: 'Construction'
};

export type FormattedClueNames = {
  [key in ClueType]: string;
};

export const FORMATTED_CLUE_NAMES: FormattedClueNames = {
  all: 'Clue Scrolls (all)',
  beginner: 'Clue Scrolls (beginner)',
  easy: 'Clue Scrolls (easy)',
  medium: 'Clue Scrolls (medium)',
  hard: 'Clue Scrolls (hard)',
  elite: 'Clue Scrolls (elite)',
  master: 'Clue Scrolls (master)'
};

export type FormattedBHNames = {
  [key in BHType]: string;
};

export const FORMATTED_BH_NAMES: FormattedBHNames = {
  rogue: 'Bounty Hunter (Legacy) - Rogue',
  hunter: 'Bounty Hunter (Legacy) - Hunter',
  rogueV2: 'Bounty Hunter - Rogue',
  hunterV2: 'Bounty Hunter - Hunter'
};

export const FORMATTED_LMS = 'LMS - Rank';
export const FORMATTED_PVP_ARENA = 'PvP Arena - Rank';
export const FORMATTED_SOUL_WARS = 'Soul Wars Zeal';
export const FORMATTED_LEAGUE_POINTS = 'League Points';
export const FORMATTED_DEADMAN_POINTS = 'Deadman Points';
export const FORMATTED_RIFTS_CLOSED = 'Rifts closed';
export const FORMATTED_COLOSSEUM_GLORY = 'Colosseum Glory';
export const FORMATTED_COLLECTIONS_LOGGED = 'Collections Logged';

export const INVALID_FORMAT_ERROR = 'Invalid hiscores format';
export const PLAYER_NOT_FOUND_ERROR = 'Player not found';
export const HISCORES_ERROR = 'HiScores not responding';

export class InvalidFormatError extends Error {
  __proto__ = Error;

  constructor() {
    super(INVALID_FORMAT_ERROR);
    Object.setPrototypeOf(this, InvalidFormatError.prototype);
  }
}

export class InvalidRSNError extends Error {
  __proto__ = Error;

  constructor(message: string) {
    super(message);
    Object.setPrototypeOf(this, InvalidRSNError.prototype);
  }
}

export class PlayerNotFoundError extends Error {
  __proto__ = Error;

  constructor() {
    super(PLAYER_NOT_FOUND_ERROR);
    Object.setPrototypeOf(this, PlayerNotFoundError.prototype);
  }
}

export class HiScoresError extends Error {
  __proto__ = Error;

  constructor() {
    super(HISCORES_ERROR);
    Object.setPrototypeOf(this, HiScoresError.prototype);
  }
}
