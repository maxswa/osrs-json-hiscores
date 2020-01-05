import {
  parseStats,
  getSkillPage,
  getStats,
  getStatsByGamemode,
  getRSNFormat,
  Stats,
} from '../src/index';

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
  -1, -1
  24817, 476
  212728, 1
  94827, 20
  59099, 74
  24642, 231
  5206, 99
  6293, 51
  32875, 500
  374,2780
  934,3000
  1936,1452
  4919,23
  101,4038
  152,334
  6153,133
  4501,250
  6806,603
  1,17798
  9160,125
  1021,2802
  4295,1655
  959,2951
  10009,1
  1271,2407
  378,4669
  543,1567
  6003,94
  263,2897
  4000,1277
  41016,1477
  617,2391
  120,2981
  1,109
  26,323
  198,1101
  81,3404
  5027,61
  63,375
  2845,6
  6913,138
  3999,2000
  484,8
  957,47
  10987,223
  1923,272
  8484,1340
  599,1694
  12489,435
  3810,4583`;

  const expectedOutput: Stats = {
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
    leaguePoints: { rank: -1, score: -1 },
    bountyHunter: {
      rogue: { rank: -1, score: -1 },
      hunter: { rank: -1, score: -1 },
    },
    lastManStanding: { rank: 32875, score: 500 },
    clues: {
      all: { rank: 24817, score: 476 },
      beginner: { rank: 212728, score: 1 },
      easy: { rank: 94827, score: 20 },
      medium: { rank: 59099, score: 74 },
      hard: { rank: 24642, score: 231 },
      elite: { rank: 5206, score: 99 },
      master: { rank: 6293, score: 51 },
    },
    bosses: {
      abyssalSire: { rank: 374, score: 2780 },
      alchemicalHydra: { rank: 934, score: 3000 },
      barrows: { rank: 1936, score: 1452 },
      bryophyta: { rank: 4919, score: 23 },
      callisto: { rank: -1, score: -1 },
      cerberus: { rank: -1, score: -1 },
      chambersOfXeric: { rank: 101, score: 4038 },
      chambersOfXericChallengeMode: { rank: 152, score: 334 },
      chaosElemental: { rank: 6153, score: 133 },
      chaosFanatic: { rank: 4501, score: 250 },
      commanderZilyana: { rank: 6806, score: 603 },
      corporealBeast: { rank: 1, score: 17798 },
      crazyArchaeologist: { rank: 9160, score: 125 },
      dagannothPrime: { rank: 1021, score: 2802 },
      dagannothRex: { rank: 4295, score: 1655 },
      dagannothSupreme: { rank: 959, score: 2951 },
      derangedArchaeologist: { rank: 10009, score: 1 },
      generalGraardor: { rank: 1271, score: 2407 },
      giantMole: { rank: 378, score: 4669 },
      grotesqueGuardians: { rank: 543, score: 1567 },
      hespori: { rank: 6003, score: 94 },
      kalphiteQueen: { rank: 263, score: 2897 },
      kingBlackDragon: { rank: 4000, score: 1277 },
      kraken: { rank: 41016, score: 1477 },
      kreeArra: { rank: 617, score: 2391 },
      krilTsutsaroth: { rank: 120, score: 2981 },
      mimic: { rank: 1, score: 109 },
      obor: { rank: 26, score: 323 },
      sarachnis: { rank: 198, score: 1101 },
      scorpia: { rank: 81, score: 3404 },
      skotizo: { rank: 5027, score: 61 },
      gauntlet: { rank: 63, score: 375 },
      corruptedGauntlet: { rank: 2845, score: 6 },
      theatreOfBlood: { rank: 6913, score: 138 },
      thermonuclearSmokeDevil: { rank: 3999, score: 2000 },
      tzKalZuk: { rank: 484, score: 8 },
      tzTokJad: { rank: 957, score: 47 },
      venenatis: { rank: 10987, score: 223 },
      vetion: { rank: 1923, score: 272 },
      vorkath: { rank: 8484, score: 1340 },
      wintertodt: { rank: 599, score: 1694 },
      zalcano: { rank: 12489, score: 435 },
      zulrah: { rank: 3810, score: 4583 },
    },
  };

  expect(parseStats(csv)).toStrictEqual(expectedOutput);
});

test('Get name format', async () => {
  jest.setTimeout(30000);
  const data = await getRSNFormat('lYnX tiTaN');
  expect(data).toBe('Lynx Titan');
});

test('Get attack top page', async () => {
  jest.setTimeout(30000);
  const data = await getSkillPage('attack');
  expect(data).toMatchObject([
    {
      name: expect.any(String),
      rank: 1,
      level: 99,
      xp: 200000000,
      dead: false,
    },
    {
      name: expect.any(String),
      rank: 2,
      level: 99,
      xp: 200000000,
      dead: false,
    },
    { name: 'Drakon', rank: 3, level: 99, xp: 200000000, dead: false },
    {
      name: expect.any(String),
      rank: 4,
      level: 99,
      xp: 200000000,
      dead: false,
    },
    {
      name: expect.any(String),
      rank: 5,
      level: 99,
      xp: 200000000,
      dead: false,
    },
    {
      name: expect.any(String),
      rank: 6,
      level: 99,
      xp: 200000000,
      dead: false,
    },
    {
      name: expect.any(String),
      rank: 7,
      level: 99,
      xp: 200000000,
      dead: false,
    },
    {
      name: expect.any(String),
      rank: 8,
      level: 99,
      xp: 200000000,
      dead: false,
    },
    {
      name: expect.any(String),
      rank: 9,
      level: 99,
      xp: 200000000,
      dead: false,
    },
    {
      name: expect.any(String),
      rank: 10,
      level: 99,
      xp: 200000000,
      dead: false,
    },
    {
      name: expect.any(String),
      rank: 11,
      level: 99,
      xp: 200000000,
      dead: false,
    },
    {
      name: expect.any(String),
      rank: 12,
      level: 99,
      xp: 200000000,
      dead: false,
    },
    {
      name: expect.any(String),
      rank: 13,
      level: 99,
      xp: 200000000,
      dead: false,
    },
    {
      name: expect.any(String),
      rank: 14,
      level: 99,
      xp: 200000000,
      dead: false,
    },
    {
      name: expect.any(String),
      rank: 15,
      level: 99,
      xp: 200000000,
      dead: false,
    },
    {
      name: expect.any(String),
      rank: 16,
      level: 99,
      xp: 200000000,
      dead: false,
    },
    {
      name: expect.any(String),
      rank: 17,
      level: 99,
      xp: 200000000,
      dead: false,
    },
    {
      name: expect.any(String),
      rank: 18,
      level: 99,
      xp: 200000000,
      dead: false,
    },
    {
      name: expect.any(String),
      rank: 19,
      level: 99,
      xp: 200000000,
      dead: false,
    },
    {
      name: expect.any(String),
      rank: 20,
      level: 99,
      xp: 200000000,
      dead: false,
    },
    {
      name: expect.any(String),
      rank: 21,
      level: 99,
      xp: 200000000,
      dead: false,
    },
    {
      name: expect.any(String),
      rank: 22,
      level: 99,
      xp: 200000000,
      dead: false,
    },
    {
      name: expect.any(String),
      rank: 23,
      level: 99,
      xp: 200000000,
      dead: false,
    },
    {
      name: expect.any(String),
      rank: 24,
      level: 99,
      xp: 200000000,
      dead: false,
    },
    {
      name: expect.any(String),
      rank: 25,
      level: 99,
      xp: 200000000,
      dead: false,
    },
  ]);
});

test('Get non-existant player', async () => {
  jest.setTimeout(30000);
  getStats('fishy').catch(err => {
    if (err.response) {
      expect(err.response.status).toBe(404);
    }
  });
});

test('Get stats by gamemode', async () => {
  jest.setTimeout(30000);
  const { skills } = await getStatsByGamemode('Lynx Titan');
  expect(skills).toMatchObject({
    overall: { rank: expect.any(Number), level: 2277, xp: 4600000000 },
    attack: { rank: expect.any(Number), level: 99, xp: 200000000 },
    defence: { rank: expect.any(Number), level: 99, xp: 200000000 },
    strength: { rank: expect.any(Number), level: 99, xp: 200000000 },
    hitpoints: { rank: expect.any(Number), level: 99, xp: 200000000 },
    ranged: { rank: expect.any(Number), level: 99, xp: 200000000 },
    prayer: { rank: expect.any(Number), level: 99, xp: 200000000 },
    magic: { rank: expect.any(Number), level: 99, xp: 200000000 },
    cooking: { rank: expect.any(Number), level: 99, xp: 200000000 },
    woodcutting: { rank: expect.any(Number), level: 99, xp: 200000000 },
    fletching: { rank: expect.any(Number), level: 99, xp: 200000000 },
    fishing: { rank: expect.any(Number), level: 99, xp: 200000000 },
    firemaking: { rank: expect.any(Number), level: 99, xp: 200000000 },
    crafting: { rank: expect.any(Number), level: 99, xp: 200000000 },
    smithing: { rank: expect.any(Number), level: 99, xp: 200000000 },
    mining: { rank: expect.any(Number), level: 99, xp: 200000000 },
    herblore: { rank: expect.any(Number), level: 99, xp: 200000000 },
    agility: { rank: expect.any(Number), level: 99, xp: 200000000 },
    thieving: { rank: expect.any(Number), level: 99, xp: 200000000 },
    slayer: { rank: expect.any(Number), level: 99, xp: 200000000 },
    farming: { rank: expect.any(Number), level: 99, xp: 200000000 },
    runecraft: { rank: expect.any(Number), level: 99, xp: 200000000 },
    hunter: { rank: expect.any(Number), level: 99, xp: 200000000 },
    construction: { rank: expect.any(Number), level: 99, xp: 200000000 },
  });
});
