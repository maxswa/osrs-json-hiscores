import { Gamemode, Category } from '../types';
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

export const getHiscoresPageURL = (
  gamemode: Gamemode,
  category: Category,
  page: number
) => {
  const table = [...SKILLS, ...OTHER];
  return `${BASE_URL}${GAMEMODE_URL[gamemode]}${SCORES_URL}${
    table.includes(category)
      ? `table=${table.indexOf(category)}`
      : `category_type=1&table=${OTHER.indexOf(category)}`
  }&page=${page}`;
};
