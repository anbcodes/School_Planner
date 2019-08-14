import Dexie from 'dexie'
export default class DataBase {
  constructor() {
    this.db = this.initDb()
    this.dayOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
  }

  initDb() {
    let db = new Dexie("plannerV2")
    db.version(1).stores({
      days: "id++, week",
      items: "id++, day"
    })
    return db
  }

  async getDays(week) {
    let days = await this.db.days.where({ week: week }).toArray()
    let toPut = []
    if (days.length === 0) {
      console.log("DAYS.length === 0 generating more days", days, week)
      this.db.days.bulkDelete(days.map((v) => v.id))
      for (let x = 0; x < 7; x++) {
        toPut.push({ week: week, dayName: this.dayOfWeek[x], itemOrder: [] })
      }
      console.log("TO PUT", toPut)
      await this.db.days.bulkPut(toPut)
    }
    days = await this.db.days.where({ week: week }).toArray()
    return days
  }

  async putDay(day) {
    delete day.item
    this.db.days.put(day)
  }

  async removeDay(day) {
    console.log(day);
    this.db.days.delete(day.id)
  }

  async putItem(item) {
    this.db.items.put(item)
  }

  async removeItem(item) {
    this.db.items.delete(item.id)
  }

  async getItems(day) {
    let items = await this.db.items.where({ day: day.id }).toArray()
    return items

  }
  async getItemsFromWeek(week) {
    let days = await this.db.days.where({ week: week }).toArray()
    let items = []
    for (let x = 0; x < days.length; x++) {
      Array.prototype.push.apply(items, await this.db.items.where({ day: days[x].id }).toArray())
    }
    return items

  }

}