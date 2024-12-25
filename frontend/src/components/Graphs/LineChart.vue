<template>
  <div class="line-chart-container">
    <!-- כפתורי זום -->
    <div class="controls">
      <button @click="zoomIn" class="zoom-button">
        <i class="fas fa-search-plus"></i>
      </button>
      <button @click="zoomOut" class="zoom-button">
        <i class="fas fa-search-minus"></i>
      </button>
    </div>
    <!-- גרף -->
    <div ref="chart" class="chart"></div>
  </div>
</template>

<script>
import * as echarts from "echarts";

export default {
  name: "LineChart",
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

      const categories = Object.keys(this.data.SHAP);

      // יצירת סדרות של כל המודלים
      const series = [
        {
          name: "SHAP",
          type: "line",
          data: Object.values(this.data.SHAP),
          smooth: true,
          lineStyle: { color: "#3498db" },
          itemStyle: { color: "#3498db" },
        },
        {
          name: "FBT",
          type: "line",
          data: Object.values(this.data.FBT),
          smooth: true,
          lineStyle: { color: "#e74c3c" },
          itemStyle: { color: "#e74c3c" },
        },
        {
          name: "Logistic Regression",
          type: "line",
          data: Object.values(this.data["Logistic Regression"]),
          smooth: true,
          lineStyle: { color: "#2ecc71" },
          itemStyle: { color: "#2ecc71" },
        },
        {
          name: "Decision Tree",
          type: "line",
          data: Object.values(this.data["Decision Tree"]),
          smooth: true,
          lineStyle: { color: "#9b59b6" },
          itemStyle: { color: "#9b59b6" },
        },
      ];

      this.chart = echarts.init(this.$refs.chart);

      // הגדרות הגרף
      const option = {
        tooltip: { trigger: "axis" },
        legend: {
          top: "10px",
          data: ["SHAP", "FBT", "Logistic Regression", "Decision Tree"],
        },
        grid: { left: "3%", right: "4%", bottom: "3%", containLabel: true },
        xAxis: {
          type: "category",
          data: categories,
          axisLabel: {
            interval: 0,
            rotate: 45,
          },
        },
        yAxis: { type: "value" },
        dataZoom: [
          {
            type: "slider",
            xAxisIndex: 0,
            filterMode: "filter",
            start: 0,
            end: 10,
          },
        ],
        series,
      };

      this.chart.setOption(option);
    },
    zoomIn() {
      const dataZoom = this.chart.getOption().dataZoom[0];
      let { start, end } = dataZoom;

      // Zoom In: מצמצם את הטווח
      const zoomFactor = 5;
      const newStart = Math.min(start + zoomFactor, end - 10); // שמירה על מינימום טווח
      const newEnd = Math.max(end - zoomFactor, start + 10);

      if (newEnd > newStart) {
        this.chart.dispatchAction({
          type: "dataZoom",
          start: newStart,
          end: newEnd,
        });
      }
    },
    zoomOut() {
      const dataZoom = this.chart.getOption().dataZoom[0];
      let { start, end } = dataZoom;

      // Zoom Out: מרחיב את הטווח
      const zoomFactor = 5;
      const newStart = Math.max(start - zoomFactor, 0); // למנוע ירידה מתחת ל-0%
      const newEnd = Math.min(end + zoomFactor, 100);

      this.chart.dispatchAction({
        type: "dataZoom",
        start: newStart,
        end: newEnd,
      });
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
.line-chart-container {
  position: relative;
  width: 100%;
  height: 100%;
}

.controls {
  position: absolute;
  top: 10px;
  right: 10px;
  display: flex;
  gap: 10px;
  z-index: 10;
}

.zoom-button {
  padding: 10px;
  border: none;
  border-radius: 50%;
  background-color: #3498db;
  color: white;
  cursor: pointer;
  font-size: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.zoom-button:hover {
  background-color: #2980b9;
  transform: scale(1.1);
}

.chart {
  width: 100%;
  height: 100%;
}
</style>
