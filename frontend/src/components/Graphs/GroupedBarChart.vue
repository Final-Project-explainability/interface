<template>
  <div class="grouped-bar-container">
    <!-- שורת שליטה על הכל -->
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

      <!-- כפתורי זום -->
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
  name: "GroupedBarChart",
  props: {
    data: Object,
    selectedModel: String,
  },
  data() {
    return {
      searchQuery: "",
      filteredCategories: [],
      originalCategories: [],
      chartInstance: null,
    };
  },
  mounted() {
    this.filteredCategories = this.getFeatureList();
    this.initChart();
    window.addEventListener("resize", this.resizeChart);
  },
  beforeUnmount() {
    window.removeEventListener("resize", this.resizeChart);
    this.chartInstance?.dispose();
  },
  watch: {
    selectedModel() {
      this.filteredCategories = this.getFeatureList();
      this.initChart();
    },
    data: {
      deep: true,
      handler() {
        this.filteredCategories = this.getFeatureList();
        this.initChart();
      },
    },
  },
  methods: {
    getFeatureList() {
      const modelData = this.data?.[this.selectedModel];
      return modelData && modelData.SHAP ? Object.keys(modelData.SHAP) : [];
    },

    initChart() {
      if (!this.data || !this.data[this.selectedModel]) return;

      const modelData = this.data[this.selectedModel];
      const categories = this.filteredCategories;

      const methods = ["SHAP", "LIME", "Inherent"];
      const series = methods.map((method, i) => ({
        name: method,
        type: "bar",
        barGap: 0,
        data: categories.map((f) => modelData[method]?.[f] ?? 0),
        itemStyle: {
          color: ["#3498db", "#2ecc71", "#f39c12"][i],
        },
      }));

      if (this.chartInstance) this.chartInstance.dispose();
      this.chartInstance = echarts.init(this.$refs.chart);

      const chartHeight = Math.max(categories.length * 25, 400);
      this.$refs.chart.style.height = `${chartHeight}px`;

      this.chartInstance.setOption({
        tooltip: { trigger: "axis", axisPointer: { type: "shadow" } },
        legend: { data: methods, top: 10 },
        grid: { left: "3%", right: "4%", bottom: "3%", containLabel: true },
        xAxis: { type: "value" },
        yAxis: { type: "category", data: categories },
        dataZoom: [
          {
            type: "slider",
            yAxisIndex: 0,
            start: 0,
            end: 20,
            filterMode: "filter",
          },
        ],
        series,
      });
    },

    filterChart() {
      const fullList = this.getFeatureList();
      const q = this.searchQuery.toLowerCase();
      this.filteredCategories = fullList.filter((f) =>
        f.toLowerCase().includes(q)
      );
      this.initChart();
    },

    zoomIn() {
      const zoom = this.chartInstance.getOption().dataZoom?.[0];
      if (!zoom) return;
      const currentEnd = zoom.end;
      const newEnd = Math.max(currentEnd - 10, 5);
      this.chartInstance.dispatchAction({
        type: "dataZoom",
        dataZoomIndex: 0,
        start: zoom.start,
        end: newEnd,
      });
    },
    zoomOut() {
      const zoom = this.chartInstance.getOption().dataZoom?.[0];
      if (!zoom) return;
      const currentEnd = zoom.end;
      const newEnd = Math.min(currentEnd + 10, 100);
      this.chartInstance.dispatchAction({
        type: "dataZoom",
        dataZoomIndex: 0,
        start: zoom.start,
        end: newEnd,
      });
    },

    resizeChart() {
      this.chartInstance?.resize();
    },
  },
};
</script>

<style scoped>
.grouped-bar-container {
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
  margin-bottom: 12px;
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
