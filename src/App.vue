<template>
  <v-app>
    <v-app-bar app>
      <v-layout>
        <v-flex>
          <v-btn icon @click="options.drawer = !options.drawer">
            <v-icon>fas fa-list</v-icon>
          </v-btn>
        </v-flex>
        <v-flex>
          <topbar v-model="week" />
        </v-flex>
        <v-spacer />
      </v-layout>
    </v-app-bar>
    <v-content>
      <sidebar v-model="options" />
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
    options: JSON.parse(localStorage.getItem("options")) || {
      drawer: false,
      startWithCommunityDay: false,
      showCommunityDay: true,
      showWeekends: true,
      communityDay: "Monday"
    }
  })
};
</script>
