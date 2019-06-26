import {
  parseStats,
  getRSNFormat,
  getSkillPage,
  getStats,
  getStatsByGamemode,
} from '../src/index';
import { PlayerSkillRow, Player, Stats } from '../src/types';
import axios, { AxiosError } from 'axios';

test('Parse CSV to json', () => {
  const csv = `40258,2063,218035714
  20554, 99, 21102621
  39059, 99, 15364425
  14245, 99, 26556827
  19819, 99, 33511407
  27857, 99, 25774115
  44278, 91, 6081159
  40110, 99, 15128024
  178948, 90, 5347474
  175463, 81, 2355494
  138677, 90, 5356303
  77587, 91, 5904710
  158478, 85, 3570485
  93958, 83, 2684426
  39179, 88, 4425107
  138406, 77, 1591377
  33399, 90, 5866307
  1794, 99, 15057674
  45551, 91, 6363261
  121165, 90, 5748493
  89460, 88, 4624078
  53099, 80, 2008229
  169127, 73, 1067670
  115543, 82, 2546048
    -1, -1
    -1, -1
  32875, 500
  24817, 476
  212728, 1
  94827, 20
  59099, 74
  24642, 231
  5206, 99
  6293, 51`;

  expect(parseStats(csv)).toStrictEqual({
    skills: {
      overall: { rank: 40258, level: 2063, xp: 218035714 },
      attack: { rank: 20554, level: 99, xp: 21102621 },
      defence: { rank: 39059, level: 99, xp: 15364425 },
      strength: { rank: 14245, level: 99, xp: 26556827 },
      hitpoints: { rank: 19819, level: 99, xp: 33511407 },
      ranged: { rank: 27857, level: 99, xp: 25774115 },
      prayer: { rank: 44278, level: 91, xp: 6081159 },
      magic: { rank: 40110, level: 99, xp: 15128024 },
      cooking: { rank: 178948, level: 90, xp: 5347474 },
      woodcutting: { rank: 175463, level: 81, xp: 2355494 },
      fletching: { rank: 138677, level: 90, xp: 5356303 },
      fishing: { rank: 77587, level: 91, xp: 5904710 },
      firemaking: { rank: 158478, level: 85, xp: 3570485 },
      crafting: { rank: 93958, level: 83, xp: 2684426 },
      smithing: { rank: 39179, level: 88, xp: 4425107 },
      mining: { rank: 138406, level: 77, xp: 1591377 },
      herblore: { rank: 33399, level: 90, xp: 5866307 },
      agility: { rank: 1794, level: 99, xp: 15057674 },
      thieving: { rank: 45551, level: 91, xp: 6363261 },
      slayer: { rank: 121165, level: 90, xp: 5748493 },
      farming: { rank: 89460, level: 88, xp: 4624078 },
      runecraft: { rank: 53099, level: 80, xp: 2008229 },
      hunter: { rank: 169127, level: 73, xp: 1067670 },
      construction: { rank: 115543, level: 82, xp: 2546048 },
    },
    bh: {
      rogue: { rank: -1, score: -1 },
      hunter: { rank: -1, score: -1 },
    },
    lms: { rank: 32875, score: 500 },
    clues: {
      all: { rank: 24817, score: 476 },
      beginner: { rank: 212728, score: 1 },
      easy: { rank: 94827, score: 20 },
      medium: { rank: 59099, score: 74 },
      hard: { rank: 24642, score: 231 },
      elite: { rank: 5206, score: 99 },
      master: { rank: 6293, score: 51 },
    },
  });
});

test('Get rsn format', async done => {
  const callback = (data: string) => {
    expect(data).toBe('Lynx Titan');
    done();
  };

  getRSNFormat('lYnX tiTaN').then(callback);
});

test('Get attack top page', async done => {
  const callback = (data: PlayerSkillRow[]) => {
    expect(data).toMatchObject([
      {
        rsn: expect.any(String),
        rank: 1,
        level: 99,
        xp: 200000000,
        dead: false,
      },
      {
        rsn: expect.any(String),
        rank: 2,
        level: 99,
        xp: 200000000,
        dead: false,
      },
      { rsn: 'Drakon', rank: 3, level: 99, xp: 200000000, dead: false },
      {
        rsn: expect.any(String),
        rank: 4,
        level: 99,
        xp: 200000000,
        dead: false,
      },
      {
        rsn: expect.any(String),
        rank: 5,
        level: 99,
        xp: 200000000,
        dead: false,
      },
      {
        rsn: expect.any(String),
        rank: 6,
        level: 99,
        xp: 200000000,
        dead: false,
      },
      {
        rsn: expect.any(String),
        rank: 7,
        level: 99,
        xp: 200000000,
        dead: false,
      },
      {
        rsn: expect.any(String),
        rank: 8,
        level: 99,
        xp: 200000000,
        dead: false,
      },
      {
        rsn: expect.any(String),
        rank: 9,
        level: 99,
        xp: 200000000,
        dead: false,
      },
      {
        rsn: expect.any(String),
        rank: 10,
        level: 99,
        xp: 200000000,
        dead: false,
      },
      {
        rsn: expect.any(String),
        rank: 11,
        level: 99,
        xp: 200000000,
        dead: false,
      },
      {
        rsn: expect.any(String),
        rank: 12,
        level: 99,
        xp: 200000000,
        dead: false,
      },
      {
        rsn: expect.any(String),
        rank: 13,
        level: 99,
        xp: 200000000,
        dead: false,
      },
      {
        rsn: expect.any(String),
        rank: 14,
        level: 99,
        xp: 200000000,
        dead: false,
      },
      {
        rsn: expect.any(String),
        rank: 15,
        level: 99,
        xp: 200000000,
        dead: false,
      },
      {
        rsn: expect.any(String),
        rank: 16,
        level: 99,
        xp: 200000000,
        dead: false,
      },
      {
        rsn: expect.any(String),
        rank: 17,
        level: 99,
        xp: 200000000,
        dead: false,
      },
      {
        rsn: expect.any(String),
        rank: 18,
        level: 99,
        xp: 200000000,
        dead: false,
      },
      {
        rsn: expect.any(String),
        rank: 19,
        level: 99,
        xp: 200000000,
        dead: false,
      },
      {
        rsn: expect.any(String),
        rank: 20,
        level: 99,
        xp: 200000000,
        dead: false,
      },
      {
        rsn: expect.any(String),
        rank: 21,
        level: 99,
        xp: 200000000,
        dead: false,
      },
      {
        rsn: expect.any(String),
        rank: 22,
        level: 99,
        xp: 200000000,
        dead: false,
      },
      {
        rsn: expect.any(String),
        rank: 23,
        level: 99,
        xp: 200000000,
        dead: false,
      },
      {
        rsn: expect.any(String),
        rank: 24,
        level: 99,
        xp: 200000000,
        dead: false,
      },
      {
        rsn: expect.any(String),
        rank: 25,
        level: 99,
        xp: 200000000,
        dead: false,
      },
    ]);
    done();
  };

  getSkillPage('attack').then(callback);
});

test('Get non-existant player', async done => {
  const callback = (err: AxiosError) => {
    if (err.response) {
      expect(err.response.status).toBe(404);
    }
    done();
  };

  getStats('fishy').catch(callback);
});

test('Get stats by gamemode', async done => {
  const callback = (stats: Stats) => {
    expect(stats.skills).toStrictEqual({
      overall: { rank: 1, level: 2277, xp: 4600000000 },
      attack: { rank: 15, level: 99, xp: 200000000 },
      defence: { rank: 27, level: 99, xp: 200000000 },
      strength: { rank: 18, level: 99, xp: 200000000 },
      hitpoints: { rank: 7, level: 99, xp: 200000000 },
      ranged: { rank: 7, level: 99, xp: 200000000 },
      prayer: { rank: 11, level: 99, xp: 200000000 },
      magic: { rank: 32, level: 99, xp: 200000000 },
      cooking: { rank: 158, level: 99, xp: 200000000 },
      woodcutting: { rank: 15, level: 99, xp: 200000000 },
      fletching: { rank: 12, level: 99, xp: 200000000 },
      fishing: { rank: 9, level: 99, xp: 200000000 },
      firemaking: { rank: 49, level: 99, xp: 200000000 },
      crafting: { rank: 4, level: 99, xp: 200000000 },
      smithing: { rank: 3, level: 99, xp: 200000000 },
      mining: { rank: 25, level: 99, xp: 200000000 },
      herblore: { rank: 5, level: 99, xp: 200000000 },
      agility: { rank: 24, level: 99, xp: 200000000 },
      thieving: { rank: 12, level: 99, xp: 200000000 },
      slayer: { rank: 2, level: 99, xp: 200000000 },
      farming: { rank: 19, level: 99, xp: 200000000 },
      runecraft: { rank: 7, level: 99, xp: 200000000 },
      hunter: { rank: 4, level: 99, xp: 200000000 },
      construction: { rank: 4, level: 99, xp: 200000000 },
    });
    done();
  };

  getStatsByGamemode('Lynx Titan').then(callback);
});
