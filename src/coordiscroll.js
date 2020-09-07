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
  constructor(element, xOnSync=null, yOnSync=null) {
    this.el = element
    this.pubChannels = new Set()
    this.subChannels = new Set()
    this.scrollFunctions = new Map()
    this.state = {
      goal: {x0: null, x1: null, y0: null, y1: null},
      dxy: {x0: 0, x1: 0, y0: 0, y1: 0},
      xOnSync: xOnSync,
      yOnSync: yOnSync,
    }
    this.prevMsg = new Map()

  }

  createMsg = () => {    
    let msg = {
      x: this.el.scrollLeft,
      y: this.el.scrollTop,
      state: this.state,
      t: Date.now(),
      w: this.el.scrollWidth - this.el.clientWidth,
      h: this.el.scrollHeight - this.el.clientHeight,
    }
    return msg
  }

  setScrollFunction = (ch, func) => this.scrollFunctions.set(ch, func)

  getMessaged = (ch, msg) => {
    window.requestAnimationFrame(() => {
      this.stopPublishing()
      let [x,y] = this.scrollFunctions.get(ch)(msg, this, ch)
      if (x) this.el.scrollLeft = x
      if (y) this.el.scrollTop = y
      this.prevMsg.set(ch,msg)
      window.requestAnimationFrame( () => this.startPublishing() )
    })  
  }
  getFirstMessage = (ch, msg) => {
    this.prevMsg.set(ch,msg)
  }

  publish = () => {
    window.requestAnimationFrame(() => {
      let msg = this.createMsg()
      this.pubChannels.forEach( ch => ch.broadcast(msg) ) 
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
    let msg = this.createMsg()
    this.pubChannels.forEach( ch => ch.initialBroadcast(msg) ) 
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
    acc.state.dx = msg.x - acc.prevMsg.get(ch).x
    acc.state.dy = msg.y - acc.prevMsg.get(ch).y
    acc.state.xGoal = acc.state.xGoal ? acc.state.dx + acc.state.xGoal : acc.state.dx + acc.el.scrollLeft
    acc.state.yGoal = acc.state.yGoal ? acc.state.dy + acc.state.yGoal : acc.state.dy + acc.el.scrollLeft
    return [acc.state.xGoal, acc.state.yGoal]
  }]
])

const coordiScroll = (els) => {
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
          chs.get(elToSubTo), defaultFunctions.get("relative")
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
  coordiScroll,
  defaultFunctions
}