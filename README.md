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

| Game mode        |   Param   |
| ---------------- | :-------: |
| Regular          |  `main`   |
| Ironman          |  `iron`   |
| Hardcore Ironman |   `hc`    |
| Ultimate Ironman |   `ult`   |
| Deadman Mode     |   `dmm`   |
| DMM Tournament   |  `dmmt`   |
| Leagues          | `leagues` |

`getSkillPage` and `getActivityPage` require a skill/activity and optionally a gamemode and page:

```javascript
hiscores
  .getSkillPage('attack', 'main', 1)
  .then(res => console.log(res))
  .catch(err => console.error(err));
```

Activities consist of all levels of clue scrolls as well as minigames:

### Clue Scrolls

| Type     |      Param      |
| -------- | :-------------: |
| All      |   `allclues`    |
| Beginner | `beginnerclues` |
| Easy     |   `easyclues`   |
| Medium   |  `mediumclues`  |
| Hard     |   `hardclues`   |
| Elite    |  `eliteclues`   |
| Master   |  `masterclues`  |

### Minigames

| Minigame               |   Param    |
| ---------------------- | :--------: |
| Bounty Hunter (Rogue)  | `roguebh`  |
| Bounty Hunter (Hunter) | `hunterbh` |
| Last Man Standing      |   `lms`    |

### Leagues

| Name          | Param |
| ------------- | :---: |
| League Points | `lp`  |

### Bosses

| Boss Name                        |             Param              |
| -------------------------------- | :----------------------------: |
| Abyssal Sire                     |         `abyssalsire`          |
| Alchemical Hydra                 |       `alchemicalhydra`        |
| Barrows Chests                   |        `barrowschests`         |
| Bryophyta                        |          `bryophyta`           |
| Callisto                         |           `callisto`           |
| Cerberus                         |           `cerberus`           |
| Chambers Of Xeric                |       `chambersofxeric`        |
| Chambers Of Xeric Challenge Mode | `chambersofxericchallengemode` |
| Chaos Elemental                  |        `chaoselemental`        |
| Chaos Fanatic                    |         `chaosfanatic`         |
| Commander Zilyana                |       `commanderzilyana`       |
| Corporeal Beast                  |        `corporealbeast`        |
| Crazy Archaeologist              |      `crazyarchaeologist`      |
| Dagannoth Prime                  |        `dagannothprime`        |
| Dagannoth Rex                    |         `dagannothrex`         |
| Dagannoth Supreme                |       `dagannothsupreme`       |
| Deranged Archaeologist           |    `derangedarchaeologist`     |
| General Graardor                 |       `generalgraardor`        |
| Giant Mole                       |          `giantmole`           |
| Grotesque Guardians              |      `grotesqueguardians`      |
| Hespori                          |           `hespori`            |
| Kalphite Queen                   |        `kalphitequeen`         |
| King Black Dragon                |       `kingblackdragon`        |
| Kraken                           |            `kraken`            |
| Kreearra                         |           `kreearra`           |
| K'ril Tsutsaroth                 |        `kriltsutsaroth`        |
| Mimic                            |            `mimic`             |
| Obor                             |             `obor`             |
| Sarachnis                        |          `sarachnis`           |
| Scorpia                          |           `scorpia`            |
| Skotizo                          |           `skotizo`            |
| Gauntlet                         |           `gauntlet`           |
| Corrupted Gauntlet               |      `corruptedgauntlet`       |
| Theatre Of Blood                 |        `theatreofblood`        |
| Thermonuclear Smoke Devil        |   `thermonuclearsmokedevil`    |
| TzKal-Zuk                        |           `tzkalzuk`           |
| TzTok-Jad                        |           `tztokjad`           |
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
  rsn: 'Lynx Titan',
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
    bh: {},
    lms: {},
    bosses: {}
  }
}
```

`getSkillPage` returns and array of 25 players (This represents a page on the hiscores):

```javascript
[
  { rank: 1, rsn: 'Lynx Titan', level: 2277, xp: 4600000000, dead: false },
  {},
  {},
  // ...
];
```
