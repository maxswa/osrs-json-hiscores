import axios from 'axios';
import * as ua from 'useragent-generator';
import { Gamemode, SkillName, ActivityName } from '../types';
import {
  GAMEMODE_URL,
  STATS_URL,
  SCORES_URL,
  SKILLS,
  ACTIVITIES
} from './constants';

/**
 * Will generate a stats URL for the official OSRS API.
 *
 * @param gamemode Gamemode to fetch ranks for.
 * @param rsn Username of the player.
 * @returns Encoded stats URL.
 */
export const getStatsURL = (gamemode: Gamemode, rsn: string) =>
  `${GAMEMODE_URL[gamemode]}${STATS_URL}${encodeURIComponent(rsn)}`;

/**
 * Will generate a player table URL for the official OSRS hiscores website.
 *
 * @param gamemode Gamemode to fetch ranks for.
 * @param rsn Username of the player.
 * @returns Encoded player table URL.
 */
export const getPlayerTableURL = (gamemode: Gamemode, rsn: string) =>
  `${GAMEMODE_URL[gamemode]}${SCORES_URL}table=0&user=${encodeURIComponent(
    rsn
  )}`;

/**
 * Will generate a skill table URL for the official OSRS hiscores website.
 *
 * @param gamemode Gamemode to fetch ranks for.
 * @param skill Skill to fetch ranks for.
 * @param page Page number.
 * @returns
 */
export const getSkillPageURL = (
  gamemode: Gamemode,
  skill: SkillName,
  page: number
) =>
  `${GAMEMODE_URL[gamemode]}${SCORES_URL}table=${SKILLS.indexOf(
    skill
  )}&page=${page}`;

/**
 * Will generate an activity table URL for the official OSRS hiscores website.
 *
 * @param gamemode Gamemode to fetch ranks for.
 * @param activity Activity or boss to fetch ranks for.
 * @param page Page number.
 * @returns
 */
export const getActivityPageURL = (
  gamemode: Gamemode,
  activity: ActivityName,
  page: number
) =>
  `${
    GAMEMODE_URL[gamemode]
  }${SCORES_URL}category_type=1&table=${ACTIVITIES.indexOf(
    activity
  )}&page=${page}`;

/**
 * Extracts a number from an OSRS hiscores table cell element.
 *
 * @param el OSRS hiscores table cell element.
 * @returns Number parsed from cell text.
 */
export const numberFromElement = (el: Element | null) => {
  const { innerHTML } = el ?? {};
  const number = innerHTML?.replace(/[\n|,]/g, '') ?? '-1';
  return parseInt(number, 10);
};

/**
 * Extracts a RSN from an OSRS hiscores table cell element.
 *
 * @param el OSRS hiscores table cell element.
 * @returns RSN parsed from cell text.
 */
export const rsnFromElement = (el: Element | null) => {
  const { innerHTML } = el ?? {};
  return innerHTML?.replace(/\uFFFD/g, ' ') ?? '';
};

/**
 * Will run an Axios `GET` request against a given URL after injecting a `User-Agent` header.
 *
 * @param url URL to run a `GET` request against.
 * @returns Axios response.
 */
export const httpGet = <Response>(url: string) =>
  axios.get<Response>(url, {
    headers: {
      // without User-Agent header requests may be rejected by DDoS protection mechanism
      'User-Agent': ua.firefox(80)
    }
  });

/**
 * Validates that a provided RSN has the same username restrictions as Jagex.
 * @param rsn Username to validate.
 * @throws Error if the RSN fails validation.
 */
export const validateRSN = (rsn: string) => {
  if (typeof rsn !== 'string') {
    throw Error('RSN must be a string');
  } else if (!/^[a-zA-Z0-9 _-]+$/.test(rsn)) {
    throw Error('RSN contains invalid character');
  } else if (rsn.length > 12 || rsn.length < 1) {
    throw Error('RSN must be between 1 and 12 characters');
  }
};
