import { Gamemode, SkillName, ActivityName } from '../types';
import {
  GAMEMODE_URL,
  STATS_URL,
  SCORES_URL,
  SKILLS,
  ACTIVITIES,
} from './constants';

export const getStatsURL = (gamemode: Gamemode, rsn: string) =>
  `${GAMEMODE_URL[gamemode]}${STATS_URL}${encodeURIComponent(rsn)}`;

export const getPlayerTableURL = (gamemode: Gamemode, rsn: string) =>
  `${GAMEMODE_URL[gamemode]}${SCORES_URL}table=0&user=${encodeURIComponent(
    rsn
  )}`;

export const getSkillPageURL = (
  gamemode: Gamemode,
  skill: SkillName,
  page: number
) =>
  `${GAMEMODE_URL[gamemode]}${SCORES_URL}table=${SKILLS.indexOf(
    skill
  )}&page=${page}`;

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

export const numberFromElement = (el: CheerioElement) => {
  const innerText = el.firstChild.data;
  const number = innerText ? innerText.replace(/[\n|,]/g, '') : '-1';
  return parseInt(number, 10);
};

export const rsnFromElement = (el: CheerioElement | undefined) => {
  const innerText = el?.firstChild.data;
  return innerText ? innerText.replace(/\uFFFD/g, ' ') : '';
};
