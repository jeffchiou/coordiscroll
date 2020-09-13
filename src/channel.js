export default class Channel {
  constructor() {
    this.subs = new Map()
    this.pubs = new Map()
  }  
  getSubs() { return this.subs }
  addSub(sub) { this.subs.set(sub.el, sub) }
  addSubs(subs) { subs.map(this.addSub) }
  removeSub(sub) { this.subs.delete(sub.el) }
  removeSubs(subs) { subs.map(this.removeSub) }
  getPubs() { return this.pubs }
  addPub(pub) { this.pubs.set(pub.el, pub) }
  addPubs(pubs) { pubs.map(this.addPub) }
  removePub(pub) { this.pubs.delete(pub.el) }
  removePubs(pubs) { pubs.map(this.removePub) }
  broadcast(msg) { this.subs.forEach(sub => sub.getMessaged(this, msg)) }
  initialBroadcast(msg) { this.subs.forEach(sub => sub.getFirstMessage(this, msg)) }
}
