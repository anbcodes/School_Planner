import Dexie from 'dexie'
export default class DataBase {
  constructor() {
    this.db = this.initDb()
  }

  initDb() {
    let db = new Dexie("planner")
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
        toPut.push({ week: week })
      }
      await this.db.days.bulkPut(toPut)
    }
    days = await this.db.days.where({ week: week }).toArray()
    for (let x = 0; x < days.length; x++) {
      let day = days[x]
      day.items = await this.db.items.where({ day: day.id }).toArray()
    }
    return days
  }

  async putDay(day) {
    delete day.item
    this.db.days.put(day)
  }

  async putItem(item) {
    this.db.items.put(item)
  }

  async removeItem(item) {
    this.db.items.delete(item.id)
  }

}