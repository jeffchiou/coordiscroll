export class Account {
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
    this.publish = this.publish.bind(this)
  }
  updateState(state, el) {
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
  getMessaged(ch, msg) {
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
  getFirstMessage(ch, msg) {
    this.prevMsg.msg = msg
    this.prevMsg.ch = ch
  }
  publish() {
    window.requestAnimationFrame(() => {
      let msg = { ...this.state }
      this.pubChannels.forEach( ch => ch.broadcast(msg) ) 
      window.requestAnimationFrame( () => this.state = this.updateState(this.state, this.el))
    })   
  }
  setPubChannel(channel) {
    this.pubChannels.add(channel)
    channel.addPub(this)
  }
  setSubChannel(channel) {
    this.subChannels.add(channel)
    channel.addSub(this)
  }
  setPubChannels(chs) { chs.map(this.setPubChannel) }
  setSubChannels(chs) { chs.map(this.setSubChannel) }
  setScrollFunction(ch, func) { this.scrollFunctions.set(ch, func) }  
  setSubAndFunc(ch,func) {
    this.setSubChannel(ch)
    this.setScrollFunction(ch,func)
  }
  unsetSubChannel(channel) {
    channel.removeSub(this)
    this.subChannels.delete(channel)
  }
  unsetPubChannel(channel) {
    channel.removePub(this)
    this.pubChannels.delete(channel)
  }
  unsetSubChannels(chs) { chs.map(this.unsetSubChannel) }
  unsetPubChannels(chs) { chs.map(this.unsetPubChannel) }
  isSubbedTo(channel) { return this.subChannels.has(channel) }
  startPublishing() { this.el.addEventListener('scroll', this.publish, {passive: true}) }
  stopPublishing() { this.el.removeEventListener('scroll', this.publish, {passive: true}) }
  initialPublish() {
    this.state = this.updateState(this.state, this.el)
    this.pubChannels.forEach( ch => ch.initialBroadcast({...this.state}) ) 
  }
}

export class WinAccount {
  constructor(el, xOnSync=0, yOnSync=0) {
    this.el = el
    this.pubChannels = new Set()
    this.subChannels = new Set()
    this.scrollFunctions = new Map()
    this.prevMsg = {}
    // Dynamic constructor elements need to be set with functions. In this case IIFEs
    let foundX = (el=>el.scrollX)(el)
    let foundY = (el=>el.scrollY)(el)
    this.state = {
      x: foundX,
      y: foundY,
      x0: foundX,
      y0: foundY,
      xOnSync: foundX,
      yOnSync: foundY,
      xGoal: null,
      yGoal: null,
      w: (el=>el.document.documentElement.scrollWidth - el.innerWidth)(el),
      h: (el=>el.document.documentElement.scrollHeight - el.innerHeight)(el),
    }
    this.publish = this.publish.bind(this)
  }
  updateState(state, el) {
    let newState = {
      x: el.scrollX,
      y: el.scrollY,
      x0: state.x,
      y0: state.y,
      xOnSync: state.xOnSync,
      yOnSync: state.yOnSync,
      xGoal: state.xGoal ? ( state.xGoal == el.scrollX ? null : state.xGoal ) : null,
      yGoal: state.yGoal ? ( state.yGoal == el.scrollY ? null : state.yGoal ) : null,
      w: el.document.documentElement.scrollWidth - el.innerWidth,
      h: el.document.documentElement.scrollHeight - el.innerHeight,
    } 
    
    return newState
  }
  updateSyncPos() {
    this.state = {
      x: this.el.scrollX,
      y: this.el.scrollY,
      x0: this.state.x,
      y0: this.state.y,
      xOnSync: this.el.scrollX,
      yOnSync: this.el.scrollY,
      xGoal: this.state.xGoal ? ( this.state.xGoal == this.el.scrollX ? null : this.state.xGoal ) : null,
      yGoal: this.state.yGoal ? ( this.state.yGoal == this.el.scrollY ? null : this.state.yGoal ) : null,
      w: this.el.document.documentElement.scrollWidth - this.el.innerWidth,
      h: this.el.document.documentElement.scrollHeight - this.el.innerHeight,
    } 
  }
  getMessaged(ch, msg) {
    window.requestAnimationFrame(() => {
      this.stopPublishing()
      let [x,y] = this.scrollFunctions.get(ch)(msg, this)
      this.el.scrollTo(x,y) 
      this.prevMsg.msg = msg
      this.prevMsg.ch = ch 
      window.requestAnimationFrame( () => {
        this.state = this.updateState(this.state, this.el)
        this.startPublishing()
      })
    })  
  }

  getFirstMessage(ch, msg) {
    this.prevMsg.msg = msg
    this.prevMsg.ch = ch
  }
  publish() {
    window.requestAnimationFrame(() => {
      let msg = { ...this.state }
      this.pubChannels.forEach( ch => ch.broadcast(msg) ) 
      window.requestAnimationFrame( () => this.state = this.updateState(this.state, this.el))
    })   
  }
  setPubChannel(channel) {
    this.pubChannels.add(channel)
    channel.addPub(this)
  }
  setSubChannel(channel) {
    this.subChannels.add(channel)
    channel.addSub(this)
  }
  setPubChannels(chs) { chs.map(this.setPubChannel) }
  setSubChannels(chs) { chs.map(this.setSubChannel) }
  setScrollFunction(ch, func) { this.scrollFunctions.set(ch, func) }  
  setSubAndFunc(ch,func) {
    this.setSubChannel(ch)
    this.setScrollFunction(ch,func)
  }
  unsetSubChannel(channel) {
    channel.removeSub(this)
    this.subChannels.delete(channel)
  }
  unsetPubChannel(channel) {
    channel.removePub(this)
    this.pubChannels.delete(channel)
  }
  unsetSubChannels(chs) { chs.map(this.unsetSubChannel) }
  unsetPubChannels(chs) { chs.map(this.unsetPubChannel) }
  isSubbedTo(channel) { return this.subChannels.has(channel) }
  startPublishing() { this.el.addEventListener('scroll', this.publish, {passive: true})}
  stopPublishing() { this.el.removeEventListener('scroll', this.publish, {passive: true}) }
  initialPublish() {
    this.state = this.updateState(this.state, this.el)
    this.pubChannels.forEach( ch => ch.initialBroadcast({...this.state}) ) 
  }
}