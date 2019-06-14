export type Gamemode = 'main' | 'iron' | 'hc' | 'ult' | 'dmm' | 'sdmm' | 'dmmt';

export type Mode = Gamemode | 'full';

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

export type Category =
  | SkillName
  | 'hunterbh'
  | 'roguebh'
  | 'lms'
  | 'allclues'
  | 'beginnerclues'
  | 'easyclues'
  | 'mediumclues'
  | 'hardclues'
  | 'eliteclues'
  | 'masterclues';

export interface Stats {
  skills: Skills;
  clues: Clues;
  bh: BH;
  lms: Activity;
}

export type Modes = { [M in Gamemode]?: Stats };

export interface Player extends Modes {
  rsn: string;
  mode: Gamemode;
  dead: boolean;
  deironed: boolean;
}
