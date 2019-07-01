export class Timer {
  constructor(name, children, tofs, parent) {
    this.name = name
    this.parent = parent
    this.children = children
    this.timeOfFinishedSessions = tofs
    this.currentSessionStart = null
    this.timeString = ''
    this.id = (parent != undefined) ? `${parent.id}\x1f${this.name}` : this.name
    this.time = this.getTime()
    this.updateTimeString()

  }

  calculateIDs(parent) {
    this.id = (parent != undefined) ? `${parent.id}\x1f${this.name}` : this.name
    this.parent = parent
    for(const child of this.children) {
      child.calculateIDs(this)
    }
  } 

  changeTime(secs) {
    this.timeOfFinishedSessions = Math.max(0, this.timeOfFinishedSessions + secs * 1000)
  }

  updateTimeString() {
    this.timeString = this.getTimeString()

    for(const child of this.children) {
      child.updateTimeString()
    }
  }

  toggle() {
    if (this.currentSessionStart == null) {
      this.currentSessionStart = Date.now()
    }
    else {
      this.timeOfFinishedSessions += Date.now() - this.currentSessionStart
      this.currentSessionStart = null
    }
  }

  isTimer() {
    return this.children.length == 0;
  }

  isActive() {
    if (this.isTimer()) return this.currentSessionStart != null
    return this.children.some(v => v.isActive())
  }

  getTime() {
    let time = 0;
    if (!this.isTimer()) {
      this.timeOfFinishedSessions = 0
      for (const child of this.children) {
        this.timeOfFinishedSessions += child.getTime()

      }
    }
    if (this.currentSessionStart == null) time = this.timeOfFinishedSessions
    else time = this.timeOfFinishedSessions + Date.now() - this.currentSessionStart

    this.time = time
    return time
  }

  getTimeString() {
    const time = this.time
    if (time == undefined) return ''

    const days = Math.floor(time / 86400000 )
    const hours = Math.floor((time - days * 86400000 ) / 3600000 )
    const minutes = Math.floor((time - days * 86400000 - hours * 3600000) / 60000 )
    const secs = Math.floor((time - days * 86400000 - hours * 3600000 - minutes * 60000) / 1000 )


    let res = ''
    if(days > 0) res += `${days} Tage `
    if (days > 0 || hours > 0) res += hours.toString().padStart(2, '0') + ':'
    res += minutes.toString().padStart(2, '0') + ':'
    res += secs.toString().padStart(2, '0')

    return res
  }
}