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
    // Dynamic elements need to be set with functions. In this case IIFEs
    this.prevMsg = {}
    this.state = {
      x: (el=>el.scrollLeft)(el),
      y: (el=>el.scrollTop)(el),
      x0: xOnSync,
      y0: yOnSync,
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
      let [x,y] = this.scrollFunctions.get(ch)(msg, this, ch)
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

const defaultFunctions = new Map([
  ["absolute", (msg, acc, ch) => [msg.x, msg.y]],
  ["absXOnly", (msg, acc, ch) => [msg.x, null]],
  ["absYOnly", (msg, acc, ch) => [null, msg.y]],
  ["proportional", (msg, acc, ch) => {  
    let x = (acc.el.scrollWidth - acc.el.clientWidth) * msg.x / msg.w
    let y = (acc.el.scrollHeight - acc.el.clientHeight) * msg.y / msg.h
    return [x, y]
  }],
  ["relative", (msg, acc, ch) => {
    let dx = msg.x - msg.x0
    let dy = msg.y - msg.y0
    // alternate between NaN and next goal, resulting in loss of sync position
    acc.state.xGoal = acc.state.xGoal ? NaN + acc.state.xGoal : dx + acc.el.scrollLeft
    acc.state.yGoal = acc.state.yGoal ? NaN + acc.state.yGoal : dy + acc.el.scrollTop
    return [acc.state.xGoal, acc.state.yGoal]
  }],
  ["relSpringy", (msg, acc, ch) => {
    let dx = msg.x - msg.x0
    let dy = msg.y - msg.y0

    acc.state.xGoal = acc.state.xGoal ? dx + acc.state.xGoal : dx + acc.el.scrollLeft
    acc.state.yGoal = acc.state.yGoal ? dy + acc.state.yGoal : dy + acc.el.scrollTop
    return [acc.state.xGoal, acc.state.yGoal]
  }]
])

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
          chs.get(elToSubTo), defaultFunctions.get(scrollFunc)
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
  defaultFunctions
}