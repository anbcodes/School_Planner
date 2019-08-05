<template>
  <v-card>
    <v-card-title primary-title>{{numToDay[day]}}</v-card-title>
    <template v-if="itemsLoaded">
      <template v-for="(item, index) in items">
        <item :item="items[index]" :key="index" />
      </template>
    </template>
    <v-flex v-if="!itemsLoaded" ma-5 md12>
      <v-progress-linear indeterminate height="10"></v-progress-linear>
    </v-flex>
    <itemDialog
      v-model="createItemDialog"
      :item="{name: 'New Item', time: 30, color: 'red', day:dayId}"
    />
    <v-layout>
      <v-flex>
        <v-btn icon @click="createItemDialog = true">
          <v-icon>add</v-icon>
        </v-btn>
      </v-flex>
      <v-flex>{{timeDone}}/{{totalTime}} Minutes Done (Time left {{totalTime-timeDone}}min)</v-flex>
    </v-layout>
  </v-card>
</template>
<script>
import Item from "./Item";
import ItemDialog from "./ItemDialog";
export default {
  components: {
    Item,
    ItemDialog
  },
  props: {
    day: Number,
    week: Number,
    dayId: Number
  },
  created() {
    this.getItems();
    this.$bus.$on("dbItemUpdate", () => {
      this.getItems();
    });
  },
  data: () => ({
    numToDay: [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday"
    ],
    itemsLoaded: false,
    items: [],
    createItemDialog: false,
    timeDone: 0,
    totalTime: 0
  }),
  methods: {
    async getItems() {
      this.items = await this.$db.getDays(this.week);
      this.items = this.items[this.day].items;
      this.updateItemTotal();
      this.itemsLoaded = true;
    },
    updateItemTotal() {
      let timeDone = 0;
      let totalTime = 0;
      this.items.forEach(item => {
        if (item.completed) {
          timeDone += item.time;
        }
        totalTime += item.time;
      });
      this.timeDone = timeDone;
      this.totalTime = totalTime;
    }
  }
};
</script>
