<template>
  <div class="bar-chart-container">
    <!-- שורת שליטה -->
    <div class="top-controls">
      <!-- חיפוש -->
      <div class="search-bar">
        <input
          type="text"
          v-model="searchQuery"
          @input="filterChart"
          placeholder="Search Feature..."
          class="search-input"
        />
      </div>

      <!-- זום -->
      <div class="controls">
        <button @click="zoomIn" class="zoom-button" title="Zoom In">
          <i class="fas fa-search-plus"></i>
        </button>
        <button @click="zoomOut" class="zoom-button" title="Zoom Out">
          <i class="fas fa-search-minus"></i>
        </button>
      </div>
    </div>

    <!-- הגרף -->
    <div ref="chart" class="chart"></div>
  </div>
</template>

<script>
import * as echarts from "echarts";

export default {
  name: "BarChart",
  props: {
    data: Object,
    selectedModel: String
  },
  data() {
    return {
      searchQuery: "",
      filteredData: null,
    };
  },
  watch: {
    selectedModel() {
      this.initChart();
    },
    data: {
      handler() {
        this.filteredData = this.data;
        this.initChart();
      },
      deep: true
    }
  },
  mounted() {
    this.filteredData = this.data;
    this.initChart();
    window.addEventListener("resize", this.resizeChart);
  },
  beforeUnmount() {
    window.removeEventListener("resize", this.resizeChart);
    this.destroyChart();
  },
  methods: {
    initChart() {
      if (!this.filteredData || !this.$refs.chart || !this.selectedModel) return;

      const modelData = this.filteredData[this.selectedModel];
      if (!modelData || !modelData.SHAP || !modelData.LIME || !modelData.Inherent) return;

      const categories = Object.keys(modelData.SHAP);
      const seriesData = {
        SHAP: categories.map(key => modelData.SHAP[key] ?? 0),
        LIME: categories.map(key => modelData.LIME[key] ?? 0),
        Inherent: categories.map(key => modelData.Inherent[key] ?? 0),
      };

      const chartHeight = Math.max(categories.length * 25, 400);
      this.$refs.chart.style.height = `${chartHeight}px`;

      if (this.chart) this.chart.dispose();
      this.chart = echarts.init(this.$refs.chart);

      const option = {
        tooltip: {trigger: "axis", axisPointer: {type: "shadow"}},
        legend: {data: Object.keys(seriesData), top: "10px"},
        grid: {left: "3%", right: "4%", bottom: "3%", containLabel: true},
        xAxis: {type: "value", boundaryGap: [0, 0.01]},
        yAxis: {type: "category", data: categories},
        series: Object.entries(seriesData).map(([name, data], idx) => ({
          name,
          type: "bar",
          data,
          itemStyle: {
            color: ["#c0392b", "#2ecc71", "#f39c12"][idx],
          },
        })),
        dataZoom: [
          {
            type: "slider",
            yAxisIndex: 0,
            filterMode: "filter",
            start: 0,
            end: 5,
          },
        ],
      };

      this.chart.setOption(option);
    },

    filterChart() {
      if (!this.data || !this.selectedModel) return;

      const modelData = this.data[this.selectedModel];
      const query = this.searchQuery.toLowerCase();
      const categories = Object.keys(modelData.SHAP).filter((key) =>
          key.toLowerCase().includes(query)
      );

      this.filteredData = {
        [this.selectedModel]: {
          SHAP: this.filterSeries(modelData.SHAP, categories),
          LIME: this.filterSeries(modelData.LIME, categories),
          Inherent: this.filterSeries(modelData.Inherent, categories),
        },
      };

      this.initChart();
    },

    filterSeries(series, categories) {
      return categories.reduce((acc, cat) => {
        acc[cat] = series[cat];
        return acc;
      }, {});
    },

    zoomIn() {
      const zoom = this.chart?.getOption().dataZoom?.[0];
      if (zoom) {
        this.chart.dispatchAction({
          type: "dataZoom",
          start: 0,
          end: Math.max(zoom.end - 5, 0),
        });
      }
    },

    zoomOut() {
      const zoom = this.chart?.getOption().dataZoom?.[0];
      if (zoom) {
        this.chart.dispatchAction({
          type: "dataZoom",
          start: 0,
          end: Math.min(zoom.end + 5, 100),
        });
      }
    },

    resizeChart() {
      this.chart?.resize();
    },

    destroyChart() {
      this.chart?.dispose();
      this.chart = null;
    },
  },
};
</script>

<style scoped>
/* כל העיצוב הקיים שלך היה טוב ונשמר — השארתי אותו בדיוק כמו שהיה */
.bar-chart-container {
  display: flex;
  flex-direction: column;
  height: 100%;
  position: relative;
  padding-top: 16px;
}

.top-controls {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  gap: 10px;
  padding: 0 12px;
}

.search-bar {
  display: flex;
}

.search-input {
  width: 240px;
  padding: 10px;
  border: 2px solid #ccc;
  border-radius: 20px;
  font-size: 16px;
  outline: none;
  background-color: #f9f9f9;
  transition: border 0.3s ease;
}

.search-input:focus {
  border-color: #007a78;
  box-shadow: 0 0 5px rgba(0, 122, 120, 0.5);
}

.controls {
  display: flex;
  gap: 10px;
}

.zoom-button {
  padding: 8px;
  border-radius: 12px;
  background-color: #f9f9f9;
  color: #2e2e2e;
  border: 1px solid #ddd;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);
  font-size: 18px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.25s ease-in-out;
}

.zoom-button:hover {
  background-color: #e0e0e0;
  color: #333;
  transform: scale(1.05);
}

.zoom-button:active {
  transform: scale(0.96);
}

.chart {
  flex: 1;
  width: 100%;
  height: 100%;
}
</style>
