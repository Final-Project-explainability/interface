<template>
  <div class="graph">
    <div ref="chart" class="chart"></div>
  </div>
</template>

<script>
import * as echarts from "echarts";

export default {
  name: "Graph",
  props: {
    title: String, // כותרת הגרף
    data: Object, // נתונים לגרף
  },
  mounted() {
    this.initChart();
  },
  methods: {
    initChart() {
      const chart = echarts.init(this.$refs.chart);

      const categories = Object.keys(this.data);
      const values = Object.values(this.data);

      const option = {
        title: {
          text: this.title || "Graph", // שימוש בכותרת אם ניתנה
          left: "center",
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "shadow",
          },
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true,
        },
        xAxis: {
          type: "value",
          boundaryGap: [0, 0.01],
        },
        yAxis: {
          type: "category",
          data: categories,
        },
        series: [
          {
            type: "bar",
            data: values,
            itemStyle: {
              color: "#3498db",
            },
          },
        ],
      };

      chart.setOption(option);

      // טיפול ברספונסיביות
      window.addEventListener("resize", () => {
        chart.resize();
      });
    },
  },
};
</script>

<style>
.graph {
  width: 100%;
  height: 100%;
}

.chart {
  width: 100%;
  height: 100%;
}
</style>
