<template>
  <div class="boxplot-wrapper">
    <div ref="chart" class="chart"></div>
  </div>
</template>

<script>
import * as echarts from "echarts";

export default {
  name: "BoxplotChart",
  props: {
    data: Object,
    selectedModel: String,
  },
  data() {
    return {
      chartInstance: null,
    };
  },
  watch: {
    selectedModel: {
      immediate: true,
      handler() {
        this.$nextTick(() => this.renderChart());
      },
    },
    data: {
      deep: true,
      handler() {
        this.$nextTick(() => this.renderChart());
      },
    },
  },
  mounted() {
    window.addEventListener("resize", this.resizeChart);
    this.$nextTick(() => this.renderChart());
  },
  beforeUnmount() {
    window.removeEventListener("resize", this.resizeChart);
    if (this.chartInstance) {
      this.chartInstance.dispose();
    }
  },
  methods: {
    resizeChart() {
      this.chartInstance?.resize();
    },
    renderChart() {
      if (!this.$refs.chart || !this.data || !this.selectedModel) return;

      const model = this.data[this.selectedModel];
      if (!model) return;

      const methods = ["SHAP", "LIME", "Inherent"];
      const features = Object.keys(model.SHAP || {});
      const dataForBox = methods.map((method) =>
        features.map((f) => model[method][f] ?? 0)
      );

      const option = {
        title: {
          text: "Distribution of Feature Values",
          left: "center",
        },
        tooltip: {
          trigger: "item",
          axisPointer: {
            type: "shadow",
          },
        },
        legend: {
          data: methods,
          top: 30,
        },
        grid: {
          left: "5%",
          right: "5%",
          bottom: "10%",
          containLabel: true,
        },
        xAxis: {
          type: "category",
          data: methods,
          boundaryGap: true,
          nameGap: 30,
          splitArea: {
            show: false,
          },
          axisLabel: {
            formatter: (val) => val,
            fontSize: 14,
          },
        },
        yAxis: {
          type: "value",
          name: "Value",
          splitArea: {
            show: true,
          },
        },
        series: methods.map((method, i) => ({
          name: method,
          type: "boxplot",
          data: this.calculateBoxplot(dataForBox[i]),
        })),
      };

      if (this.chartInstance) {
        this.chartInstance.dispose();
      }

      this.chartInstance = echarts.init(this.$refs.chart);
      this.chartInstance.setOption(option);
    },

    calculateBoxplot(values) {
      // תהליך בסיסי של חישוב חמישונים
      const sorted = [...values].sort((a, b) => a - b);
      const len = sorted.length;
      const q1 = this.quantile(sorted, 0.25);
      const q2 = this.quantile(sorted, 0.5);
      const q3 = this.quantile(sorted, 0.75);
      const min = sorted[0];
      const max = sorted[len - 1];
      return [[min, q1, q2, q3, max]];
    },

    quantile(arr, q) {
      const pos = (arr.length - 1) * q;
      const base = Math.floor(pos);
      const rest = pos - base;
      if (arr[base + 1] !== undefined) {
        return arr[base] + rest * (arr[base + 1] - arr[base]);
      } else {
        return arr[base];
      }
    },
  },
};
</script>

<style scoped>
.boxplot-wrapper {
  width: 100%;
  height: 100%;
  padding: 16px;
  box-sizing: border-box;
}

.chart {
  width: 100%;
  height: 100%;
}
</style>

