<template>
  <v-layout centered>
    <v-spacer />
    <template v-if="daysLoaded">
      <template v-for="value in $dayHandler.shownDays">
        <v-flex centered v-if="value.show" :key="value.id" mx-1>
          <day :day="value.day" :week="week" />
        </v-flex>
      </template>
    </template>
    <v-flex v-if="!daysLoaded" ma-5 md12>
      <v-progress-linear indeterminate height="10"></v-progress-linear>
    </v-flex>

    <v-spacer />
  </v-layout>
</template>
<script>
import Day from "./Day";

export default {
  components: {
    Day
  },
  props: {
    week: Number
  },
  created() {
    this.getDays();
    this.$bus.$on("localStorageUpdate", async () => {
      this.$dayHandler.onOptionsUpdate();
      this.$forceUpdate();
    });
    this.$bus.$on("dbUpdate", () => {
      this.$nextTick(() => {
        this.daysLoaded = false;
        this.getDays();
      });
    });
    this.$bus.$on("dbDayUpdate", () => {
      this.getDays();
    });
  },
  data: () => ({
    shownDays: [],
    shownDaysFiltered: [],
    days: [],
    daysLoaded: false,
    showDayMobile: 0,
    displayDays: []
  }),
  methods: {
    async getDays() {
      let days = await this.$db.getDays(this.week);
      this.days = days;
      this.$dayHandler.addDays(days);
      this.$dayHandler.onOptionsUpdate();

      this.daysLoaded = true;
    }
  }
};
</script>
