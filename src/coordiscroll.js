// const addToMap = (map) => (obj) => {
//   map.set(obj.el, obj) 
//   console.log(map)
//   console.log('added')
// }

// const generateMapFuncs = (mapGetter, addFunc, removeFunc) => {
//   let addX = obj => mapGetter().set(obj.el, obj)
//   let addXs = objs => objs.map(addX)
//   let removeX = obj => mapGetter().delete(obj.el, obj)
//   let removeXs = objs => objs.map(removeX)
//   let linkX = (caller, obj) => {
//     addX(obj)
//     obj.addFunc(caller)
//   }
//   let linkXs = (caller, objs) => objs.forEach( obj => linkX(caller, obj)) 
//   let unlinkX = (caller, obj) => { 
//     removeX(obj)
//     obj.removeFunc(caller)
//   }
//   let unlinkXs = (caller, objs) => objs.forEach( obj => linkX(caller, obj))
// }

class Channel {
  constructor(bufferSize=10) {
    this.bufferInd = -1 // so first push starts at 0
    this.bufferSize = bufferSize
    this.xStream = new Array(this.bufferSize)
    this.yStream = new Array(this.bufferSize)
    this.tStream = new Array(this.bufferSize)
    this.subs = new Map()
    this.pubs = new Map()
    // this.addSub = this.addSub.bind(this)
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
  queueMsg = (x, y, t) => {
    this.bufferInd = (this.bufferInd + 1) % this.bufferSize
    this.xStream[this.bufferInd] = x
    this.yStream[this.bufferInd] = y
    this.tStream[this.bufferInd] = t
  }
  broadcast = msg => this.subs.forEach(sub => sub.getNotified(this, msg))
}

class Account {
  constructor(element, xOnSync=0, yOnSync=0) {
    this.el = element
    this.xOnSync = xOnSync
    this.yOnSync = yOnSync
    this.pubChannels = new Set()
    this.subChannels = new Set()
    this.scrollFunctions = new Map()

  }

  setScrollFunction = (ch, func) => this.scrollFunctions.set(ch, func)

  getNotified = (ch, msg) => {
    window.requestAnimationFrame(() => {
      this.stopPublishing()
      let [x,y] = this.scrollFunctions.get(ch)(msg, this.el)
      if (x) {this.el.scrollLeft = x}
      if (y) {this.el.scrollTop = y}
      window.requestAnimationFrame( () => this.startPublishing() )
    })  
  }

  publish = (event) => {
    window.requestAnimationFrame((event) => {
      let msg = {
        x: this.el.scrollLeft - this.xOnSync,
        y: this.el.scrollTop - this.yOnSync,
        t: event.timeStamp,
        w: this.el.scrollWidth - this.el.clientWidth,
        h: this.el.scrollHeight - this.el.clientHeight
      }
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
  
  startPublishing = () => this.el.addEventListener('scroll', this.publish, {passive: true})
  stopPublishing = () => this.el.removeEventListener('scroll', this.publish, {passive: true})
}

const defaultFunctions = new Map()
defaultFunctions.set("default", (msg,el) => [msg.x, msg.y])
defaultFunctions.set("xOnly", (msg,el) => [msg.x, null])
defaultFunctions.set("yOnly", (msg,el) => [null, msg.y])
defaultFunctions.set("proportional", (msg, el) => {
  let x = (el.scrollWidth-el.clientWidth) * msg.x / msg.w
  let y = (el.scrollHeight-el.clientHeight) * msg.y / msg.h
  return [x, y]
})

const coordiScroll = (el1, el2) => {
  let accA = new Account(el1)
  let chA = new Channel()

  let accB = new Account(el2)
  let chB = new Channel()

  accA.setPubChannel(chA)
  accA.setSubChannel(chB)
  accB.setSubChannel(chA)
  accB.setPubChannel(chB)

  accA.setScrollFunction(chB, defaultFunctions.get("default"))
  accB.setScrollFunction(chA, defaultFunctions.get("default"))

  accA.startPublishing()      
  accB.startPublishing()
  return [accA, chA, accB, chB]
}

export {
  Account,  
  Channel,
  coordiScroll,
  defaultFunctions
}