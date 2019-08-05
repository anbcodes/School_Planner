<template>
  <v-card flat :height="100" outlined :color="item.color">
    <v-card-text>
      <v-layout>
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
          <v-checkbox
            color="white"
            :input-value="item.completed"
            @change="update({...item, completed:!item.completed})"
          />
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
  props: { item: Object },
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
    }
  }
};
</script>
