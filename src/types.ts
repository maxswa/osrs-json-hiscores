export type Gamemode =
  | 'main'
  | 'iron'
  | 'hc'
  | 'ult'
  | 'dmm'
  | 'dmmt'
  | 'leagues';

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
  | 'abyssalsire'
  | 'alchemicalhydra'
  | 'barrowschests'
  | 'bryophyta'
  | 'callisto'
  | 'cerberus'
  | 'chambersofxeric'
  | 'chambersofxericchallengemode'
  | 'chaoselemental'
  | 'chaosfanatic'
  | 'commanderzilyana'
  | 'corporealbeast'
  | 'crazyarchaeologist'
  | 'dagannothprime'
  | 'dagannothrex'
  | 'dagannothsupreme'
  | 'derangedarchaeologist'
  | 'generalgraardor'
  | 'giantmole'
  | 'grotesqueguardians'
  | 'hespori'
  | 'kalphitequeen'
  | 'kingblackdragon'
  | 'kraken'
  | 'kreearra'
  | 'kriltsutsaroth'
  | 'mimic'
  | 'obor'
  | 'sarachnis'
  | 'scorpia'
  | 'skotizo'
  | 'gauntlet'
  | 'corruptedgauntlet'
  | 'theatreofblood'
  | 'thermonuclearsmokedevil'
  | 'tzkalzuk'
  | 'tztokjad'
  | 'venenatis'
  | 'vetion'
  | 'vorkath'
  | 'wintertodt'
  | 'zalcano'
  | 'zulrah';

export type Bosses = { [Type in Boss]: Activity };

export type ActivityName =
  | 'hunterbh'
  | 'roguebh'
  | 'lms'
  | 'allclues'
  | 'beginnerclues'
  | 'easyclues'
  | 'mediumclues'
  | 'hardclues'
  | 'eliteclues'
  | 'masterclues'
  | Boss;

export interface Stats {
  skills: Skills;
  clues: Clues;
  bh: BH;
  lms: Activity;
  bosses: Bosses;
}

export interface LeagueStats extends Omit<Stats, 'bh' | 'lms'> {
  lp: Activity;
}

export type Modes = { [M in Gamemode]?: Stats };

export interface Player extends Modes {
  rsn: string;
  mode: Gamemode;
  dead: boolean;
  deulted: boolean;
  deironed: boolean;
}

export interface PlayerSkillRow extends Skill {
  rsn: string;
  dead: boolean;
}

export interface PlayerActivityRow extends Activity {
  rsn: string;
  dead: boolean;
}
