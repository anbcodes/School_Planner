<template>
  <v-app>
    <v-app-bar app>
      <v-row>
        <v-col mt-5>
          <v-row>
            <v-btn icon @click="options.drawer = !options.drawer">
              <v-icon>fas fa-list</v-icon>
            </v-btn>
          </v-row>
        </v-col>
        <v-col mt-3>
          <v-row>
            <topbar v-model="week" />
          </v-row>
        </v-col>
        <v-col>
          <v-row justify="end">
            <v-btn icon @click="clear">
              <v-icon>close</v-icon>
            </v-btn>
          </v-row>
        </v-col>
      </v-row>
    </v-app-bar>
    <v-content>
      <sidebar v-model="options" :week="week" />
      <week :week="week" />
    </v-content>
  </v-app>
</template>

<script>
import Topbar from "./components/TopBar";
import Sidebar from "./components/Sidebar";
import Week from "./components/Week";

export default {
  name: "App",
  components: {
    Topbar,
    Sidebar,
    Week
  },
  created() {
    this.$dayHandler.addSetCallback(this.$set);
  },
  data: () => ({
    week: Number(localStorage.getItem("selectedWeek")) || 1,
    options: {
      ...JSON.parse(localStorage.getItem("options")),
      drawer: false
    } || {
      drawer: false,
      startWithCommunityDay: false,
      showCommunityDay: true,
      showWeekends: true,
      communityDay: "Monday"
    }
  }),
  methods: {
    async clear() {
      if (
        confirm(
          "You are clearing all the items for this week. Click ok to continue."
        )
      ) {
        for (let x = 0; x < this.$dayHandler.shownDays.length; x++) {
          let day = this.$dayHandler.shownDays[x].day;
          let items = await this.$db.getItems(day);
          for (let i = 0; i < items.length; i++) {
            let item = items[i];
            this.$db.removeItem(item);
          }
          // for (let x = 0; x < this.$dayHandler.shownDays.length; x++) {
          //   await this.$db.removeDay(this.$dayHandler.shownDays[x].day);
          // }
        }
        this.$bus.$emit("dbUpdate");
      }
    }
  }
};
</script>
