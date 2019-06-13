import { Gamemode } from '../types';
import { BASE_URL, GAMEMODE_URL, STATS_URL } from './constants';

export const getStatsURL = (gamemode: Gamemode, rsn: string) =>
  `${BASE_URL}${GAMEMODE_URL[gamemode]}${STATS_URL}${encodeURIComponent(rsn)}`;
