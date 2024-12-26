<template>
  <div class="radar-chart-container">
    <!-- Dropdown for selecting feature count -->
    <div class="feature-controls">
      <label for="feature-count">Number of Features to Display:</label>
      <select id="feature-count" v-model="selectedFeatures" @change="updateChart">
        <option :value="15">15</option>
        <option :value="30">30</option>
        <option :value="50">50</option>
      </select>
    </div>
    <!-- Radar Chart -->
    <div ref="chart" class="chart"></div>
  </div>
</template>

<script>
import * as echarts from "echarts";

export default {
  name: "RadarChart",
  props: {
    data: Object, // JSON data with models
  },
  data() {
    return {
      chart: null,
      selectedFeatures: 30, // Default: 30 features
    };
  },
  mounted() {
    this.initChart();
    window.addEventListener("resize", this.resizeChart); // Add resize listener
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.resizeChart); // Remove listener
    this.destroyChart();
  },
  methods: {
    initChart() {
      if (!this.data || !this.$refs.chart) return;

      this.createRadarChart(this.selectedFeatures); // Create chart with default features
    },
    createRadarChart(featureCount) {
      // Sort data and limit to the selected number of features
      const sortedFeatures = Object.entries(this.data.SHAP)
          .sort(([, a], [, b]) => b - a)
          .slice(0, featureCount);

      const categories = sortedFeatures.map(([key]) => key);
      const indicators = categories.map((key) => ({name: key, max: 1}));

      const seriesData = [
        {
          name: "SHAP",
          value: Object.values(this.data.SHAP).slice(0, featureCount),
        },
        {
          name: "FBT",
          value: Object.values(this.data.FBT).slice(0, featureCount),
        },
        {
          name: "Logistic Regression",
          value: Object.values(this.data["Logistic Regression"]).slice(
              0,
              featureCount
          ),
        },
        {
          name: "Decision Tree",
          value: Object.values(this.data["Decision Tree"]).slice(
              0,
              featureCount
          ),
        },
        {
          name: "Lime", // הוספת Lime
          value: Object.values(this.data.Lime).slice(0, featureCount),
        },
      ];

      this.chart = echarts.init(this.$refs.chart);

      // Chart options
      const option = {
        tooltip: {
          trigger: "item",
        },
        legend: {
          top: "5%",
          left: "center",
          data: ["SHAP", "FBT", "Logistic Regression", "Decision Tree", "Lime"], // הוספת Lime ל-Legend
          textStyle: {
            fontSize: 14,
            color: "#333",
          },
        },
        radar: {
          indicator: indicators,
          shape: "polygon",
          radius: "65%", // Adjust radius
          splitNumber: 5,
          splitArea: {
            areaStyle: {
              color: ["#f7f9fc", "#eaf2f8"],
            },
          },
          splitLine: {
            lineStyle: {
              color: "#dce1e6",
            },
          },
          axisLine: {
            lineStyle: {
              color: "#b8c3cc",
            },
          },
        },
        series: [
          {
            name: "Models Comparison",
            type: "radar",
            data: seriesData.map((item) => ({
              value: item.value,
              name: item.name,
            })),
            areaStyle: {
              opacity: 0.2,
            },
            lineStyle: {
              width: 2,
            },
            symbol: "circle",
            symbolSize: 6,
          },
        ],
        color: ["#3498db", "#e74c3c", "#2ecc71", "#9b59b6", "#f1c40f"], // הוספת צבע עבור Lime
      };

      this.chart.setOption(option);
    },
    updateChart() {
      // Update the chart when feature count changes
      this.destroyChart();
      this.createRadarChart(this.selectedFeatures);
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
.radar-chart-container {
  display: flex;
  flex-direction: column;
  align-items: stretch;
  width: 100%;
  height: 100%;
}

.feature-controls {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
  gap: 10px;
}

.feature-controls label {
  font-size: 14px;
  color: #333;
}

.feature-controls select {
  padding: 5px;
  font-size: 14px;
  border-radius: 5px;
  border: 1px solid #ccc;
}

.chart {
  flex: 1;
  width: 100%;
  height: 100%;
}
</style>