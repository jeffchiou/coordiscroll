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
  constructor(id, bufferSize=10) {
    this.id = id
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
  broadcast = msg => this.subs.forEach(sub => sub.getNotified(this.id, msg))

  removeSub
}

class Account {
  constructor(element, xOnSync=0, yOnSync=0) {
    this.el = element
    this.xOnSync = xOnSync
    this.yOnSync = yOnSync
    this.pubChannels = new Map()
    this.subChannels = new Map()
    this.responseFunctions = new Map()
  }
  getNotified = (id, msg) => {
    console.log(this.subChannels.get(id))
    console.log(msg.y)
    window.requestAnimationFrame(() => {
      this.stopPublishing()      
      this.el.scrollLeft = msg.x
      this.el.scrollTop = msg.y  
      window.requestAnimationFrame( () => this.startPublishing() )
    })  

  }

  publish = (event) => {
    window.requestAnimationFrame((event) => {
      let pubX = this.el.scrollLeft - this.xOnSync
      let pubY = this.el.scrollTop - this.yOnSync
      let msg = {
        x: pubX,
        y: pubY,
        t: event.timeStamp
      }
      this.pubChannels.forEach( ch => ch.broadcast(msg) ) 
    })   
  }
  setPubChannel = (channel) => {
    this.pubChannels.set(channel.id, channel)
    channel.addPub(this)
  }
  setSubChannel = (channel) => {
    this.subChannels.set(channel.id, channel)
    channel.addSub(this)
  }
  
  startPublishing = () => {
    this.el.addEventListener('scroll', this.publish, {passive: true})
    this.el.addEventListener("click", this.onClick, {passive: true})
  }
  stopPublishing = () => {
    this.el.removeEventListener('scroll', this.publish, {passive: true})
  }

  onClick = (event) => {
    console.log(event)
    this.stopPublishing()
  }
}


const linkPubChannel = (pub, channel) => {
  channel.addPub(pub)
}

export {
  Account,  
  Channel
}