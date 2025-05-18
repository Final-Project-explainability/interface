<template>
  <div ref="chart" class="chart"></div>
</template>

<script>
import * as echarts from "echarts";

export default {
  name: "DumbbellChart",
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
      deep: true,
      handler: "renderChart",
    },
  },
  methods: {
    renderChart() {
      const model = this.data?.[this.selectedModel];
      if (!model) return;

      const features = Object.keys(model.SHAP);
      const points = features.map((f) => ({
        name: f,
        SHAP: model.SHAP[f] ?? 0,
        LIME: model.LIME[f] ?? 0,
      }));

      const lines = points.map((p) => ({
        coords: [[p.SHAP, p.name], [p.LIME, p.name]],
      }));

      const option = {
        tooltip: {
          formatter: (params) => {
            const f = params.name;
            const p = points.find((e) => e.name === f);
            return `
              ${f}<br/>
              SHAP: ${p.SHAP.toFixed(3)}<br/>
              LIME: ${p.LIME.toFixed(3)}
            `;
          },
        },
        grid: { left: "5%", right: "4%", bottom: "3%", containLabel: true },
        xAxis: { type: "value" },
        yAxis: { type: "category", data: features, inverse: true },
        series: [
          {
            type: "custom",
            renderItem: function (params, api) {
              const start = api.coord([api.value(0), api.value(1)]);
              const end = api.coord([api.value(2), api.value(1)]);
              return {
                type: "line",
                shape: {
                  x1: start[0],
                  y1: start[1],
                  x2: end[0],
                  y2: end[1],
                },
                style: {
                  stroke: "#aaa",
                  lineWidth: 2,
                },
              };
            },
            encode: {
              x: [0, 2],
              y: 1,
            },
            data: points.map((p) => [p.SHAP, p.name, p.LIME]),
          },
          {
            name: "SHAP",
            type: "scatter",
            data: points.map((p) => [p.SHAP, p.name]),
            itemStyle: { color: "#e74c3c" },
            symbolSize: 10,
          },
          {
            name: "LIME",
            type: "scatter",
            data: points.map((p) => [p.LIME, p.name]),
            itemStyle: { color: "#2ecc71" },
            symbolSize: 10,
          },
        ],
      };

      if (this.chart) this.chart.dispose();
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
