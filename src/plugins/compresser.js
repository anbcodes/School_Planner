export default {
  dayNameToNum: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
  colorToNum: ['red', 'pink', 'purple', 'deep-purple', 'indigo', 'blue', 'light-blue', 'cyan', 'teal', 'green', 'light-green', 'lime', 'yellow', 'amber', 'orange', 'deep-orange', 'brown', 'blue-grey', 'grey'],
  compress(items) {
    let comItems = []
    items.forEach((item) => {
      let comItem = new Array(5)
      comItem[0] = item.name
      comItem[1] = Number(item.time).toString(36)
      comItem[2] = this.dayNameToNum.indexOf(item.dayOfWeek)
      comItem[3] = this.colorToNum.indexOf(item.color).toString(36)
      comItem[4] = item.notes
      comItems.push(comItem)
    })
    return comItems
  },
  decompress(comItems) {
    let items = []
    comItems.forEach((comItem) => {
      let item = {}
      item.name = comItem[0]
      item.time = parseInt(comItem[1], 36)
      item.dayOfWeek = this.dayNameToNum[comItem[2]]
      item.color = this.colorToNum[parseInt(comItem[3], 36)]
      item.notes = comItem[4]
      items.push(item)
    })
    return items
  }
}