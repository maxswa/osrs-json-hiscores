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
  'mimic',
  'nex',
  'nightmare',
  'phosanisNightmare',
  'obor',
  'phantomMuspah',
  'sarachnis',
  'scorpia',
  'skotizo',
  'spindel',
  'tempoross',
  'gauntlet',
  'corruptedGauntlet',
  'leviathan',
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
  'zalcano',
  'zulrah'
];
export const ACTIVITIES: ActivityName[] = [
  'leaguePoints',
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
  ...BOSSES
];

export type FormattedBossNames = {
  [key in Boss]: string;
};

export const FORMATTED_BOSS_NAMES: FormattedBossNames = {
  abyssalSire: 'Abyssal Sire',
  alchemicalHydra: 'Alchemical Hydra',
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
  mimic: 'Mimic',
  nex: 'Nex',
  nightmare: 'The Nightmare of Ashihama',
  phosanisNightmare: "Phosani's Nightmare",
  obor: 'Obor',
  phantomMuspah: 'Phantom Muspah',
  sarachnis: 'Sarachnis',
  scorpia: 'Scorpia',
  skotizo: 'Skotizo',
  spindel: 'Spindel',
  tempoross: 'Tempoross',
  gauntlet: 'The Gauntlet',
  corruptedGauntlet: 'The Corrupted Gauntlet',
  leviathan: 'The Leviathan',
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

export const FORMATTED_LMS = 'Last Man Standing';
export const FORMATTED_PVP_ARENA = 'PvP Arena';
export const FORMATTED_SOUL_WARS = 'Soul Wars Zeal';
export const FORMATTED_LEAGUE_POINTS = 'League Points';
export const FORMATTED_RIFTS_CLOSED = 'Rifts Closed';

export const INVALID_FORMAT_ERROR = 'Invalid hiscores format';
