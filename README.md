# OSRS .json Hiscores
**The Oldschool Runescape API wrapper that does more!**
## What it does
The official hiscores API for Oldschool Runescape (OSRS) returns CSV.
This wrapper converts it to json and provides extra information about the given player. By comparing player info it infers the player's game mode, as well as any previous modes (de-ironed or died as a hardcore ironman).

An additional function is provided which screen-scrapes the OSRS leaderboards and returns the list of players as json
## Installation
With npm:
```
$ npm install osrs-json-hiscores
```
## How to use
Install the package via npm and then import it into your project:
```javascript
import hiscores from 'osrs-json-hiscores'
```
Once you import it you can call the functions asynchronously:
```javascript
hiscores.getStats('Lynx Titan', 'full')
  .then(res => console.log(res))
  .catch(err => console.error(err))
```
`getStats` will return a `full` player object with game mode by default, but it will also accept any of the following game modes:

Game mode | Param
--- | :-:
Regular | `main`
Ironman | `iron`
Hardcore Ironman | `hc`
Ultimate Ironman | `ult`
Deadman Mode | `dmm`
Seasonal Deadman | `sdmm`
DMM Tournament | `dmmt`

`getHiscores` requires a game mode and optionally a category and page:
```javascript
hiscores.getHiscores('main', 'overall', 1)
  .then(res => console.log(res))
  .catch(err => console.error(err))
```
The default values for category and page are `overall` and `1` respectively.
Categories include all OSRS skills as well as:
### Clue Scrolls

Type | Param
--- | :-:
All | `allclues`
Easy | `easyclues`
Medium | `mediumclues`
Hard | `hardclues`
Elite | `eliteclues`
Master | `masterclues`

### Minigames

Minigame | Param
--- | :-:
Bounty Hunter (Rogue) | `roguebh`
Bounty Hunter (Hunter) | `hunterbh`
Last Man Standing | `lms`

## What you'll get

`getStats` returns a player object that looks like this:

```javascript
{
  rsn: 'Lynx Titan',
  mode: 'main',
  dead: false,
  deironed: false,
  main: {
    stats: {
      overall: {rank: 1, level: 2277, xp: 5,000,000,000},
      attack: {},
      defence: {},
      ...
    },
    clues: {},
    bh: {},
    lms: {}
  },
  iron: {},
  hc: {},
  ult: {}
}
```

`getHiscores` returns and array of 25 players (This represents a page on the hiscores):

```javascript
[
  {mode: 'main', category: 'overall', rank: 1, rsn: 'Lynx Titan', level: 2277, xp: 5,000,000,000},
  {},
  {},
  ...
]
```