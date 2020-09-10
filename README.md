# ![CoordiScroll Icon](demos/img/coordiscroll-icon_32.png) CoordiScroll

[![npm](https://img.shields.io/npm/v/coordiscroll)](https://www.npmjs.com/package/coordiscroll)
[![GitHub license](https://img.shields.io/github/license/jeffchiou/coordiscroll)](https://github.com/jeffchiou/coordiscroll/blob/master/LICENSE)
[![GitHub stars](https://img.shields.io/github/stars/jeffchiou/coordiscroll)](https://github.com/jeffchiou/coordiscroll/stargazers)
[![GitHub issues](https://img.shields.io/github/issues/jeffchiou/coordiscroll)](https://github.com/jeffchiou/coordiscroll/issues)

Currently WIP alpha status: in development and semi-functional. Adaptable synchronized scrolling of DOM elements using the Publish-Subscribe pattern. Vanilla JS.

## Overview

View some demos here: [jeffchiou.github.io/coordiscroll/](https://jeffchiou.github.io/coordiscroll/)

Who is this for?

- You need relative scrolling, i.e. synchronized by the difference in position rather than absolute position
- You need complex sync relationships between scrolled elements.
- You need the ability to de-sync and re-sync elements at different positions.

If you only need basic synchronized scrolling, other libraries may be more performant.

## Quickstart

Each element can have an account, which can publish to different channels, as well as subscribe to different channels. Each account responds to channel broadcasts using a scroll transformation function specific to the channel.

### Basic Synchronization

```javascript
import { Coord } from "coordiscroll.js"
let [accs, chs] = Coord.fullyConnect(".my_element_class")
```

Included scroll functions are defined in `scrollfuncs.js`.  Here are a few:

`proportional` (default): elements are synced by the proportion/percentage scrolled

`absolute`: elements are synced by their absolute positions

`absYOnly`: sync only y position

`relSpring`: elements are synced by relative offset starting positions.

`relLoop`: elements are synced by the relative difference, but loop back to the top.

```javascript
let [accs, chs] = Coord.fullyConnect(".grid_els", "relLoop")
```

## Features

- Define any sync relationship using your own transformation function. Ex:
  - Absolute position-based scroll sync.
  - Proportional/percentage-based scroll sync.
  - Coordinate vertical w/ vertical, horizontal w/ horizontal, vertical w/ horizontal scrolls.
  - Scroll at different rates.
  - Relative scrolling, using difference from one time to another.
- Quick easy way to coordinate multiple elements.
- PubSub enables flexible relationships.
  - Example: document reading w/ annotations ( D1 <-> D2 -> A )
    - You have two offset-synced document columns and one annotation column.
    - You only want the annotation column to follow one of the panes.
    - In addition, you want the user to be able to scroll annotations without scrolling the two document columns, yet re-sync when a document column is scrolled.
    - This is all possible with CoordiScroll!

## TODO

- Improve and simplify API
  - De-sync and re-sync elements at different positions
- Tests
  - React and other framework integration
  - Performance with multiple elements
  - Multiple element add remove
- Demos
  - Polish demos
- Minification

## Advanced Usage

Several scroll functions are defined already, but if you need to roll your own, the functions take in as arguments the latest message and the account receiving the message. See `account.js` for what state variables are passed - includes x, y, w, h, and more.

Coord.fullyConnect returns 1 channel per element using the elements as keys, but it doesn't have to be that way. You can have several channels per element, or one channel for several elements. 

### Custom Sync Function

Synchronized with a sine wave, from the [demo page](https://jeffchiou.github.io/coordiscroll/).

```javascript
let nline = document.querySelector("#demo-nline__nline")
let [sinAcc, sinCh] = Coord.setupElement('#sinLine')
sinAcc.setSubAndFunc(nlineCh, (msg, acc) => {
    // with the scaling on the page, one unit is 40px
	let x = acc.state.w * msg.x / msg.w
    let y = 80 * Math.sin(x / 40) + 350
    return [x, y]
})
```



## Motivation

I wanted to improve the viewing of long articles on the web. Originally, I wanted to make something for cloning and viewing a single long article in two vertical panes. The view on the right would be a little less than one page (one viewport height) down, and scrolling either one would scroll both the same amount.

I looked at scroll animation and scroll synchronization projects, and realized there weren't many implementations of synchronized scrolling that provided the control I wanted. For my desktop multicolumn reading project, I wanted to keep the exact distance scrolled synchronized, allow de-sync and re-sync, and provide options for overscroll (ex. add whitespace, tile the element, or allow one element to continue scrolling while NOT resetting the synchronized scroll position).

## Possible Applications

- More comfortably reading a single article in two columns.
- A wider view with a zoomed in view:
  - panning a map, 1 normal sized 1 zoomed in, i.e. a microscope.
- Interactive function to function mapping (math education).

## Acknowledgements

[react-scroll-sync](https://www.npmjs.com/package/react-scroll-sync) for the "remove and re-add event listener" method. It was a lot more performant than I expected. 

Earlier, I was using a slow complicated method involving finding "leaders" and setting scroll goals that was difficult to expand to the publish-subscribe pattern. I still use aspects of this in the relative scrolling code, however.