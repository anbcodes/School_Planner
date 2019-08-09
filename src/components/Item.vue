<template>
  <v-card flat :height="100" outlined :color="item.color">
    <v-card-text>
      <v-layout>
        <v-flex>
          <v-btn icon small @click="moveItemL()">
            <v-icon color="white">mdi-chevron-left</v-icon>
          </v-btn>
        </v-flex>
        <v-flex>
          <div :class="`font-weight-bold subtitle-2 ${item.color}--text text--lighten-5`">
            Name: {{item.name}}
            <br />
            Time: {{item.time}} Minutes
          </div>
        </v-flex>
        <v-flex>
          <v-layout column>
            <v-flex>
              <v-btn small @click="editItemDialog = true" icon>
                <v-icon color="white">{{pencil}}</v-icon>
              </v-btn>
            </v-flex>
            <v-flex>
              <v-btn small @click="remove()" icon>
                <v-icon color="white">remove</v-icon>
              </v-btn>
            </v-flex>
          </v-layout>
        </v-flex>
        <v-flex>
          <v-layout column>
            <v-flex>
              <v-btn small @click="moveUp()" icon>
                <v-icon color="white">mdi-chevron-up</v-icon>
              </v-btn>
            </v-flex>
            <v-flex>
              <v-btn small @click="moveDown()" icon>
                <v-icon color="white">mdi-chevron-down</v-icon>
              </v-btn>
            </v-flex>
          </v-layout>
        </v-flex>
        <v-flex>
          <v-checkbox
            color="white"
            :input-value="item.completed"
            @change="update({...item, completed:!item.completed})"
          />
        </v-flex>
        <v-flex>
          <v-btn icon small @click="moveItemR()">
            <v-icon color="white">mdi-chevron-right</v-icon>
          </v-btn>
        </v-flex>
      </v-layout>
    </v-card-text>

    <!-- <v-card-actions></v-card-actions> -->
    <itemDialog :item="item" v-model="editItemDialog" />
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
    async remove() {
      await this.$db.removeItem(this.item);
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

      this.day.itemOrder = this.day.itemOrder.filter(v => {
        return v;
      });

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
      this.day.itemOrder = this.day.itemOrder.filter(v => {
        return v;
      });

      this.$db.putDay(this.day);
      this.$bus.$emit("dbDayUpdate");
    },
    removeEmpty(array) {
      return array.filter(v => {
        return v;
      });
    }
  }
};
</script>
