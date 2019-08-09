// let localStorage = {
//   storage: {
//     options: {
//       showCommunityDay: false,
//       communityDay: "Wednesday",
//       showWeekends: false,
//       startWithCommunityDay: true
//     }
//   },
//   getItem(name) {
//     return this.storage[name]
//   },
//   setItem(name, value) {
//     this.storage[name] = value
//   }
// }
export default class DayHandler {
  constructor() {
    this.week = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
  }

  addDays(days) {
    this.days = days
    this.shownDays = this.createShownDays()
    this.updatedShownDays = this.createShownDays()
  }
  addSetCallback(callback) {
    this.set = callback
  }
  onOptionsUpdate() {
    let options = JSON.parse(localStorage.getItem("options")) || { showWeekends: true, showCommunityDay: true, communityDay: "Monday", startWithCommunityDay: false }
    this.shownDays = this.createShownDays()
    if (!options.showWeekends) {
      this.hide("Sunday")
      this.hide("Saturday")
    }
    if (!options.showCommunityDay && options.communityDay) {
      this.hide(options.communityDay)
    }
    if (options.startWithCommunityDay && options.communityDay) {
      let order = this.createDayOrder(options.communityDay)
      this.applyDayOrder(order)
    }
    this.setShowMobileDay()
  }

  createShownDays() {
    let shownDays = []
    for (let x = 0; x < 7; x++) {
      shownDays.push({ day: this.getDayFromNameFromWeek(this.week[x]), show: true, showMobile: false })
    }
    return shownDays
  }
  getDayFromNameFromWeek(name) {
    let dayOfWeek = `Can't find ${name} in ${JSON.stringify(this.days)}`
    this.days.forEach(day => {
      if (day.dayName === name) {
        dayOfWeek = day
      }
    })
    return dayOfWeek
  }
  createDayOrder(start) {
    let order = []
    let i = this.week.indexOf(start)
    for (let x = 0; x < 7; x++) {
      order.push(this.week[i])
      i++
      if (i > 6) {
        i = 0
      }
    }
    return order
  }
  getDayFromName(dayName) {
    let day = undefined
    this.shownDays.forEach((shownDay) => {
      if (shownDay.day.dayName === dayName) {
        day = shownDay
      }
    })
    return day
  }
  applyDayOrder(order) {
    let newShownDays = JSON.parse(JSON.stringify(this.shownDays))
    this.shownDays.forEach((shownDay, i) => {
      newShownDays[i] = this.getDayFromName(order[i])
    })
    this.shownDays = newShownDays
  }
  show(day) {
    this.getDayFromName(day).show = true
  }
  hide(day) {
    this.getDayFromName(day).show = false
  }
  setShowMobileDay() {
    if (localStorage.getItem("mobileDay")) {
      this.getDayFromName(localStorage.getItem("mobileDay")).showMobile = true
      return
    }
    let x = 0
    this.shownDays.forEach((shownDay, i) => {
      if (shownDay.show && x === 0) {
        x = 1
        this.shownDays[i].showMobile = true
      }
    })
  }
  getNextShownDayUp(dayName) {
    let x = 0
    while (x === 0) {
      dayName = this.getNextDay(dayName)
      if (this.getDayFromName(dayName).show) {
        x = 1
        return dayName
      }
    }
  }
  getNextShownDayDown(dayName) {
    let x = 0
    while (x === 0) {
      dayName = this.getPreviousDay(dayName)
      if (this.getDayFromName(dayName).show) {
        x = 1
        return dayName
      }
    }
  }
  getNextDay(dayName) {
    let index = this.shownDays.indexOf(this.getDayFromName(dayName))
    if (index >= 6) {
      index = -1
    }
    return this.shownDays[index + 1].day.dayName
  }

  getPreviousDay(dayName) {
    let index = this.shownDays.indexOf(this.getDayFromName(dayName))
    if (index <= 0) {
      index = 7
    }
    return this.shownDays[index - 1].day.dayName
  }

  moveMobileShowDayUp() {
    let day = this.shownDays.filter(v => { return v.showMobile })[0]
    day.showMobile = false
    let nextDayName = this.getNextShownDayUp(day.dayName)
    let nextDay = this.getDayFromName(nextDayName)
    nextDay.showMobile = true
  }

  moveMobileShowDayDown() {
    let day = this.shownDays.filter(v => { return v.showMobile })[0]
    day.showMobile = false
    let previousDayName = this.getNextShownDayDown(day.dayName)
    let previousDay = this.getDayFromName(previousDayName)
    localStorage.setItem("mobileDay", previousDay.day.dayName)
    previousDay.showMobile = true
  }
}