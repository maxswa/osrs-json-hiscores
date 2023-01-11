export type Gamemode =
  | 'main'
  | 'ironman'
  | 'ultimate'
  | 'hardcore'
  | 'deadman'
  | 'seasonal'
  | 'tournament';

export interface Skill {
  rank: number;
  level: number;
  xp: number;
}

export interface Activity {
  rank: number;
  score: number;
}

export type SkillName =
  | 'overall'
  | 'attack'
  | 'defence'
  | 'strength'
  | 'hitpoints'
  | 'ranged'
  | 'prayer'
  | 'magic'
  | 'cooking'
  | 'woodcutting'
  | 'fletching'
  | 'fishing'
  | 'firemaking'
  | 'crafting'
  | 'smithing'
  | 'mining'
  | 'herblore'
  | 'agility'
  | 'thieving'
  | 'slayer'
  | 'farming'
  | 'runecraft'
  | 'hunter'
  | 'construction';

export type Skills = { [Name in SkillName]: Skill };

export type ClueType =
  | 'all'
  | 'beginner'
  | 'easy'
  | 'medium'
  | 'hard'
  | 'elite'
  | 'master';

export type Clues = { [Type in ClueType]: Activity };

export type BHType = 'rogue' | 'hunter';

export type BH = { [Type in BHType]: Activity };

export type Boss =
  | 'abyssalSire'
  | 'alchemicalHydra'
  | 'barrows'
  | 'bryophyta'
  | 'callisto'
  | 'cerberus'
  | 'chambersOfXeric'
  | 'chambersOfXericChallengeMode'
  | 'chaosElemental'
  | 'chaosFanatic'
  | 'commanderZilyana'
  | 'corporealBeast'
  | 'crazyArchaeologist'
  | 'dagannothPrime'
  | 'dagannothRex'
  | 'dagannothSupreme'
  | 'derangedArchaeologist'
  | 'generalGraardor'
  | 'giantMole'
  | 'grotesqueGuardians'
  | 'hespori'
  | 'kalphiteQueen'
  | 'kingBlackDragon'
  | 'kraken'
  | 'kreeArra'
  | 'krilTsutsaroth'
  | 'mimic'
  | 'nex'
  | 'nightmare'
  | 'phosanisNightmare'
  | 'obor'
  | 'phantomMuspah'
  | 'sarachnis'
  | 'scorpia'
  | 'skotizo'
  | 'tempoross'
  | 'gauntlet'
  | 'corruptedGauntlet'
  | 'theatreOfBlood'
  | 'theatreOfBloodHardMode'
  | 'thermonuclearSmokeDevil'
  | 'tombsOfAmascut'
  | 'tombsOfAmascutExpertMode'
  | 'tzKalZuk'
  | 'tzTokJad'
  | 'venenatis'
  | 'vetion'
  | 'vorkath'
  | 'wintertodt'
  | 'zalcano'
  | 'zulrah';

export type Bosses = { [Type in Boss]: Activity };

export type ActivityName =
  | 'leaguePoints'
  | 'hunterBH'
  | 'rogueBH'
  | 'lastManStanding'
  | 'pvpArena'
  | 'soulWarsZeal'
  | 'riftsClosed'
  | 'allClues'
  | 'beginnerClues'
  | 'easyClues'
  | 'mediumClues'
  | 'hardClues'
  | 'eliteClues'
  | 'masterClues'
  | Boss;

export interface Stats {
  skills: Skills;
  clues: Clues;
  leaguePoints: Activity;
  bountyHunter: BH;
  lastManStanding: Activity;
  pvpArena: Activity;
  soulWarsZeal: Activity;
  riftsClosed: Activity;
  bosses: Bosses;
}
export type Modes = { [M in Gamemode]?: Stats };

export interface Player extends Modes {
  name: string;
  mode: Gamemode;
  dead: boolean;
  deulted: boolean;
  deironed: boolean;
}

export interface PlayerSkillRow extends Skill {
  name: string;
  dead: boolean;
}

export interface PlayerActivityRow extends Activity {
  name: string;
  dead: boolean;
}
