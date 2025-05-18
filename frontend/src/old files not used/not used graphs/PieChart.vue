<template>
  <div ref="chart" class="chart"></div>
</template>

<script>
import * as echarts from "echarts";

export default {
  name: "PieChart",
  props: {
    data: Object, // הנתונים לגרף
  },
  mounted() {
    this.initChart();
    window.addEventListener("resize", this.resizeChart); // רספונסיביות
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.resizeChart); // הסרת מאזין
    this.destroyChart();
  },
  methods: {
    initChart() {
      if (!this.data || !this.$refs.chart) return;

      // --- יצירת סדרות לנתונים (Top N קטגוריות בלבד) ---
      const categories = Object.keys(this.data.SHAP);
      const seriesData = categories.map((key) => ({
        name: key,
        value: this.data.SHAP[key],
      }));
      // סידור מהגבוה לנמוך ושמירה על Top 15 בלבד
      const topData = seriesData
          .sort((a, b) => b.value - a.value) // סידור ערכים
          .slice(0, 15); // Top 15 קטגוריות

      this.chart = echarts.init(this.$refs.chart);

      // --- הגדרות גרף ---
      const option = {
        tooltip: {
          trigger: "item",
          formatter: "{a} <br/>{b}: {c} ({d}%)",
        },
        legend: {
          orient: "vertical", // מציב את הקטגוריות אנכית
          left: "right", // ממוקם בצד ימין
          data: topData.map((item) => item.name), // שמות הקטגוריות
        },
        series: [
          {
            name: "SHAP Values", // שם הסדרה
            type: "pie",
            radius: ["30%", "60%"], // רדיוס פנימי וחיצוני (עיצוב Donut)
            roseType: "radius", // עיצוב דינמי של גובה
            data: topData, // הנתונים לעוגה
            label: {
              show: true, // תוויות על הפלחים
              formatter: "{b}: {d}%", // שם הקטגוריה ואחוזים
            },
            labelLine: {
              length: 15, // אורך הקו המחבר
              length2: 10, // אורך נוסף
            },
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: "rgba(0, 0, 0, 0.5)", // צל ברור לפלח מודגש
              },
            },
          },
        ],
        color: [
          "#3498db",
          "#e74c3c",
          "#2ecc71",
          "#9b59b6",
          "#f39c12",
          "#1abc9c",
          "#34495e",
          "#d35400",
          "#7f8c8d",
          "#8e44ad",
          "#27ae60",
          "#c0392b",
          "#2980b9",
          "#e67e22",
          "#bdc3c7",
        ], // פלטת צבעים מותאמת
      };

      // --- טעינת הגרף ---
      this.chart.setOption(option);
    },
    resizeChart() {
      if (this.chart) this.chart.resize();
    },
    destroyChart() {
      if (this.chart) {
        this.chart.dispose();
        this.chart = null;
      }
    },
  },
};
</script>

<style>
.chart {
  width: 100%;
  height: 100%;
}
</style>
