import axios from 'axios';
import { readFileSync } from 'fs';

import {
  parseStats,
  getSkillPage,
  getStats,
  getStatsByGamemode,
  getRSNFormat,
  Stats,
  getPlayerTableURL,
  getSkillPageURL,
  getStatsURL,
  BOSSES,
  InvalidFormatError,
  BH_MODES,
  parseJsonStats,
  HiscoresResponse,
  InvalidRSNError,
  PlayerNotFoundError,
  HiScoresError
} from '../src/index';

const B0ATY_NAME = 'B0ATY';
const B0ATY_FORMATTED_NAME = 'B0aty';
const LYNX_TITAN_SPACE_NAME = 'lYnX tiTaN';
const LYNX_TITAN_UNDERSCORE_NAME = 'lYnX_tiTaN';
const LYNX_TITAN_HYPHEN_NAME = 'lYnX-tiTaN';
const LYNX_TITAN_FORMATTED_NAME = 'Lynx Titan';
const NON_EXISTENT_NAME = 'nonExistent';
const ERROR_NAME = 'errorName';

const attackTopPage = readFileSync(`${__dirname}/attackTopPage.html`, 'utf8');
const b0atyNamePage = readFileSync(`${__dirname}/b0atyNamePage.html`, 'utf8');
const b0atyStatsCsv = readFileSync(`${__dirname}/b0atyStats.csv`, 'utf8');
const b0atyStatsJson: HiscoresResponse = JSON.parse(
  readFileSync(`${__dirname}/b0atyStats.json`, 'utf8')
);
const lynxTitanStats = JSON.parse(
  readFileSync(`${__dirname}/lynxTitanStats.json`, 'utf8')
);
const lynxTitanNamePage = readFileSync(
  `${__dirname}/lynxTitanNamePage.html`,
  'utf8'
);

jest.spyOn(axios, 'get').mockImplementation((url) => {
  const lynxUrls = [
    getPlayerTableURL('main', LYNX_TITAN_SPACE_NAME),
    getPlayerTableURL('main', LYNX_TITAN_UNDERSCORE_NAME),
    getPlayerTableURL('main', LYNX_TITAN_HYPHEN_NAME)
  ];
  if (lynxUrls.includes(url)) {
    return Promise.resolve({ data: lynxTitanNamePage });
  }
  if (getPlayerTableURL('main', B0ATY_NAME) === url) {
    return Promise.resolve({ data: b0atyNamePage });
  }
  if (getSkillPageURL('main', 'attack', 1) === url) {
    return Promise.resolve({ data: attackTopPage });
  }
  if (getStatsURL('main', LYNX_TITAN_FORMATTED_NAME, true) === url) {
    return Promise.resolve({ status: 200, data: lynxTitanStats });
  }
  if (getPlayerTableURL('main', NON_EXISTENT_NAME) === url) {
    return Promise.resolve({ data: '<html></html>' });
  }
  if (getPlayerTableURL('main', ERROR_NAME)) {
    return Promise.reject();
  }
  throw new Error(`No mock response for URL: ${url}`);
});

test('Parse CSV to json', () => {
  const csv = `246,2277,1338203419
  615,99,77438259
  428,99,69176307
  425,99,115218641
  138,99,181425111
  160,99,169725807
  97,99,50666171
  144,99,93155913
  2108,99,53198880
  5750,99,19589494
  295,99,76386488
  1304,99,32252994
  847,99,54325931
  534,99,26379932
  7213,99,13246799
  2475,99,18161285
  1837,99,14746134
  668,99,23961670
  3841,99,17970837
  265,99,56230978
  821,99,62123353
  169,99,43127930
  810,99,37688883
  92,99,32005622
  23423,478
  89554,301
  89914,35
  99834,25
  99831,23
  89912,37
  32,12148
  3105,76
  1997,505
  127,4259
  361,915
  392,250
  1,6143
  4814,898
  13,4057
  37,225
  25,1110
  7827,43249
  1114,1155
  382,2780
  944,3000
  561,398429
  37,111
  704,892
  1981,1452
  4981,23
  888,1046
  444,792
  613,4856
  102,4038
  156,334
  6240,133
  4569,250
  6893,603
  1,17798
  9320,125
  1030,2802
  4342,1655
  966,2951
  10151,1
  100,735
  1289,2477
  1288,2407
  377,4669
  545,1567
  6083,94
  264,2897
  4052,1277
  41643,1477
  625,2391
  120,2981
  54,2958
  1,109
  99,39002
  3,22666
  2,84
  26,323
  44,6233
  201,1101
  82,3404
  555,7079
  5085,61
  8731,1423
  678,903
  18823,23
  63,375
  2870,6
  891,9102
  2871,7
  5606,149
  2872,8
  6984,138
  23,923141
  4043,2000
  4073,1020
  289,13070
  489,8
  967,47
  968,48
  11155,223
  1940,272
  8623,1340
  605,1694
  15233,245
  -1,-1
  3867,4583`;

  const expectedOutput: Stats = {
    skills: {
      overall: { rank: 246, level: 2277, xp: 1338203419 },
      attack: { rank: 615, level: 99, xp: 77438259 },
      defence: { rank: 428, level: 99, xp: 69176307 },
      strength: { rank: 425, level: 99, xp: 115218641 },
      hitpoints: { rank: 138, level: 99, xp: 181425111 },
      ranged: { rank: 160, level: 99, xp: 169725807 },
      prayer: { rank: 97, level: 99, xp: 50666171 },
      magic: { rank: 144, level: 99, xp: 93155913 },
      cooking: { rank: 2108, level: 99, xp: 53198880 },
      woodcutting: { rank: 5750, level: 99, xp: 19589494 },
      fletching: { rank: 295, level: 99, xp: 76386488 },
      fishing: { rank: 1304, level: 99, xp: 32252994 },
      firemaking: { rank: 847, level: 99, xp: 54325931 },
      crafting: { rank: 534, level: 99, xp: 26379932 },
      smithing: { rank: 7213, level: 99, xp: 13246799 },
      mining: { rank: 2475, level: 99, xp: 18161285 },
      herblore: { rank: 1837, level: 99, xp: 14746134 },
      agility: { rank: 668, level: 99, xp: 23961670 },
      thieving: { rank: 3841, level: 99, xp: 17970837 },
      slayer: { rank: 265, level: 99, xp: 56230978 },
      farming: { rank: 821, level: 99, xp: 62123353 },
      runecraft: { rank: 169, level: 99, xp: 43127930 },
      hunter: { rank: 810, level: 99, xp: 37688883 },
      construction: { rank: 92, level: 99, xp: 32005622 }
    },
    leaguePoints: { rank: 23423, score: 478 },
    deadmanPoints: { rank: 89554, score: 301 },
    bountyHunter: {
      hunterV2: { rank: 89914, score: 35 },
      rogueV2: { rank: 99834, score: 25 },
      hunter: { rank: 99831, score: 23 },
      rogue: { rank: 89912, score: 37 }
    },
    lastManStanding: { rank: 4814, score: 898 },
    pvpArena: { rank: 13, score: 4057 },
    soulWarsZeal: { rank: 37, score: 225 },
    riftsClosed: { rank: 25, score: 1110 },
    colosseumGlory: { rank: 7827, score: 43249 },
    collectionsLogged: { rank: 1114, score: 1155 },
    clues: {
      all: { rank: 32, score: 12148 },
      beginner: { rank: 3105, score: 76 },
      easy: { rank: 1997, score: 505 },
      medium: { rank: 127, score: 4259 },
      hard: { rank: 361, score: 915 },
      elite: { rank: 392, score: 250 },
      master: { rank: 1, score: 6143 }
    },
    bosses: {
      abyssalSire: { rank: 382, score: 2780 },
      alchemicalHydra: { rank: 944, score: 3000 },
      amoxliatl: { rank: 561, score: 398429 },
      araxxor: { rank: 37, score: 111 },
      artio: { rank: 704, score: 892 },
      barrows: { rank: 1981, score: 1452 },
      bryophyta: { rank: 4981, score: 23 },
      callisto: { rank: 888, score: 1046 },
      calvarion: { rank: 444, score: 792 },
      cerberus: { rank: 613, score: 4856 },
      chambersOfXeric: { rank: 102, score: 4038 },
      chambersOfXericChallengeMode: { rank: 156, score: 334 },
      chaosElemental: { rank: 6240, score: 133 },
      chaosFanatic: { rank: 4569, score: 250 },
      commanderZilyana: { rank: 6893, score: 603 },
      corporealBeast: { rank: 1, score: 17798 },
      crazyArchaeologist: { rank: 9320, score: 125 },
      dagannothPrime: { rank: 1030, score: 2802 },
      dagannothRex: { rank: 4342, score: 1655 },
      dagannothSupreme: { rank: 966, score: 2951 },
      derangedArchaeologist: { rank: 10151, score: 1 },
      doomOfMokhaiotl: { rank: 100, score: 735 },
      dukeSucellus: { rank: 1289, score: 2477 },
      generalGraardor: { rank: 1288, score: 2407 },
      giantMole: { rank: 377, score: 4669 },
      grotesqueGuardians: { rank: 545, score: 1567 },
      hespori: { rank: 6083, score: 94 },
      kalphiteQueen: { rank: 264, score: 2897 },
      kingBlackDragon: { rank: 4052, score: 1277 },
      kraken: { rank: 41643, score: 1477 },
      kreeArra: { rank: 625, score: 2391 },
      krilTsutsaroth: { rank: 120, score: 2981 },
      lunarChests: { rank: 54, score: 2958 },
      mimic: { rank: 1, score: 109 },
      nex: { rank: 99, score: 39002 },
      nightmare: { rank: 3, score: 22666 },
      phosanisNightmare: { rank: 2, score: 84 },
      obor: { rank: 26, score: 323 },
      phantomMuspah: { rank: 44, score: 6233 },
      sarachnis: { rank: 201, score: 1101 },
      scorpia: { rank: 82, score: 3404 },
      scurrius: { rank: 555, score: 7079 },
      skotizo: { rank: 5085, score: 61 },
      solHeredit: { rank: 8731, score: 1423 },
      spindel: { rank: 678, score: 903 },
      tempoross: { rank: 18823, score: 23 },
      gauntlet: { rank: 63, score: 375 },
      corruptedGauntlet: { rank: 2870, score: 6 },
      hueycoatl: { rank: 891, score: 9102 },
      leviathan: { rank: 2871, score: 7 },
      royalTitans: { rank: 5606, score: 149 },
      whisperer: { rank: 2872, score: 8 },
      theatreOfBlood: { rank: 6984, score: 138 },
      theatreOfBloodHardMode: { rank: 23, score: 923141 },
      thermonuclearSmokeDevil: { rank: 4043, score: 2000 },
      tombsOfAmascut: { rank: 4073, score: 1020 },
      tombsOfAmascutExpertMode: { rank: 289, score: 13070 },
      tzKalZuk: { rank: 489, score: 8 },
      tzTokJad: { rank: 967, score: 47 },
      vardorvis: { rank: 968, score: 48 },
      venenatis: { rank: 11155, score: 223 },
      vetion: { rank: 1940, score: 272 },
      vorkath: { rank: 8623, score: 1340 },
      wintertodt: { rank: 605, score: 1694 },
      yama: { rank: 15233, score: 245 },
      zalcano: { rank: -1, score: -1 },
      zulrah: { rank: 3867, score: 4583 }
    }
  };

  expect(parseStats(csv)).toStrictEqual(expectedOutput);
});

test('Parse CSV with unknown activity', () => {
  const statsWithUnknownActivity = `${lynxTitanStats}
    -1,-1`;
  expect(() => parseStats(statsWithUnknownActivity)).toThrow(
    InvalidFormatError
  );
});

test('Parse invalid CSV', () => {
  expect(() => parseStats('invalid')).toThrow(InvalidFormatError);
});

describe('Get name format', () => {
  it('gets a name with a space', async () => {
    const data = await getRSNFormat(LYNX_TITAN_SPACE_NAME);
    expect(data).toBe(LYNX_TITAN_FORMATTED_NAME);
  });
  it('gets a name with an underscore', async () => {
    const data = await getRSNFormat(LYNX_TITAN_UNDERSCORE_NAME);
    expect(data).toBe(LYNX_TITAN_FORMATTED_NAME);
  });
  it('gets a name with a hyphen', async () => {
    const data = await getRSNFormat(LYNX_TITAN_HYPHEN_NAME);
    expect(data).toBe(LYNX_TITAN_FORMATTED_NAME);
  });
  it('gets a name with a number', async () => {
    const data = await getRSNFormat(B0ATY_NAME);
    expect(data).toBe(B0ATY_FORMATTED_NAME);
  });
  it('throws an error for a name with invalid characters', async () => {
    await expect(getRSNFormat('b&aty')).rejects.toThrow(InvalidRSNError);
  });
  it('throws an error for a non-existent player', async () => {
    await expect(getRSNFormat(NON_EXISTENT_NAME)).rejects.toThrow(
      PlayerNotFoundError
    );
  });
  it('throws an error for a hiscores issue', async () => {
    await expect(getRSNFormat(ERROR_NAME)).rejects.toThrow(HiScoresError);
  });
});

test('Get attack top page', async () => {
  const data = await getSkillPage('attack');
  expect(data).toMatchObject([
    {
      name: expect.any(String),
      rank: 1,
      level: 99,
      xp: 200000000,
      dead: false
    },
    {
      name: expect.any(String),
      rank: 2,
      level: 99,
      xp: 200000000,
      dead: false
    },
    {
      name: expect.any(String),
      rank: 3,
      level: 99,
      xp: 200000000,
      dead: false
    },
    {
      name: expect.any(String),
      rank: 4,
      level: 99,
      xp: 200000000,
      dead: false
    },
    {
      name: expect.any(String),
      rank: 5,
      level: 99,
      xp: 200000000,
      dead: false
    },
    {
      name: expect.any(String),
      rank: 6,
      level: 99,
      xp: 200000000,
      dead: false
    },
    {
      name: expect.any(String),
      rank: 7,
      level: 99,
      xp: 200000000,
      dead: false
    },
    {
      name: expect.any(String),
      rank: 8,
      level: 99,
      xp: 200000000,
      dead: false
    },
    {
      name: expect.any(String),
      rank: 9,
      level: 99,
      xp: 200000000,
      dead: false
    },
    {
      name: expect.any(String),
      rank: 10,
      level: 99,
      xp: 200000000,
      dead: false
    },
    {
      name: expect.any(String),
      rank: 11,
      level: 99,
      xp: 200000000,
      dead: false
    },
    {
      name: expect.any(String),
      rank: 12,
      level: 99,
      xp: 200000000,
      dead: false
    },
    {
      name: expect.any(String),
      rank: 13,
      level: 99,
      xp: 200000000,
      dead: false
    },
    {
      name: expect.any(String),
      rank: 14,
      level: 99,
      xp: 200000000,
      dead: false
    },
    {
      name: expect.any(String),
      rank: 15,
      level: 99,
      xp: 200000000,
      dead: false
    },
    {
      name: expect.any(String),
      rank: 16,
      level: 99,
      xp: 200000000,
      dead: false
    },
    {
      name: expect.any(String),
      rank: 17,
      level: 99,
      xp: 200000000,
      dead: false
    },
    {
      name: expect.any(String),
      rank: 18,
      level: 99,
      xp: 200000000,
      dead: false
    },
    {
      name: expect.any(String),
      rank: 19,
      level: 99,
      xp: 200000000,
      dead: false
    },
    {
      name: expect.any(String),
      rank: 20,
      level: 99,
      xp: 200000000,
      dead: false
    },
    {
      name: expect.any(String),
      rank: 21,
      level: 99,
      xp: 200000000,
      dead: false
    },
    {
      name: expect.any(String),
      rank: 22,
      level: 99,
      xp: 200000000,
      dead: false
    },
    {
      name: expect.any(String),
      rank: 23,
      level: 99,
      xp: 200000000,
      dead: false
    },
    {
      name: expect.any(String),
      rank: 24,
      level: 99,
      xp: 200000000,
      dead: false
    },
    {
      name: expect.any(String),
      rank: 25,
      level: 99,
      xp: 200000000,
      dead: false
    }
  ]);
});

test('Get non-existent player', async () => {
  getStats('fishy').catch((err) => {
    if (err?.response) {
      expect(err.response.status).toBe(404);
    }
  });
});

test('Get stats by gamemode', async () => {
  const { skills, bosses, bountyHunter } = await getStatsByGamemode(
    LYNX_TITAN_FORMATTED_NAME
  );

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
    construction: { rank: expect.any(Number), level: 99, xp: 200000000 }
  });

  const bossKeys = Object.keys(bosses);
  expect(bossKeys).toStrictEqual(BOSSES);
  const bountyHunterKeys = Object.keys(bountyHunter);
  expect(bountyHunterKeys).toStrictEqual(BH_MODES);

  expect.assertions(3);
});

describe('Get stats options', () => {
  const rsn = 'player';
  let axiosMock: jest.Mock;
  beforeEach(() => {
    axios.get = jest.fn(
      (url) =>
        new Promise<any>((resolve) => {
          resolve(
            url === getPlayerTableURL('main', rsn)
              ? { data: lynxTitanNamePage }
              : { status: 200, data: lynxTitanStats }
          );
        })
    );
    axiosMock = axios.get as any;
    axiosMock.mockClear();
  });
  it('fetches all gamemodes and formatted RSN when no options provided', async () => {
    await getStats(rsn);
    expect(axiosMock.mock.calls.map((val) => val[0])).toEqual([
      getStatsURL('main', rsn, true),
      getPlayerTableURL('main', rsn),
      getStatsURL('ironman', rsn, true),
      getStatsURL('hardcore', rsn, true),
      getStatsURL('ultimate', rsn, true)
    ]);
  });
  it('skips fetching formatted RSN when option is provided', async () => {
    await getStats(rsn, { shouldGetFormattedRsn: false });
    expect(
      axiosMock.mock.calls.some(
        (val) => val[0] === getPlayerTableURL('main', rsn)
      )
    ).toBeFalsy();
  });
  it('skips fetching game mode when option is provided', async () => {
    await getStats(rsn, {
      otherGamemodes: ['ironman', 'ultimate']
    });
    expect(
      axiosMock.mock.calls.some(
        (val) => val[0] === getStatsURL('hardcore', rsn)
      )
    ).toBeFalsy();
  });
  it('omits excluded gamemodes', async () => {
    const response = await getStats(rsn, {
      otherGamemodes: ['ironman', 'ultimate']
    });
    expect(response.hardcore).toBeUndefined();
  });
});

test('CSV and JSON parsing outputs identical object', async () => {
  const csvOutput = parseStats(b0atyStatsCsv);
  const jsonOutput = parseJsonStats(b0atyStatsJson);
  expect(csvOutput).toEqual(jsonOutput);
});
