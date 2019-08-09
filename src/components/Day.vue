<template>
  <v-card>
    <v-card-title primary-title>{{day.dayName}}</v-card-title>
    <template v-if="itemsLoaded">
      <template v-for="(item, index) in items">
        <item :item="items[index]" :key="index" :day="day" />
      </template>
    </template>
    <v-flex v-if="!itemsLoaded" ma-5 md12>
      <v-progress-linear indeterminate height="10"></v-progress-linear>
    </v-flex>
    <itemDialog
      v-model="createItemDialog"
      :item="{name: 'New Item', time: 30, color: 'red', day:day.id}"
    />
    <v-layout>
      <v-flex>
        <v-btn icon @click="createItemDialog = true">
          <v-icon>add</v-icon>
        </v-btn>
      </v-flex>
      <v-flex
        v-if="totalTime > 0"
      >{{timeDone}}/{{totalTime}} Minutes Done (Time left {{totalTime-timeDone}}min)</v-flex>
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
    day: Object,
    week: Number
  },
  created() {
    this.getItems();
    this.$bus.$on("dbItemUpdate", () => {
      this.getItems();
    });
  },
  // render() {
  //   this.getItems();
  //   this.$bus.$on("dbItemUpdate", () => {
  //     this.getItems();
  //   });
  //   return;
  // },
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
      this.items = await this.$db.getItems(this.day);
      this.updateItemTotal();
      this.updateItemOrder();
      this.itemsLoaded = true;
    },
    updateItemTotal() {
      let timeDone = 0;
      let totalTime = 0;
      this.items.forEach(item => {
        if (item.completed) {
          timeDone += Number(item.time);
        }
        totalTime += Number(item.time);
      });
      this.timeDone = timeDone;
      this.totalTime = totalTime;
    },
    updateItemOrder() {
      if (!this.day.itemOrder) {
        this.day.itemOrder = [];
      }
      this.items.forEach(item => {
        if (!this.day.itemOrder.includes(item.id)) {
          this.day.itemOrder.push(item.id);
        }
      });
      let reorderedItems = [];
      for (let x = 0; x < this.items.length; x++) {
        reorderedItems.push(
          this.items.filter(item => {
            return this.day.itemOrder[x] === item.id;
          })[0]
        );
      }
      this.items = reorderedItems;
    }
  },
  watch: {
    day: {
      handler() {
        this.getItems();
      },
      immediate: true,
      deep: true
    }
  }
};
</script>
