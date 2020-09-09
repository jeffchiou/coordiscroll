export default class Account {
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
  setScrollFunction = (ch, func) => this.scrollFunctions.set(ch, func)
  
  setSubAndFunc = (ch,func) => {
    this.setSubChannel(ch)
    this.setScrollFunction(ch,func)
  }

  startPublishing = () => {
    this.el.addEventListener('scroll', this.publish, {passive: true})
  }
  stopPublishing = () => this.el.removeEventListener('scroll', this.publish, {passive: true})

  initialPublish = () => {
    this.state = this.updateState(this.state, this.el)
    this.pubChannels.forEach( ch => ch.initialBroadcast({...this.state}) ) 
  }
}