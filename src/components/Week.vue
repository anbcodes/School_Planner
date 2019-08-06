<template>
  <v-layout centered>
    <v-spacer />
    <v-flex hidden-md-and-up>
      <v-spacer />
      <v-btn icon @click="showDayDown()">
        <v-icon>mdi-chevron-left</v-icon>
      </v-btn>
    </v-flex>
    <template v-if="daysLoaded">
      <template v-for="(value) in shownDays">
        <v-flex
          centered
          v-if="value[1] && !($vuetify.breakpoint.smAndDown && value[0] !== showDayMobile)"
          :key="value[0]"
        >
          <day :day="value[0]" :week="week" :dayId="days[value[0]].id" />
        </v-flex>
      </template>
    </template>
    <v-flex hidden-md-and-up>
      <v-btn icon @click="showDayUp()">
        <v-icon>mdi-chevron-right</v-icon>
      </v-btn>
    </v-flex>
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
    shownDaysFiltered: [],
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
      let shownDays = [
        [0, true],
        [1, true],
        [2, true],
        [3, true],
        [4, true],
        [5, true],
        [6, true]
      ];
      let options = JSON.parse(localStorage.getItem("options"));
      if (options !== null) {
        if (!options.showWeekends) {
          shownDays[6][1] = false;
          shownDays[0][1] = false;
        }
        if (!options.showCommunityDay) {
          shownDays[dayToNumber[options.communityDay]][1] = false;
        }
        if (options.startWithCommunityDay && options.communityDay != null) {
          let newArray = new Array(7);
          let communityDayIndex = dayToNumber[options.communityDay];
          let i = communityDayIndex;
          for (let x = 0; x < 7; x++) {
            newArray[x] = [...shownDays[i]];
            i++;
            if (i > 6) {
              i = 0;
            }
          }
          shownDays = newArray;
        }
      }
      this.shownDays = shownDays;
      this.showDayMobile = this.getClosestShownDayUp(this.showDayMobile);
    },
    getClosestShownDayUp(dayNumber) {
      while (!this.shownDays[dayNumber][1]) {
        if (dayNumber > 5) {
          dayNumber = -1;
        }
        dayNumber += 1;
      }
      return dayNumber;
    },
    getClosestShownDayDown(dayNumber) {
      while (!this.shownDays[dayNumber][1]) {
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
      if (this.showDayMobile > this.shownDays[-1][0]) {
        this.showDayMobile = this.getClosestShownDayUp(0);
      } else {
        this.showDayMobile = this.getClosestShownDayUp(this.showDayMobile + 1);
      }
      localStorage.setItem("showDayMobile", this.showDayMobile);
    },
    showDayDown() {
      if (this.showDayMobile <= this.shownDays[0][0]) {
        this.showDayMobile = this.shownDays[this.shownDays.length - 1][0];
      } else {
        this.showDayMobile = this.getClosestShownDayDown(
          this.showDayMobile - 1
        );
      }
      localStorage.setItem("showDayMobile", this.showDayMobile);
    }
  }
};
</script>
