<template>
  <v-row>
    <v-col cols="1">
      <v-btn icon @click="downWeek()">
        <v-icon>mdi-chevron-left</v-icon>
      </v-btn>
    </v-col>
    <v-spacer />
    <v-col mt-2 cols="8">
      <v-row justify="center">
        <v-toolbar-title class="headline hidden-xs-only">
          <span>{{expandedWeek}}</span>
        </v-toolbar-title>
        <v-toolbar-title class="subtilte-2 hidden-sm-and-up">
          <span>{{expandedWeek}}</span>
        </v-toolbar-title>
      </v-row>
    </v-col>
    <v-spacer />
    <v-col cols="1">
      <v-btn icon @click="upWeek()">
        <v-icon>mdi-chevron-right</v-icon>
      </v-btn>
    </v-col>
  </v-row>
</template>
<script>
export default {
  props: {
    value: Number
  },
  methods: {
    downWeek() {
      if (this.value > 1) {
        localStorage.setItem("selectedWeek", this.value - 1);
        this.$emit("input", this.value - 1);
        this.$bus.$emit("dbUpdate");
      }
    },
    upWeek() {
      if (this.value < 180) {
        localStorage.setItem("selectedWeek", this.value + 1);
        this.$emit("input", this.value + 1);
        this.$bus.$emit("dbUpdate");
      }
    }
  },
  computed: {
    expandedWeek() {
      let challenges = ["A", "B", "1", "2", "3", "4"];
      let challenge = challenges[Math.floor((this.value - 1) / 30)];
      let weekTo30 = ((this.value - 1) % 30) + 1;
      let weekTo15 = weekTo30 > 15 ? weekTo30 - 15 : weekTo30;
      let semester = weekTo30 > 15 ? 2 : 1;
      if (this.$vuetify.breakpoint.smAndDown) {
        return `Chall. ${challenge}, Week ${weekTo15}, Sem. ${semester}`;
      } else {
        return `Challenge ${challenge}, Week ${weekTo15}, Semester ${semester}`;
      }
    }
  }
};
</script>
