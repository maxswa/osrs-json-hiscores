# OSRS .json Hiscores

[![npm](https://img.shields.io/npm/v/osrs-json-hiscores.svg?style=flat-square)](https://www.npmjs.com/package/osrs-json-hiscores)
[![npm](https://img.shields.io/npm/dm/osrs-json-hiscores.svg?style=flat-square)](https://npm-stat.com/charts.html?package=osrs-json-hiscores)

**The Oldschool Runescape API wrapper that does more!**

## What it does

The official hiscores API for Oldschool Runescape (OSRS) returns CSV.
This wrapper converts it to json and provides extra information about the given player. By comparing player info it infers the player's game mode, as well as any previous modes (de-ultimated, de-ironed and/or died as a hardcore ironman).

Additional functions are provided that screen-scrape the OSRS leaderboards and return a list of players as json.

`osrs-json-hiscores` has Typescript support, with full definitions for all functions and custom data types.

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
  .getStats('Lynx Titan', 'full')
  .then(res => console.log(res))
  .catch(err => console.error(err));
```

If you are using Typescript or transpiling your JS you can use ES6 syntax:

```javascript
import hiscores, { getSkillPage } from 'osrs-json-hiscores';

// ...

const stats = await hiscores.getStats('Lynx Titan');
const topPage = await getSkillPage('overall');
```

`getStats` will return a `full` player object with game mode by default, but it will also accept any of the following game modes:

| Game mode        | Param  |
| ---------------- | :----: |
| Regular          | `main` |
| Ironman          | `iron` |
| Hardcore Ironman |  `hc`  |
| Ultimate Ironman | `ult`  |
| Deadman Mode     | `dmm`  |
| Seasonal Deadman | `sdmm` |
| DMM Tournament   | `dmmt` |

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
    lms: {}
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
