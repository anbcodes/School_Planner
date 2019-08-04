<template>
  <v-layout centered>
    <v-spacer />
    <template v-if="daysLoaded">
      <template v-for="index in 7">
        <v-flex centered v-if="shownDays.includes(index-1)" :key="index-1">
          <day :day="index-1" :week="week" :dayId="days[index-1].id" />
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
    this.getShownDays();
    this.getDays();
    this.$bus.$on("localStorageUpdate", () => {
      this.getShownDays();
    });
    this.$bus.$on("dbUpdate", () => {
      this.$nextTick(() => {
        this.getDays();
      });
    });
  },
  data: () => ({
    shownDays: [],
    days: [],
    daysLoaded: false
  }),
  methods: {
    async getDays() {
      this.daysLoaded = false;
      let days = await this.$db.getDays(this.week);
      this.days = days;
      this.daysLoaded = true;
    },
    getShownDays() {
      let dayToNumber = {
        Sunday: 0,
        Monday: 1,
        Tuesday: 2,
        Wednesday: 3,
        Thursday: 4,
        Friday: 5,
        Saturday: 6
      };
      let shownDays = [0, 1, 2, 3, 4, 5, 6];
      let options = JSON.parse(localStorage.getItem("options"));
      if (options !== null) {
        if (!options.showWeekends) {
          delete shownDays[6];
          delete shownDays[0];
        }
        if (!options.showCommunityDay) {
          delete shownDays[dayToNumber[options.communityDay]];
        }
      }
      this.shownDays = shownDays;
    }
  }
};
</script>
