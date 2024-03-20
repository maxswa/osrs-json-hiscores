# OSRS .json Hiscores

[![npm](https://img.shields.io/npm/v/osrs-json-hiscores.svg?style=flat-square)](https://www.npmjs.com/package/osrs-json-hiscores)
[![downloads](https://img.shields.io/npm/dm/osrs-json-hiscores.svg?style=flat-square)](https://npm-stat.com/charts.html?package=osrs-json-hiscores)
[![types](https://img.shields.io/npm/types/osrs-json-hiscores.svg?style=flat-square)](https://github.com/maxswa/osrs-json-hiscores/blob/master/src/types.ts)
[![build](https://img.shields.io/github/actions/workflow/status/maxswa/osrs-json-hiscores/main.yml?style=flat-square&branch=main)](https://github.com/maxswa/osrs-json-hiscores/actions/workflows/main.yml?query=branch%3Amain)

**The Old School RuneScape API wrapper that does more!**

## What it does

The official hiscores API for Old School RuneScape (OSRS) can return CSV or a simple JSON array.
This wrapper converts the hiscores data into a more usable JSON object and provides extra information about the given player. By comparing player info it infers the player's game mode, as well as any previous modes (de-ultimated, de-ironed and/or died as a hardcore ironman).

Additional functions are provided that screen-scrape the OSRS leaderboards and return a list of players as json. Also simple utility functions are provided to fetch the raw responses from Jagex's APIs, if desired.

`osrs-json-hiscores` has TypeScript support, with full definitions for all functions and custom data types.

---

### ⚠ Disclaimer ⚠

Jagex does not provide `Access-Control-Allow-Origin` headers in their responses. This means that [CORS](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS) will block all browser requests to their hiscores API. In order to get around this, osrs-json-hiscores needs to be installed on the server side and exposed to the front end via a simple API. Here is an example of this in use: [codesandbox.io/s/osrs-json-hiscores-demo](https://codesandbox.io/s/osrs-json-hiscores-demo-qz656)

TLDR: You cannot use this library directly in your client side app e.g. React or Vue, you must set up a server which uses this lib internally and have your client fetch data from your server.

---

## Installation

With npm:

```
$ npm install osrs-json-hiscores
```

With Yarn:

```
$ yarn add osrs-json-hiscores
```

## How to use

Install the package and then import it into your project:

```typescript
import { getStatsByGamemode, getSkillPage } from 'osrs-json-hiscores';
```

Once you import it you can call the functions asynchronously:

```typescript
const stats = await getStatsByGamemode('Lynx Titan');
const topPage = await getSkillPage('overall');
```

`getStats` will return a full player object with gamemode.  
`getStatsByGameMode` will return a stats object and accepts a gamemode parameter:

| Game mode        |    Param     |
| ---------------- | :----------: |
| Regular          |    `main`    |
| Ironman          |  `ironman`   |
| Hardcore Ironman |  `hardcore`  |
| Ultimate Ironman |  `ultimate`  |
| Deadman Mode     |  `deadman`   |
| Tournament       | `tournament` |
| Leagues          |  `seasonal`  |

`getSkillPage` and `getActivityPage` require a skill / activity and optionally a gamemode and page:

```typescript
getSkillPage('attack', 'main', 1)
  .then((res) => console.log(res))
  .catch((err) => console.error(err));
```

Activities consist of all levels of clue scrolls as well as minigames and bosses:

### Clue Scrolls

| Type     |      Param      |
| -------- | :-------------: |
| All      |   `allClues`    |
| Beginner | `beginnerClues` |
| Easy     |   `easyClues`   |
| Medium   |  `mediumClues`  |
| Hard     |   `hardClues`   |
| Elite    |  `eliteClues`   |
| Master   |  `masterClues`  |

### Minigames

| Minigame                        |       Param       |
| ------------------------------- | :---------------: |
| Bounty Hunter (Legacy - Rogue)  |     `rogueBH`     |
| Bounty Hunter (Legacy - Hunter) |    `hunterBH`     |
| Bounty Hunter (Rogue)           |    `rogueBHV2`    |
| Bounty Hunter (Hunter)          |   `hunterBHV2`    |
| LMS - Rank                      | `lastManStanding` |
| PvP Arena - Rank                |    `pvpArena`     |
| Soul Wars Zeal                  |  `soulWarsZeal`   |
| Rifts closed                    |   `riftsClosed`   |
| Colosseum Glory                 | `colosseumGlory`  |

### Points

| Activity       |      Param      |
| -------------- | :-------------: |
| League Points  | `leaguePoints`  |
| Deadman Points | `deadmanPoints` |

### Bosses

| Boss Name                         |             Param              |
| --------------------------------- | :----------------------------: |
| Abyssal Sire                      |         `abyssalSire`          |
| Alchemical Hydra                  |       `alchemicalHydra`        |
| Artio                             |            `artio`             |
| Barrows Chests                    |           `barrows`            |
| Bryophyta                         |          `bryophyta`           |
| Callisto                          |           `callisto`           |
| Calvar'ion                        |          `calvarion`           |
| Cerberus                          |           `cerberus`           |
| Chambers Of Xeric                 |       `chambersOfXeric`        |
| Chambers Of Xeric: Challenge Mode | `chambersOfXericChallengeMode` |
| Chaos Elemental                   |        `chaosElemental`        |
| Chaos Fanatic                     |         `chaosFanatic`         |
| Commander Zilyana                 |       `commanderZilyana`       |
| Corporeal Beast                   |        `corporealBeast`        |
| Crazy Archaeologist               |      `crazyArchaeologist`      |
| Dagannoth Prime                   |        `dagannothPrime`        |
| Dagannoth Rex                     |         `dagannothRex`         |
| Dagannoth Supreme                 |       `dagannothSupreme`       |
| Deranged Archaeologist            |    `derangedArchaeologist`     |
| Duke Sucellus                     |         `dukeSucellus`         |
| General Graardor                  |       `generalGraardor`        |
| Giant Mole                        |          `giantMole`           |
| Grotesque Guardians               |      `grotesqueGuardians`      |
| Hespori                           |           `hespori`            |
| Kalphite Queen                    |        `kalphiteQueen`         |
| King Black Dragon                 |       `kingBlackDragon`        |
| Kraken                            |            `kraken`            |
| Kreearra                          |           `kreeArra`           |
| K'ril Tsutsaroth                  |        `krilTsutsaroth`        |
| Lunar Chests                      |         `lunarChests`          |
| Mimic                             |            `mimic`             |
| Nex                               |             `nex`              |
| Nightmare                         |          `nightmare`           |
| Phosani's Nightmare               |      `phosanisNightmare`       |
| Obor                              |             `obor`             |
| Phantom Muspah                    |        `phantomMuspah`         |
| Sarachnis                         |          `sarachnis`           |
| Scorpia                           |           `scorpia`            |
| Scurrius                          |           `scurrius`           |
| Skotizo                           |           `skotizo`            |
| Sol Heredit                       |          `solHeredit`          |
| Spindel                           |           `spindel`            |
| Tempoross                         |          `tempoross`           |
| The Gauntlet                      |           `gauntlet`           |
| The Corrupted Gauntlet            |      `corruptedGauntlet`       |
| The Leviathan                     |          `leviathan`           |
| The Whisperer                     |          `whisperer`           |
| Theatre Of Blood                  |        `theatreOfBlood`        |
| Theatre Of Blood: Hard Mode       |    `theatreOfBloodHardMode`    |
| Thermonuclear Smoke Devil         |   `thermonuclearSmokeDevil`    |
| Tombs of Amascut                  |        `tombsOfAmascut`        |
| Tombs of Amascut: Expert Mode     |   `tombsOfAmascutExpertMode`   |
| TzKal-Zuk                         |           `tzKalZuk`           |
| TzTok-Jad                         |           `tzTokJad`           |
| Vardorvis                         |          `vardorvis`           |
| Venenatis                         |          `venenatis`           |
| Vetion                            |            `vetion`            |
| Vorkath                           |           `vorkath`            |
| Wintertodt                        |          `wintertodt`          |
| Zalcano                           |           `zalcano`            |
| Zulrah                            |            `zulrah`            |

## What you'll get

`getStats` returns a player object that looks like this:

```typescript
{
  name: 'Lynx Titan',
  mode: 'main',
  dead: false,
  deulted: false,
  deironed: false,
  main: {
    skills: {
      overall: {rank: 1, level: 2277, xp: 4600000000},
      attack: {},
      defence: {},
      // ...
    },
    clues: {},
    leaguePoints: {},
    bountyHunter: {},
    lastManStanding: {},
    pvpArena: {},
    soulWarsZeal: {},
    riftsClosed: {},
    bosses: {}
  }
}
```

`getSkillPage` returns and array of 25 players (This represents a page on the hiscores):

```typescript
[
  { rank: 1, name: 'Lynx Titan', level: 2277, xp: 4600000000, dead: false },
  {},
  {}
  // ...
];
```

## Helpful Extras

Get the properly formatted name of any skill, boss, clue or other activity:

```typescript
// kril === "K'ril Tsutsaroth"
const kril = FORMATTED_BOSS_NAMES['krilTsutsaroth'];
```
