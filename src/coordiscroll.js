//TODO: subAllToChannel(els), syncTwoEls(el1,el2), use msgBuffers instead of msgs

class Channel {
  constructor() {
    this.subs = new Map()
    this.pubs = new Map()
  }
  
  getSubs = () => this.subs
  addSub = sub => this.subs.set(sub.el, sub)
  addSubs = subs => subs.map(this.addSub)
  removeSub = sub => this.subs.delete(sub.el)
  removeSubs = subs => subs.map(this.removeSub)
  linkSub = sub => {
    this.addSub(sub)
    sub.addChannel(this)
  }
  unlinkSub = sub => {
    this.removeSub(sub)
    sub.removeChannel(this)
  }

  getPubs = () => this.pubs
  addPub = pub => this.pubs.set(pub.el, pub)
  addPubs = pubs => pubs.map(this.addPub)
  removePub = pub => this.pubs.delete(pub.el)
  removePubs = pubs => pubs.map(this.removePub)

  unsubscribe = (sub) => {
  }

  broadcast = msg => {
    this.subs.forEach(sub => sub.getMessaged(this, msg))
  }
  initialBroadcast = msg => {
    this.subs.forEach(sub => sub.getFirstMessage(this, msg))
  }
}
class Account {
  constructor(el, xOnSync=0, yOnSync=0) {
    this.el = el
    this.pubChannels = new Set()
    this.subChannels = new Set()
    this.scrollFunctions = new Map()
    this.prevMsg = {}
    // Dynamic constructor elements need to be set with functions. In this case IIFEs
    let foundX = (el=>el.scrollLeft)(el)
    let foundY = (el=>el.scrollTop)(el)
    this.state = {
      x: foundX,
      y: foundY,
      x0: foundX,
      y0: foundY,
      xOnSync: foundX,
      yOnSync: foundY,
      xGoal: null,
      yGoal: null,
      w: (el=>el.scrollWidth-el.clientWidth)(el),
      h: (el=>el.scrollHeight-el.clientHeight)(el),
    }
  }

  // "Purer" functions
  updateState = (state, el) => {
    let newState = {
      x: el.scrollLeft,
      y: el.scrollTop,
      x0: state.x,
      y0: state.y,
      xOnSync: state.xOnSync,
      yOnSync: state.yOnSync,
      xGoal: state.xGoal ? ( state.xGoal == el.scrollLeft ? null : state.xGoal ) : null,
      yGoal: state.yGoal ? ( state.yGoal == el.scrollTop ? null : state.yGoal ) : null,
      w: el.scrollWidth-el.clientWidth,
      h: el.scrollHeight-el.clientHeight,
    } 
    return newState
  }

  // Impure
  setScrollFunction = (ch, func) => this.scrollFunctions.set(ch, func)

  getMessaged = (ch, msg) => {
    window.requestAnimationFrame(() => {
      this.stopPublishing()
      let [x,y] = this.scrollFunctions.get(ch)(msg, this)
      if (x) this.el.scrollLeft = x
      if (y) this.el.scrollTop = y
      this.prevMsg.msg = msg
      this.prevMsg.ch = ch      
      window.requestAnimationFrame( () => {
        this.state = this.updateState(this.state, this.el)
        this.startPublishing()
      })
    })  
  }
  getFirstMessage = (ch, msg) => {
    this.prevMsg.msg = msg
    this.prevMsg.ch = ch
  }
  publish = () => {
    window.requestAnimationFrame(() => {
      let msg = { ...this.state }
      this.pubChannels.forEach( ch => ch.broadcast(msg) ) 
      window.requestAnimationFrame( () => this.state = this.updateState(this.state, this.el))
    })   
  }
  setPubChannel = (channel) => {
    this.pubChannels.add(channel)
    channel.addPub(this)
  }
  setSubChannel = (channel) => {
    this.subChannels.add(channel)
    channel.addSub(this)
  }
  setPubChannels = chs => chs.map(this.setPubChannel)
  setSubChannels = chs => chs.map(this.setSubChannel)
  
  startPublishing = () => {
    this.el.addEventListener('scroll', this.publish, {passive: true})
  }
  stopPublishing = () => this.el.removeEventListener('scroll', this.publish, {passive: true})

  initialPublish = () => {
    this.state = this.updateState(this.state, this.el)
    this.pubChannels.forEach( ch => ch.initialBroadcast({...this.state}) ) 
  }
}

const ScrollFuncs = {}
ScrollFuncs.absolute = (msg, acc) => [msg.x, msg.y]
ScrollFuncs.absXOnly = (msg, acc) => [msg.x, null]
ScrollFuncs.absYOnly = (msg, acc) => [null, msg.y]
ScrollFuncs.proportional = (msg, acc) => {  
  let x = acc.state.w * msg.x / msg.w
  let y = acc.state.h * msg.y / msg.h
  return [x, y]
}
ScrollFuncs.relSoft = (msg, acc) => {
  let dx = msg.x - msg.x0
  let dy = msg.y - msg.y0

  if (acc.state.xGoal > acc.state.h || acc.state.xGoal < 0) acc.state.xGoal = null
  if (acc.state.yGoal > acc.state.h || acc.state.yGoal < 0) acc.state.yGoal = null    
  // alternative implementation is to alternate between NaN and next goal, 
  // resulting in intended loss of sync position
  acc.state.xGoal = acc.state.xGoal ? dx + acc.state.xGoal : dx + acc.el.scrollLeft
  acc.state.yGoal = acc.state.yGoal ? dy + acc.state.yGoal : dy + acc.el.scrollTop
  return [acc.state.xGoal, acc.state.yGoal]
}
ScrollFuncs.relLoop =  (msg, acc) => {
  let dx = msg.x - msg.x0
  let dy = msg.y - msg.y0

  acc.state.xGoal = acc.state.xGoal ? dx + acc.state.xGoal : dx + acc.el.scrollLeft
  acc.state.yGoal = acc.state.yGoal ? dy + acc.state.yGoal : dy + acc.el.scrollTop

  if (acc.state.yGoal > acc.state.h) {
    acc.state.yGoal = acc.state.yGoal - acc.state.h + dy
  } else if (acc.state.yGoal < 0) {
    acc.state.yGoal = acc.state.yGoal + acc.state.h + dy
  }
  return [acc.state.xGoal, acc.state.yGoal]
}


const Coord = {}
Coord.fullyConnect = (els, scrollFunc="proportional") => {
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