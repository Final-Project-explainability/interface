<template>
  <div ref="chart" class="chart"></div>
</template>

<script>
import * as echarts from "echarts";

export default {
  name: "HeatmapChart",
  props: {
    data: Object,
    selectedModel: String,
  },
  mounted() {
    this.initChart();
    window.addEventListener("resize", this.resizeChart);
  },
  beforeUnmount() {
    window.removeEventListener("resize", this.resizeChart);
    this.chart?.dispose();
  },
  watch: {
    selectedModel: "initChart",
    data: {
      deep: true,
      handler: "initChart",
    },
  },
  methods: {
    initChart() {
      const modelData = this.data?.[this.selectedModel];
      if (!modelData) return;

      const features = Object.keys(modelData.SHAP);
      const methods = ["SHAP", "LIME", "Inherent"];

      const heatmapData = [];
      features.forEach((feature, i) => {
        methods.forEach((method, j) => {
          heatmapData.push([j, i, modelData[method]?.[feature] ?? 0]);
        });
      });

      const option = {
        tooltip: {
          position: "top",
          formatter: (params) =>
            `${methods[params.value[0]]} - ${features[params.value[1]]}: ${params.value[2].toFixed(2)}`,
        },
        grid: {
          height: "80%",
          top: "10%",
        },
        xAxis: {
          type: "category",
          data: methods,
          splitArea: { show: true },
        },
        yAxis: {
          type: "category",
          data: features,
          splitArea: { show: true },
        },
        visualMap: {
          min: 0,
          max: Math.max(...heatmapData.map((d) => d[2])),
          calculable: true,
          orient: "horizontal",
          left: "center",
          bottom: "5%",
        },
        series: [
          {
            name: "Importance",
            type: "heatmap",
            data: heatmapData,
            label: { show: false },
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowColor: "rgba(0,0,0,0.4)",
              },
            },
          },
        ],
      };

      this.chart = echarts.init(this.$refs.chart);
      this.chart.setOption(option);
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
