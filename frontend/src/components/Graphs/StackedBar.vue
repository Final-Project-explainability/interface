<!-- StackedBarChart.vue -->
<template>
  <div ref="chart" class="chart"></div>
</template>

<script>
import * as echarts from "echarts";

export default {
  name: "StackedBarChart",
  props: {
    data: Object,
    selectedModel: String,
  },
  mounted() {
    this.renderChart();
    window.addEventListener("resize", this.resize);
  },
  beforeUnmount() {
    window.removeEventListener("resize", this.resize);
    this.chart?.dispose();
  },
  watch: {
    selectedModel: "renderChart",
    data: { handler: "renderChart", deep: true },
  },
  methods: {
    renderChart() {
      const modelData = this.data?.[this.selectedModel];
      if (!modelData) return;

      const features = Object.keys(modelData.SHAP);
      const methods = ["SHAP", "LIME", "Inherent"];

      const series = methods.map((method, idx) => ({
        name: method,
        type: "bar",
        stack: "total",
        label: { show: false },
        emphasis: { focus: "series" },
        data: features.map((f) => modelData[method][f] ?? 0),
        itemStyle: {
          color: ["#3498db", "#2ecc71", "#f39c12"][idx],
        },
      }));

      const option = {
        tooltip: { trigger: "axis", axisPointer: { type: "shadow" } },
        legend: { data: methods },
        grid: { left: "3%", right: "4%", bottom: "3%", containLabel: true },
        xAxis: { type: "value" },
        yAxis: { type: "category", data: features },
        series,
      };

      this.chart?.dispose();
      this.chart = echarts.init(this.$refs.chart);
      this.chart.setOption(option);
    },
    resize() {
      this.chart?.resize();
    },
  },
};
</script>

<style scoped>
.chart {
  width: 100%;
  height: 100%;
}
</style>
