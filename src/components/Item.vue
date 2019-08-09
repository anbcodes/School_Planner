<template>
  <v-card flat outlined :color="item.color" @click="editItemDialog = true">
    <v-card-text>
      <v-layout column>
        <v-flex shrink>
          <v-layout row>
            <v-flex shrink>
              <v-btn icon small @click.stop="moveItemL()" @mousedown.stop @touchstart.stop>
                <v-icon color="white">mdi-chevron-left</v-icon>
              </v-btn>
            </v-flex>
            <v-flex shrink>
              <v-btn small @click.stop="moveUp()" icon @mousedown.stop @touchstart.stop>
                <v-icon color="white">mdi-chevron-up</v-icon>
              </v-btn>
            </v-flex>
            <v-flex shrink>
              <v-btn small @click.stop="moveDown()" icon @mousedown.stop @touchstart.stop>
                <v-icon color="white">mdi-chevron-down</v-icon>
              </v-btn>
            </v-flex>
            <v-flex>
              <v-btn icon small @click.stop="moveItemR()" @mousedown.stop @touchstart.stop>
                <v-icon color="white">mdi-chevron-right</v-icon>
              </v-btn>
            </v-flex>
          </v-layout>
        </v-flex>

        <v-flex shrink>
          <v-layout>
            <v-flex shrink>
              <v-checkbox
                color="white"
                :input-value="item.completed"
                @mousedown.stop
                @touchstart.stop
                @click.stop="update({...item, completed:!item.completed})"
              />
            </v-flex>
            <v-flex shrink>
              <div :class="`font-weight-bold subtitle-2 ${item.color}--text text--lighten-5`">
                {{item.name}}
                <br />
                {{item.time}} Minutes
              </div>
            </v-flex>
          </v-layout>
        </v-flex>
      </v-layout>
    </v-card-text>

    <!-- <v-card-actions></v-card-actions> -->
    <itemDialog :item="item" v-model="editItemDialog" :day="day" :create="false" />
  </v-card>
</template>
<script>
import ItemDialog from "./ItemDialog";
import { mdiPencil } from "@mdi/js";
export default {
  components: {
    ItemDialog
  },
  props: { item: Object, day: Object },
  data: () => ({
    pencil: mdiPencil,
    editItemDialog: false
  }),
  methods: {
    async update(item) {
      await this.$db.putItem(item);
      this.$bus.$emit("dbItemUpdate");
    },

    async moveItemL() {
      delete this.day.itemOrder[this.day.itemOrder.indexOf(this.item.id)];
      this.day.itemOrder = this.removeEmpty(this.day.itemOrder);
      this.$db.putItem({
        ...this.item,
        day: this.$dayHandler.getDayFromName(
          this.$dayHandler.getNextShownDayDown(this.day.dayName)
        ).day.id
      });
      this.$db.putDay(this.day);
      this.$bus.$emit("dbDayUpdate");
      this.$bus.$emit("dbItemUpdate");
    },
    async moveItemR() {
      delete this.day.itemOrder[this.day.itemOrder.indexOf(this.item.id)];
      this.day.itemOrder = this.removeEmpty(this.day.itemOrder);
      this.$db.putItem({
        ...this.item,
        day: this.$dayHandler.getDayFromName(
          this.$dayHandler.getNextShownDayUp(this.day.dayName)
        ).day.id
      });
      this.$db.putDay(this.day);

      this.$bus.$emit("dbDayUpdate");
      this.$bus.$emit("dbItemUpdate");
    },
    async moveUp() {
      let index = this.day.itemOrder.indexOf(this.item.id);
      delete this.day.itemOrder[index];
      if (index === 0) {
        this.day.itemOrder.push(this.item.id);
      } else {
        this.day.itemOrder.splice(index - 1, 0, this.item.id);
      }

      this.day.itemOrder = this.removeEmpty(this.day.itemOrder);

      this.$db.putDay(this.day);
      this.$bus.$emit("dbDayUpdate");
    },
    async moveDown() {
      let index = this.day.itemOrder.indexOf(this.item.id);

      delete this.day.itemOrder[index];
      if (index === this.day.itemOrder.length - 1) {
        this.day.itemOrder.splice(0, 0, this.item.id);
      } else {
        this.day.itemOrder.splice(index + 2, 0, this.item.id);
      }
      this.day.itemOrder = this.removeEmpty(this.day.itemOrder);

      this.$db.putDay(this.day);
      this.$bus.$emit("dbDayUpdate");
    },
    removeEmpty(array) {
      return array.filter(v => v);
    }
  }
};
</script>
