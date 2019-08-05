<template>
  <v-layout centered>
    <v-spacer />
    <v-flex hidden-md-and-up>
      <v-btn icon @click="showDayDown()">
        <v-icon>mdi-chevron-left</v-icon>
      </v-btn>
    </v-flex>
    <template v-if="daysLoaded">
      <template v-for="index in 7">
        <v-flex
          centered
          v-if="shownDays.includes(index-1) && !($vuetify.breakpoint.smAndDown && index-1 !== showDayMobile)"
          :key="index-1"
        >
          <day :day="index-1" :week="week" :dayId="days[index-1].id" />
        </v-flex>
      </template>
    </template>
    <v-flex v-if="!daysLoaded" ma-5 md12>
      <v-progress-linear indeterminate height="10"></v-progress-linear>
    </v-flex>
    <v-flex hidden-md-and-up>
      <v-btn icon @click="showDayUp()">
        <v-icon>mdi-chevron-right</v-icon>
      </v-btn>
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
    this.getShowDayMobile();
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
    daysLoaded: false,
    showDayMobile: 0
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
      shownDays = shownDays.filter(function(el) {
        return el != null;
      });
      console.log(shownDays);
      this.shownDays = shownDays;
      this.showDayMobile = this.getClosestShownDayUp(this.showDayMobile);
    },
    getClosestShownDayUp(dayNumber) {
      while (!this.shownDays.includes(dayNumber)) {
        if (dayNumber > 5) {
          dayNumber = -1;
        }
        dayNumber += 1;
      }
      return dayNumber;
    },
    getClosestShownDayDown(dayNumber) {
      while (!this.shownDays.includes(dayNumber)) {
        if (dayNumber < 0) {
          dayNumber = 7;
        }
        dayNumber -= 1;
      }
      return dayNumber;
    },
    getShowDayMobile() {
      let showDay = this.getClosestShownDayUp(1);

      this.showDayMobile =
        Number(localStorage.getItem("showDayMobile")) || showDay;
    },
    showDayUp() {
      if (this.showDayMobile > this.shownDays[-1]) {
        this.showDayMobile = this.getClosestShownDayUp(0);
      } else {
        this.showDayMobile = this.getClosestShownDayUp(this.showDayMobile + 1);
      }
      localStorage.setItem("showDayMobile", this.showDayMobile);
      console.log(this.showDayMobile);
    },
    showDayDown() {
      if (this.showDayMobile <= this.shownDays[0]) {
        this.showDayMobile = this.shownDays[-1];
      } else {
        this.showDayMobile = this.getClosestShownDayDown(
          this.showDayMobile - 1
        );
      }
      console.log(this.showDayMobile);
      localStorage.setItem("showDayMobile", this.showDayMobile);
    }
  }
};
</script>
