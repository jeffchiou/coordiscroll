import ScrollFuncs from './scrollfuncs.js'
import Account from './account.js'
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
/** Validates and converts an element */
const valivertSingle = valivertElementsOrQuery(singleValiversion)
/**
 * Returns an array of elements. Valivert = validate and convert. 
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
  let els = valivertMultiple(elsOrQuery)
  let accs = new Map()
  let chs = new Map() 
  els.forEach(el => {
    accs.set(el, new Account(el))
    chs.set(el, new Channel())
    accs.get(el).setPubChannel(chs.get(el))
  })

  els.forEach(mainEl => {
    els.forEach(elToSubTo => {
      if (!mainEl.isSameNode(elToSubTo)) {
        accs.get(mainEl).setSubChannel(chs.get(elToSubTo))
        accs.get(mainEl).setScrollFunction(
          chs.get(elToSubTo), ScrollFuncs[scrollFunc]
        )
      }
    })
  })

  accs.forEach(acc => acc.initialPublish())
  accs.forEach(acc => acc.startPublishing())
  return [accs, chs]
}


export {
  Account,  
  Channel,
  Coord,
  ScrollFuncs
}