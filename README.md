# CoordiScroll
[![npm](https://img.shields.io/npm/v/coordiscroll)](https://github.com/jeffchiou/coordiscroll)
[![GitHub license](https://img.shields.io/github/license/jeffchiou/coordiscroll)](https://github.com/jeffchiou/coordiscroll/blob/master/LICENSE)
[![GitHub stars](https://img.shields.io/github/stars/jeffchiou/coordiscroll)](https://github.com/jeffchiou/coordiscroll/stargazers)
[![GitHub issues](https://img.shields.io/github/issues/jeffchiou/coordiscroll)](https://github.com/jeffchiou/coordiscroll/issues)

Currently WIP pre-alpha status: in development and not quite usable yet. Adaptable synchronized scrolling of DOM elements using the Publish-Subscribe pattern. Vanilla JS.

## Quickstart

Each element can have an account, which can publish to different channels, as well as subscribe to different channels. Each account responds channel broadcasts using a scroll transformation function specific to the channel.

Basic synchronization, where `el` is an array of elements/nodes.

```javascript
import { coordiScroll } from "coordiscroll.js"
let [accs, chs] = coordiScroll(els)
```
## Features

- Absolute position-based scrolling
- Proportional/percentage-based scrolling
- Coordinate vertical w/ vertical, horizontal w/ horizontal, or even vertical w/ horizontal scrolls.
- Scroll at different rates.
- In fact, define any sync relationship using your own transformation function.

## TODO

- Multiple elements ease-of-use changes
- De-sync and re-sync elements at different positions.
- Relative scrolling, using message streams and difference from one time to another.
- Tests, especially multiple elements.
- Get complex demo working

## Advanced Usage

TBD

## Motivation

I wanted to improve the viewing of long articles on the web. Originally, I wanted to make something for cloning and viewing a single long article in two vertical panes. The view on the right would be a little less than one page (one viewport height) down, and scrolling either one would scroll both the same amount.

I looked at scroll animation and scroll synchronization projects, and realized there weren't many implementations of synchronized scrolling that provided the control I wanted. For my desktop multicolumn reading project, I wanted to keep the exact distance scrolled synchronized, allow de-sync and re-sync, and provide options for overscroll (ex. add whitespace, tile the element, or allow one element to continue scrolling while NOT resetting the synchronized scroll position)

## Possible Applications

- More comfortably reading a single article in two columns.
- A wider view with a zoomed in view:
  - panning a map, 1 normal sized 1 zoomed in, i.e. a microscope
- Interactive function to function mapping (math education)
