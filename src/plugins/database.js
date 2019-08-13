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
    if (days.length != 7) {
      for (let x = 0; x < 7; x++) {
        toPut.push({ week: week, dayName: this.dayOfWeek[x], itemOrder: [] })
      }
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

}