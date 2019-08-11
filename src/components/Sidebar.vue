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
        <v-btn @mouseenter="prepareDownload()" @click="download">Download</v-btn>
      </v-flex>
    </v-layout>
  </v-navigation-drawer>
</template>
<script>
import * as jsPDF from "jspdf";
export default {
  props: {
    value: Object,
    week: Number
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
    async prepareDownload() {
      this.jsp = new jsPDF({
        orientation: "p",
        unit: "mm",
        format: "letter",
        putOnlyUsedFonts: true
      });
      let pdf = [];
      let days = await this.$db.getDays(this.week);
      for (let x = 0; x < days.length; x++) {
        let day = days[x];
        let items = await this.$db.getItems(day);
        pdf.push({
          text: day.dayName,
          size: 20,
          type: "bold",
          indent: 0,
          space: 1
        });
        for (let y = 0; y < items.length; y++) {
          let item = items[y];
          pdf.push({
            text: `${item.name} (${item.time}min)`,
            size: 15,
            type: "bold",
            indent: 1,
            space: 1
          });
          pdf.push({
            text: `${item.notes}`,
            size: 15,
            type: "",
            indent: 1.5,
            space: 1
          });
        }
      }
      let downPage = 10;

      for (let x = 0; x < pdf.length; x++) {
        let pdfMultilinelen =
          pdf[x].text.split("\n").length > 0
            ? pdf[x].text.split("\n").length * pdf[x].size
            : 0;
        if (downPage > 280 - pdfMultilinelen) {
          this.jsp.addPage();
          downPage = 10;
        }
        this.jsp.setFontSize(pdf[x].size);
        this.jsp.setFontStyle(pdf[x].type);
        this.jsp.text(
          pdf[x].text,
          Math.floor(10 + 10 * pdf[x].indent),
          downPage
        );
        pdfMultilinelen =
          pdf[x].text.split("\n").length > 0
            ? pdf[x].text.split("\n").length * pdf[x].size
            : 0;
        downPage += pdf[x + 1]
          ? pdf[x + 1].space
            ? Math.floor(pdf[x + 1].space / 1.5 + pdfMultilinelen)
            : Math.floor(pdf[x + 1].size / 1.5 + pdfMultilinelen)
          : 10;
      }
    },
    download() {
      this.jsp.output("save", "Challange Plan.pdf");
    }
  }
};
</script>
