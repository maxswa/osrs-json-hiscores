import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { test, describe, it, expect, beforeEach, vi, Mock } from 'vitest';

import {
  getSkillPage,
  getActivityPage,
  getStats,
  getStatsByGamemode,
  getRSNFormat,
  getPlayerTableURL,
  getSkillPageURL,
  getActivityPageURL,
  getStatsURL,
  BOSSES,
  BH_MODES,
  InvalidRSNError,
  PlayerNotFoundError,
  HiScoresError,
  HttpError
} from '../src/index.js';
import { httpGet } from '../src/utils/helpers.js';

const B0ATY_NAME = 'B0ATY';
const B0ATY_FORMATTED_NAME = 'B0aty';
const LYNX_TITAN_SPACE_NAME = 'lYnX tiTaN';
const LYNX_TITAN_UNDERSCORE_NAME = 'lYnX_tiTaN';
const LYNX_TITAN_HYPHEN_NAME = 'lYnX-tiTaN';
const LYNX_TITAN_FORMATTED_NAME = 'Lynx Titan';
const NON_EXISTENT_NAME = 'nonExistent';
const ERROR_NAME = 'errorName';
const UNREACHABLE_NAME = 'unreachable';
const MALFORMED_NAME = 'malformed';
const NOT_THIS_PLAYER_NAME = 'Not The Row';

const here = (f: string) => fileURLToPath(new URL(f, import.meta.url));

const attackTopPage = readFileSync(here('attackTopPage.html'), 'utf8');
const b0atyNamePage = readFileSync(here('b0atyNamePage.html'), 'utf8');
const lynxTitanStats = JSON.parse(
  readFileSync(here('lynxTitanStats.json'), 'utf8')
);
const lynxTitanNamePage = readFileSync(here('lynxTitanNamePage.html'), 'utf8');
const allCluesTopPage = `<table><tbody>
  <tr class="personal-hiscores__row"><td class="right">1</td><td class="left"><a href="hiscorepersonal?user1=Tai">Tai</a></td><td class="right">1,234</td></tr>
  <tr class="personal-hiscores__row"><td class="right">2</td><td class="left"><img src="skull.png"/><a href="hiscorepersonal?user1=Dead Guy">Dead Guy</a></td><td class="right">567</td></tr>
</tbody></table>`;

const nestedCellPage = `<table><tbody>
  <tr class="personal-hiscores__row"><td class="right">1</td><td class="left"><table><tr><td>nested</td></tr></table><a href="hiscorepersonal?user1=Nested Guy">Nested Guy</a></td><td class="right">4,242</td></tr>
</tbody></table>`;

const shortRowPage = `<table><tbody>
  <tr class="personal-hiscores__row"><td class="right">1</td></tr>
</tbody></table>`;

const textResponse = (body: string) => new Response(body, { status: 200 });
const jsonResponse = (body: unknown) => Response.json(body, { status: 200 });

vi.stubGlobal(
  'fetch',
  vi.fn((url: string) => {
    const lynxUrls = [
      getPlayerTableURL('main', LYNX_TITAN_SPACE_NAME),
      getPlayerTableURL('main', LYNX_TITAN_UNDERSCORE_NAME),
      getPlayerTableURL('main', LYNX_TITAN_HYPHEN_NAME)
    ];
    if (lynxUrls.includes(url)) {
      return Promise.resolve(textResponse(lynxTitanNamePage));
    }
    if (getPlayerTableURL('main', B0ATY_NAME) === url) {
      return Promise.resolve(textResponse(b0atyNamePage));
    }
    if (getSkillPageURL('main', 'attack', 1) === url) {
      return Promise.resolve(textResponse(attackTopPage));
    }
    if (getSkillPageURL('main', 'attack', 2) === url) {
      return Promise.resolve(textResponse(shortRowPage));
    }
    if (getActivityPageURL('main', 'allClues', 1) === url) {
      return Promise.resolve(textResponse(allCluesTopPage));
    }
    if (getActivityPageURL('main', 'allClues', 2) === url) {
      return Promise.resolve(textResponse(nestedCellPage));
    }
    if (getPlayerTableURL('main', NOT_THIS_PLAYER_NAME) === url) {
      return Promise.resolve(textResponse(lynxTitanNamePage));
    }
    if (getStatsURL('main', LYNX_TITAN_FORMATTED_NAME) === url) {
      return Promise.resolve(jsonResponse(lynxTitanStats));
    }
    if (getPlayerTableURL('main', NON_EXISTENT_NAME) === url) {
      return Promise.resolve(textResponse('<html></html>'));
    }
    if (getStatsURL('main', NON_EXISTENT_NAME) === url) {
      return Promise.resolve(new Response('', { status: 404 }));
    }
    if (getPlayerTableURL('main', ERROR_NAME) === url) {
      return Promise.reject();
    }
    if (getStatsURL('main', UNREACHABLE_NAME) === url) {
      // what fetch throws on DNS/connection/TLS failure, not an HttpError
      return Promise.reject(new TypeError('fetch failed'));
    }
    if (getStatsURL('main', MALFORMED_NAME) === url) {
      return Promise.resolve(textResponse('not json'));
    }
    throw new Error(`No mock response for URL: ${url}`);
  })
);

test('Get activity top page', async () => {
  const data = await getActivityPage('allClues');
  expect(data).toStrictEqual([
    { name: 'Tai', rank: 1, score: 1234, dead: false },
    { name: 'Dead Guy', rank: 2, score: 567, dead: true }
  ]);
});

test('Get activity top page with a nested table in a cell', async () => {
  const data = await getActivityPage('allClues', 'main', 2);
  expect(data).toStrictEqual([
    { name: 'Nested Guy', rank: 1, score: 4242, dead: false }
  ]);
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
  it('falls back to the given name when the highlighted row is a different player', async () => {
    const data = await getRSNFormat(NOT_THIS_PLAYER_NAME);
    expect(data).toBe(NOT_THIS_PLAYER_NAME);
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

test('Degrade gracefully when a row has too few cells', async () => {
  const data = await getSkillPage('attack', 'main', 2);
  expect(data).toEqual([
    { name: '', rank: -1, level: -1, xp: -1, dead: false }
  ]);
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
  await expect(getStats(NON_EXISTENT_NAME)).rejects.toThrow(
    PlayerNotFoundError
  );
});

test('Get stats when the network is unreachable', async () => {
  await expect(getStatsByGamemode(UNREACHABLE_NAME)).rejects.toThrow(
    HiScoresError
  );
});

test('Get stats when the response body is not JSON', async () => {
  await expect(getStatsByGamemode(MALFORMED_NAME)).rejects.toThrow(
    HiScoresError
  );
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
    construction: { rank: expect.any(Number), level: 99, xp: 200000000 },
    sailing: { rank: expect.any(Number), level: 99, xp: 200000000 }
  });

  const bossKeys = Object.keys(bosses);
  expect(bossKeys).toStrictEqual(BOSSES);
  const bountyHunterKeys = Object.keys(bountyHunter);
  expect(bountyHunterKeys).toStrictEqual(BH_MODES);

  expect.assertions(3);
});

describe('Get stats options', () => {
  const rsn = 'player';
  let fetchMock: Mock;
  beforeEach(() => {
    fetchMock = vi.fn((url: string) =>
      Promise.resolve(
        url === getPlayerTableURL('main', rsn)
          ? textResponse(lynxTitanNamePage)
          : jsonResponse(lynxTitanStats)
      )
    );
    vi.stubGlobal('fetch', fetchMock);
  });
  it('fetches all gamemodes and formatted RSN when no options provided', async () => {
    await getStats(rsn);
    expect(fetchMock.mock.calls.map((val) => val[0])).toEqual([
      getStatsURL('main', rsn),
      getPlayerTableURL('main', rsn),
      getStatsURL('ironman', rsn),
      getStatsURL('hardcore', rsn),
      getStatsURL('ultimate', rsn)
    ]);
  });
  it('skips fetching formatted RSN when option is provided', async () => {
    await getStats(rsn, { shouldGetFormattedRsn: false });
    expect(
      fetchMock.mock.calls.some(
        (val) => val[0] === getPlayerTableURL('main', rsn)
      )
    ).toBeFalsy();
  });
  it('skips fetching game mode when option is provided', async () => {
    await getStats(rsn, {
      otherGamemodes: ['ironman', 'ultimate']
    });
    expect(
      fetchMock.mock.calls.some(
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

describe('httpGet', () => {
  const url = getStatsURL('main', B0ATY_NAME);
  const capture = () => {
    const seen: RequestInit[] = [];
    vi.stubGlobal(
      'fetch',
      vi.fn((_url: string, init: RequestInit) => {
        seen.push(init);
        return Promise.resolve(new Response('', { status: 200 }));
      })
    );
    return seen;
  };

  it('injects the User-Agent header for every request', async () => {
    const seen = capture();
    await httpGet(url);
    await httpGet(url, { headers: { 'X-Custom': '1' } });
    await httpGet(url, { headers: new Headers({ 'X-Custom': '2' }) });
    const expected =
      'Mozilla/5.0 (Windows NT 6.4; rv:80.0.0) Gecko/20100101 Firefox/80.0.0';
    expect(
      seen.map((init) => new Headers(init.headers).get('user-agent'))
    ).toEqual([expected, expected, expected]);
    expect(new Headers(seen[2].headers).get('x-custom')).toBe('2');
  });

  it('lets a caller override the User-Agent header', async () => {
    const seen = capture();
    await httpGet(url, { headers: { 'User-Agent': 'custom-agent' } });
    expect(new Headers(seen[0].headers).get('user-agent')).toBe('custom-agent');
  });

  it('throws an HttpError carrying the status on a non-2xx response', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(() => Promise.resolve(new Response('', { status: 503 })))
    );
    await expect(httpGet(url)).rejects.toThrow(HttpError);
    await expect(httpGet(url)).rejects.toMatchObject({ status: 503 });
  });
});
