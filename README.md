# OSRS .json Hiscores

[![npm](https://img.shields.io/npm/v/osrs-json-hiscores.svg?style=flat-square)](https://www.npmjs.com/package/osrs-json-hiscores)
[![downloads](https://img.shields.io/npm/dm/osrs-json-hiscores.svg?style=flat-square)](https://npm-stat.com/charts.html?package=osrs-json-hiscores)
[![types](https://img.shields.io/npm/types/osrs-json-hiscores.svg?style=flat-square)](https://github.com/maxswa/osrs-json-hiscores/blob/master/src/types.ts)

**The Oldschool Runescape API wrapper that does more!**

## What it does

The official hiscores API for Oldschool Runescape (OSRS) returns CSV.
This wrapper converts it to json and provides extra information about the given player. By comparing player info it infers the player's game mode, as well as any previous modes (de-ultimated, de-ironed and/or died as a hardcore ironman).

Additional functions are provided that screen-scrape the OSRS leaderboards and return a list of players as json.

`osrs-json-hiscores` has TypeScript support, with full definitions for all functions and custom data types.

---

### Disclaimer

Jagex does not provide `Access-Control-Allow-Origin` headers in their responses. This means that [CORS](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS) will block all browser requests to their hiscores API. In order to get around this, osrs-json-hiscores should be installed on the server side and exposed to the front end via a simple API. Here is an example of this in use: [codesandbox.io/s/osrs-json-hiscores-demo](https://codesandbox.io/s/osrs-json-hiscores-demo-qz656)

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

```javascript
const hiscores = require('osrs-json-hiscores');
```

Once you import it you can call the functions asynchronously:

```javascript
hiscores
  .getStats('Lynx Titan')
  .then(res => console.log(res))
  .catch(err => console.error(err));
```

If you are using TypeScript or transpiling your JS you can use ES6 syntax:

```javascript
import hiscores, { getSkillPage } from 'osrs-json-hiscores';

// ...

const stats = await hiscores.getStats('Lynx Titan');
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

```javascript
hiscores
  .getSkillPage('attack', 'main', 1)
  .then(res => console.log(res))
  .catch(err => console.error(err));
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

| Minigame               |       Param       |
| ---------------------- | :---------------: |
| Bounty Hunter (Rogue)  |     `rogueBH`     |
| Bounty Hunter (Hunter) |    `hunterBH`     |
| Last Man Standing      | `lastManStanding` |

### Leagues

| Activity      |     Param      |
| ------------- | :------------: |
| League Points | `leaguePoints` |

### Bosses

| Boss Name                        |             Param              |
| -------------------------------- | :----------------------------: |
| Abyssal Sire                     |         `abyssalSire`          |
| Alchemical Hydra                 |       `alchemicalHydra`        |
| Barrows Chests                   |           `barrows`            |
| Bryophyta                        |          `bryophyta`           |
| Callisto                         |           `callisto`           |
| Cerberus                         |           `cerberus`           |
| Chambers Of Xeric                |       `chambersOfXeric`        |
| Chambers Of Xeric Challenge Mode | `chambersOfXericChallengeMode` |
| Chaos Elemental                  |        `chaosElemental`        |
| Chaos Fanatic                    |         `chaosFanatic`         |
| Commander Zilyana                |       `commanderZilyana`       |
| Corporeal Beast                  |        `corporealBeast`        |
| Crazy Archaeologist              |      `crazyArchaeologist`      |
| Dagannoth Prime                  |        `dagannothPrime`        |
| Dagannoth Rex                    |         `dagannothRex`         |
| Dagannoth Supreme                |       `dagannothSupreme`       |
| Deranged Archaeologist           |    `derangedArchaeologist`     |
| General Graardor                 |       `generalGraardor`        |
| Giant Mole                       |          `giantMole`           |
| Grotesque Guardians              |      `grotesqueGuardians`      |
| Hespori                          |           `hespori`            |
| Kalphite Queen                   |        `kalphiteQueen`         |
| King Black Dragon                |       `kingBlackDragon`        |
| Kraken                           |            `kraken`            |
| Kreearra                         |           `kreeArra`           |
| K'ril Tsutsaroth                 |        `krilTsutsaroth`        |
| Mimic                            |            `mimic`             |
| The Nightmare of Ashihama        |          `nightmare`           |
| Obor                             |             `obor`             |
| Sarachnis                        |          `sarachnis`           |
| Scorpia                          |           `scorpia`            |
| Skotizo                          |           `skotizo`            |
| Gauntlet                         |           `gauntlet`           |
| Corrupted Gauntlet               |      `corruptedGauntlet`       |
| Theatre Of Blood                 |        `theatreOfBlood`        |
| Thermonuclear Smoke Devil        |   `thermonuclearSmokeDevil`    |
| TzKal-Zuk                        |           `tzKalZuk`           |
| TzTok-Jad                        |           `tzTokJad`           |
| Venenatis                        |          `venenatis`           |
| Vetion                           |            `vetion`            |
| Vorkath                          |           `vorkath`            |
| Wintertodt                       |          `wintertodt`          |
| Zalcano                          |           `zalcano`            |
| Zulrah                           |            `zulrah`            |

## What you'll get

`getStats` returns a player object that looks like this:

```javascript
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
    bosses: {}
  }
}
```

`getSkillPage` returns and array of 25 players (This represents a page on the hiscores):

```javascript
[
  { rank: 1, name: 'Lynx Titan', level: 2277, xp: 4600000000, dead: false },
  {},
  {},
  // ...
];
```

## Helpful Extras

Get the properly formatted name of any skill, boss, clue or other activity:

```javascript
// kril === "K'ril Tsutsaroth"
const kril = FORMATTED_BOSS_NAMES['krilTsutsaroth'];
```
