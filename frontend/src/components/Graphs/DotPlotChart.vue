<template>
  <div ref="chart" class="chart"></div>
</template>

<script>
import * as echarts from "echarts";

export default {
  name: "DotPlotChart",
  props: {
    data: Object,
    selectedModel: String,
  },
  mounted() {
    this.renderChart();
    window.addEventListener("resize", this.resizeChart);
  },
  beforeUnmount() {
    window.removeEventListener("resize", this.resizeChart);
    this.chart?.dispose();
  },
  watch: {
    selectedModel: "renderChart",
    data: {
      handler: "renderChart",
      deep: true,
    },
  },
  methods: {
    renderChart() {
      if (!this.data?.[this.selectedModel]) return;

      const model = this.data[this.selectedModel];
      const features = Object.keys(model.SHAP);

      const methods = ["SHAP", "LIME", "Inherent"];
      const series = methods.map((method, i) => ({
        name: method,
        type: "scatter",
        symbolSize: 10,
        data: features.map((f) => [model[method][f], f]),
        itemStyle: { color: ["#c0392b", "#2ecc71", "#f39c12"][i] },
      }));

      this.chart = echarts.init(this.$refs.chart);
      this.chart.setOption({
        tooltip: {
          trigger: "item",
          formatter: (params) =>
            `${params.value[1]}<br/>${params.seriesName}: ${params.value[0]}`,
        },
        legend: { top: 10 },
        grid: { left: "5%", right: "4%", bottom: "3%", containLabel: true },
        xAxis: { type: "value" },
        yAxis: {
          type: "category",
          data: features,
          inverse: true,
        },
        series,
      });
    },
    resizeChart() {
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
