<template>
  <v-navigation-drawer
    :value="value.drawer"
    app
    temporary
    @input="update({...value, drawer:arguments[0]})"
  >
    <v-layout column>
      <v-flex offset-md1>
        <v-select
          :value="value.communityDay"
          @input="update({...value, communityDay:arguments[0]})"
          :items="days"
          label="Community Day"
        />
      </v-flex>
      <v-flex offset-md1>
        <v-checkbox
          :input-value="value.showWeekends"
          label="Show Weekends"
          @change="update({...value, showWeekends:arguments[0]})"
        />
      </v-flex>
      <v-flex offset-md1>
        <v-checkbox
          :input-value="value.showCommunityDay"
          label="Show Community Day"
          @change="update({...value, showCommunityDay:arguments[0]})"
        />
      </v-flex>
      <v-flex offset-md1>
        <v-checkbox
          :input-value="value.startWithCommunityDay"
          label="Start With Community Day"
          @change="update({...value, startWithCommunityDay:arguments[0]})"
        />
      </v-flex>
      <v-flex offset-md1>
        <v-btn @click="download">Print</v-btn>
      </v-flex>
      <v-flex offset-md1 mt-2>
        <v-btn @click="showTutorial">Tutorial</v-btn>
      </v-flex>
    </v-layout>
  </v-navigation-drawer>
</template>
<script>
export default {
  props: {
    value: Object,
    week: Number
  },
  created() {
    if (!localStorage.getItem("tutorialDone")) {
      if (confirm("Would you like the tutorial?")) {
        this.showTutorial();
      }
    }
  },
  data: () => ({
    days: [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday"
    ]
  }),
  methods: {
    update(value) {
      localStorage.setItem("options", JSON.stringify(value));
      this.$bus.$emit("localStorageUpdate");
      this.$emit("input", value);
    },
    async download() {
      let pdf = document.createElement("div");
      for (let x = 0; x < this.$dayHandler.shownDays.length; x++) {
        let day = this.$dayHandler.shownDays[x].day;
        let items = await this.$db.getItems(day);
        let newItems = [];
        day.itemOrder.forEach(function(key) {
          var found = false;
          items = items.filter(function(item) {
            if (!found && item.id == key) {
              newItems.push(item);
              found = true;
              return false;
            } else return true;
          });
        });
        items = newItems;
        if (this.$dayHandler.shownDays[x].show) {
          let dayText = document.createElement("h2");
          dayText.innerText = day.dayName;
          dayText.align = "center";
          pdf.appendChild(dayText);
          for (let y = 0; y < items.length; y++) {
            let item = items[y];
            let itemText = document.createElement("h3");
            itemText.innerText = `${item.name} (${item.time}min)`;
            pdf.appendChild(itemText);
            let notes = document.createElement("div");
            notes.innerHTML = item.notes;
            pdf.appendChild(notes);
          }
        }
      }
      let pdfFrame = document.createElement("iframe");
      pdfFrame.onload = () => {
        pdfFrame.contentDocument.body.appendChild(pdf);
        pdfFrame.contentWindow.focus();
        pdfFrame.contentWindow.print();
        pdfFrame.remove();
      };
      document.body.appendChild(pdfFrame);
    },
    async showTutorial() {
      localStorage.setItem("tutorialDone", "true");
      let tutorialItems = [
        {
          name: "When you are done click the X to erase this week",
          color: "blue",
          time: 25,
          notes: "You can click on the tutorial button again if you want",
          day: 5
        },
        {
          name: "Click me to edit",
          color: "red",
          time: 30,
          notes:
            "You can use <strong>bold</strong> <i>italic</i> <ins>underline</ins> and <del>strikethrough</del> on the notes (these will show up when printed)",
          day: 2
        },
        {
          name: "Use the up and down arrows to move me around (1)",
          color: "red",
          time: 30,
          notes: "the order is kept when printing",
          day: 3
        },
        {
          name: "Use the up and down arrows to move me around (2)",
          color: "orange",
          time: 30,
          notes: "the order is kept when printing",
          day: 3
        },
        {
          name: "Use the up and down arrows to move me around (3)",
          color: "green",
          time: 30,
          notes: "the order is kept when printing",
          day: 3
        },
        {
          name: "Use the up and down arrows to move me around (4)",
          color: "light-blue",
          time: 30,
          notes: "the order is kept when printing",
          day: 3
        },
        {
          name:
            "Move me to the next or previous day using the left and right arrows",
          color: "indigo",
          time: 30,
          notes: "",
          day: 2
        },
        {
          name: "Click on the sidebar in the top left to change some settings",
          color: "purple",
          time: 30,
          notes: "",
          day: 1
        },
        {
          name: "Click on the checkbox to mark a item as completed",
          color: "lime",
          time: 30,
          notes: "",
          day: 1
        }
      ];
      for (let x = 0; x < tutorialItems.length; x++) {
        let item = tutorialItems[x];
        item.day = this.$dayHandler.shownDays[item.day].day.id;
        await this.$db.putItem(item);
      }

      this.$bus.$emit("dbItemUpdate");
      this.$bus.$emit("dbDayUpdate");
    }
  },
  computed: {
    expandedWeek() {
      let challenges = ["A", "B", "1", "2", "3", "4"];
      let challenge = challenges[Math.floor((this.week - 1) / 30)];
      let weekTo30 = ((this.week - 1) % 30) + 1;
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
