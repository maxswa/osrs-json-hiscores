import { Gamemode, Category, SkillName } from '../types';
import {
  BASE_URL,
  GAMEMODE_URL,
  STATS_URL,
  SCORES_URL,
  SKILLS,
  OTHER,
} from './constants';

export const getStatsURL = (gamemode: Gamemode, rsn: string) =>
  `${BASE_URL}${GAMEMODE_URL[gamemode]}${STATS_URL}${encodeURIComponent(rsn)}`;

export const getPlayerTableURL = (gamemode: Gamemode, rsn: string) =>
  `${BASE_URL}${
    GAMEMODE_URL[gamemode]
  }${SCORES_URL}table=0&user=${encodeURIComponent(rsn)}`;

export const getSkillPageURL = (
  gamemode: Gamemode,
  skill: SkillName,
  page: number
) =>
  `${BASE_URL}${GAMEMODE_URL[gamemode]}${SCORES_URL}table=${SKILLS.indexOf(
    skill
  )}&page=${page}`;

export const numberFromElement = (el: CheerioElement) => {
  const innerText = el.firstChild.data;
  const number = innerText ? innerText.replace(/[\n|,]/g, '') : '-1';
  return parseInt(number, 10);
};

export const rsnFromElement = (el: CheerioElement) => {
  const innerText = el.firstChild.data;
  return innerText ? innerText.replace(/\uFFFD/g, ' ') : '';
};
