import { AxiosRequestConfig } from 'axios';
import { BHType, Boss, ClueType, Gamemode, SkillName } from './utils';

export interface Skill {
  rank: number;
  level: number;
  xp: number;
}

export interface Activity {
  rank: number;
  score: number;
}

export type Skills = { [Name in SkillName]: Skill };

export type Clues = { [Type in ClueType]: Activity };

export type BH = { [Type in BHType]: Activity };

export type Bosses = { [Type in Boss]: Activity };

export interface Stats {
  skills: Skills;
  clues: Clues;
  /**
   * Will only contain rank and score data for the `seasonal` gamemode.
   */
  leaguePoints: Activity;
  /**
   * Will only contain rank and score data for the `tournament` gamemode.
   */
  deadmanPoints: Activity;
  bountyHunter: BH;
  lastManStanding: Activity;
  pvpArena: Activity;
  soulWarsZeal: Activity;
  riftsClosed: Activity;
  colosseumGlory: Activity;
  collectionsLogged: Activity;
  bosses: Bosses;
}
export type Modes = { [M in Gamemode]?: Stats };

export interface Player
  extends Pick<Modes, 'main' | 'ironman' | 'hardcore' | 'ultimate'> {
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

export interface GetStatsOptions {
  /**
   * Other game modes to fetch ranks for.
   * @defaultvalue `['ironman', 'hardcore', 'ultimate']`
   */
  otherGamemodes?: Extract<Gamemode, 'ironman' | 'hardcore' | 'ultimate'>[];
  /**
   * If true, the formatted RSN will be fetched. Otherwise it will return the provided, unformatted RSN.
   * @defaultvalue `true`
   */
  shouldGetFormattedRsn?: boolean;
  /**
   * Map of configs for each requests that can take place in the `getStats` function.
   */
  axiosConfigs?: Partial<Record<Gamemode, AxiosRequestConfig>> & {
    /**
     * The axios request config object to use for the RSN format request.
     */
    rsn?: AxiosRequestConfig;
  };
}

export interface HiscoresCommon {
  /**
   * This field behaves more like an index than a true unique ID.
   */
  id: number;
  /**
   * The display name of this skill / activity.
   */
  name: string;
  /**
   * The player's official hiscores rank in this skill / activity.
   */
  rank: number;
}

export interface HiscoresSkill extends HiscoresCommon {
  /**
   * The player's current level in this skill.
   */
  level: number;
  /**
   * The player's current experience in this skill.
   */
  xp: number;
}

export interface HiscoresActivity extends HiscoresCommon {
  /**
   * The player's current score in this activity.
   */
  score: number;
}

export interface HiscoresResponse {
  skills: HiscoresSkill[];
  activities: HiscoresActivity[];
}
