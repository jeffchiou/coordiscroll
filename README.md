# CoordiScroll
[![npm](https://img.shields.io/npm/v/coordiscroll)](https://github.com/jeffchiou/coordiscroll)
[![GitHub license](https://img.shields.io/github/license/jeffchiou/coordiscroll)](https://github.com/jeffchiou/coordiscroll/blob/master/LICENSE)
[![GitHub stars](https://img.shields.io/github/stars/jeffchiou/coordiscroll)](https://github.com/jeffchiou/coordiscroll/stargazers)
[![GitHub issues](https://img.shields.io/github/issues/jeffchiou/coordiscroll)](https://github.com/jeffchiou/coordiscroll/issues)

Currently WIP status / in development; not usable yet. Adaptable synchronized scrolling of DOM elements using the Publish-Subscribe pattern. Vanilla JS.

## Usage

Basic synchronization, where `elA` and `elB` are elements/nodes.

```javascript
import { coordiScroll } from "coordiscroll.js"
let [accA, chA, accB, chB] = coordiScroll(elA, elB)
```
Add this for proportional scroll
```javascript
import { defaultFunctions } from "coordiscroll.js"
accA.setScrollFunction(chB, defaultFunctions.get("proportional"))
accB.setScrollFunction(chA, defaultFunctions.get("proportional"))
```
Same setup, but without the helper function

```javascript
import { coordiScroll, Account, Channel } from "coordiscroll.js"

let accA = new Account(el1)
let chA = new Channel()

let accB = new Account(el2)
let chB = new Channel()

accA.setPubChannel(chA)
accA.setSubChannel(chB)
accB.setSubChannel(chA)
accB.setPubChannel(chB)

accA.setScrollFunction(chB, (msg,el) => [msg.x, msg.y])
accB.setScrollFunction(chA, (msg,el) => [msg.x, msg.y])

accA.startPublishing()      
accB.startPublishing()
```

## Planned Features

- Absolute position-based scrolling
- Proportional/percentage-based scrolling
- De-sync and re-sync elements at different positions
- Scroll at different rates. Like proportional scrolling but more flexible
- Coordinate vertical w/ vertical, horizontal w/ horizontal, or even vertical w/ horizontal scrolls.
- In fact, define any sync relationship using your own transformation function.

## Motivation

I wanted to improve the viewing of long articles on the web. Originally, I wanted to make something for cloning and viewing a single long article in two vertical panes. The view on the right would be a little less than one page (one viewport height) down, and scrolling either one would scroll both the same amount.

I looked at scroll animation and scroll synchronization projects, and realized there weren't many implementations of synchronized scrolling that provided the control I wanted. For my desktop multicolumn reading project, I wanted to keep the exact distance scrolled synchronized, allow de-sync and re-sync, and provide options for overscroll (ex. add whitespace, tile the element, or allow one element to continue scrolling while NOT resetting the synchronized scroll position)

## Possible Applications

- More comfortably reading a single article in two columns.
- A wider view with a zoomed in view:
  - panning a map, 1 normal sized 1 zoomed in, i.e. a microscope
- Interactive function to function mapping (math education)
