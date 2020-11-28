import { ScrollFuncs } from './scrollfuncs.js'
import { Account, WinAccount } from './account.js'
import Channel from './channel.js'
//TODO: subAllToChannel(els), syncTwoEls(el1,el2), use msgBuffers instead of msgs

const singleValiversion = new Map()
  .set( x=>x instanceof Array && x.length==1, x=> x[0])
  .set( x=>x instanceof Node,     x=>x )
  .set( x=>typeof x=='string',    x=>document.querySelector(x) )

const multipleValiversion = new Map()
  .set( x=>x instanceof Array,    x=>x )
  .set( x=>x instanceof Node,     x=>[x] )
  .set( x=>x instanceof NodeList, x=>Array.from(x) )
  .set( x=>typeof x=='string',    x=>Array.from(document.querySelectorAll(x)) )

const valivertElementsOrQuery = valiversions => elementsOrQuery => {
  for (let [checkFunc, convertFunc] of valiversions) {
    if (checkFunc(elementsOrQuery)) return convertFunc(elementsOrQuery)
  } 
  throw "Incorrect input type for selecting an element or elements."
}
/** Validates and converts an element. Valivert = validate and convert. */
const valivertSingle = valivertElementsOrQuery(singleValiversion)
/**
 * Returns an array of elements.
 * Converts NodeList to Array so changes to the list itself won't affect the DOM 
 **/
const valivertMultiple = valivertElementsOrQuery(multipleValiversion)

const Coord = {}
/** Convenience setup function for publishing to one channel */
Coord.setupElement = (elOrQuery) => {
  let el = valivertSingle(elOrQuery)
  let acc = new Account(el)
  let ch = new Channel()
  acc.setPubChannel(ch)
  acc.initialPublish()
  acc.startPublishing()
  return [acc, ch]
}
Coord.fullyConnect = (elsOrQuery, scrollFunc="proportional") => {
  if (typeof scrollFunc == 'string') scrollFunc = ScrollFuncs[scrollFunc]
  let els = valivertMultiple(elsOrQuery)
  let accs = []
  let chs = []
  els.forEach((el,i) => {
    accs.push(new Account(el))
    chs.push(new Channel())
    accs[i].setPubChannel(chs[i])
  })

  els.forEach((mainEl,i) => {
    els.forEach((elToSubTo,j) => {
      if (!mainEl.isSameNode(elToSubTo)) {
        accs[i].setSubChannel(chs[j])
        accs[i].setScrollFunction(chs[j], scrollFunc)
      }
    })
  })

  accs.forEach(acc => acc.initialPublish())
  accs.forEach(acc => acc.startPublishing())
  return [accs, chs]
}
Coord.fullyUnsubscribe = function(accs, chs) {
  accs.forEach(acc => {
    chs.forEach(ch => { if (acc.isSubbedTo(ch)) acc.unsetSubChannel(ch) })
  })  
}
Coord.fullyReconnect = function(accs, chs, scrollFunc="proportional") {
  if (typeof scrollFunc == 'string') scrollFunc = ScrollFuncs[scrollFunc]
  accs.forEach((acc,i) => {
    chs.forEach((ch,j) => {
      if (!acc.isSubbedTo(ch)) {
        acc.setSubChannel(ch)
        acc.setScrollFunction(ch, scrollFunc)
      }
    })
  })
}
Coord.winFullyConnect = (elsOrQuery, scrollFunc="relSpring") => {
  if (typeof scrollFunc == 'string') scrollFunc = ScrollFuncs[scrollFunc]
  let els = valivertMultiple(elsOrQuery)
  let accs = []
  let chs = []
  els.forEach((el,i) => {
    accs.push(new WinAccount(el))
    chs.push(new Channel())
    accs[i].setPubChannel(chs[i])
  })
  els.forEach((mainEl,i) => {
    els.forEach((elToSubTo,j) => {
      if (i!=j) {
        accs[i].setSubChannel(chs[j])
        accs[i].setScrollFunction(chs[j], scrollFunc)
      }
    })
  })
  accs.forEach(acc => acc.initialPublish())
  accs.forEach(acc => acc.startPublishing())
  return [accs, chs]
}

export {
  Account,
  WinAccount,
  Channel,
  Coord,
  ScrollFuncs
}
