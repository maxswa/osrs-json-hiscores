import { SkillName, ClueType, BHType, Gamemode, Mode } from '../types';

export const BASE_URL = 'http://services.runescape.com/m=hiscore_oldschool';
export const STATS_URL = 'index_lite.ws?player=';
export const SCORES_URL = 'overall.ws?';
export const GAMEMODE_URL = {
  dmm: '_deadman/',
  dmmt: '_tournament/',
  hc: '_ironman/',
  iron: '_ironman/',
  main: '/',
  sdmm: '_seasonal/',
  ult: '_ultimate/',
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
  'construction',
];
export const CLUES: ClueType[] = [
  'all',
  'beginner',
  'easy',
  'medium',
  'hard',
  'elite',
  'master',
];
export const BH: BHType[] = ['rogue', 'hunter'];
export const OTHER = [
  'hunterbh',
  'roguebh',
  'lms',
  'allclues',
  'beginnerclues',
  'easyclues',
  'mediumclues',
  'hardclues',
  'eliteclues',
  'masterclues',
];
export const GAMEMODES: Gamemode[] = [
  'main',
  'iron',
  'hc',
  'ult',
  'dmm',
  'sdmm',
  'dmmt',
];
export const MODES: Mode[] = [...GAMEMODES, 'full'];
