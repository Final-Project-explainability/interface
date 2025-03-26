<template>
  <div class="bar-chart-container">
    <!-- שורת חיפוש -->
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
  },
  data() {
    return {
      searchQuery: "",
      filteredData: null,
    };
  },
  mounted() {
    this.filteredData = { ...this.data };
    this.initChart();
    window.addEventListener("resize", this.resizeChart);
  },
  beforeUnmount() {
    window.removeEventListener("resize", this.resizeChart);
    this.destroyChart();
  },
  methods: {
    initChart() {
      if (!this.filteredData || !this.$refs.chart) return;

      const categories = Object.keys(this.filteredData.SHAP);
      const seriesData = {
        SHAP: Object.values(this.filteredData.SHAP),
        FBT: Object.values(this.filteredData.FBT),
        "Logistic Regression": Object.values(this.filteredData["Logistic Regression"]),
        "Decision Tree": Object.values(this.filteredData["Decision Tree"]),
        Lime: Object.values(this.filteredData.Lime),
      };

      const chartHeight = Math.max(categories.length * 25, 400);
      this.$refs.chart.style.height = `${chartHeight}px`;

      this.chart = echarts.init(this.$refs.chart);

      const option = {
        tooltip: { trigger: "axis", axisPointer: { type: "shadow" } },
        legend: {
          data: Object.keys(seriesData),
          top: "10px",
        },
        grid: { left: "3%", right: "4%", bottom: "3%", containLabel: true },
        xAxis: { type: "value", boundaryGap: [0, 0.01] },
        yAxis: { type: "category", data: categories },
        series: Object.entries(seriesData).map(([name, data], idx) => ({
          name,
          type: "bar",
          data,
          itemStyle: {
            color: ["#c0392b", "#8e44ad", "#f39c12", "#3498db", "#2ecc71"][idx],
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
      if (!this.data) return;
      const query = this.searchQuery.toLowerCase();
      const categories = Object.keys(this.data.SHAP).filter((key) =>
        key.toLowerCase().includes(query)
      );

      this.filteredData = {
        SHAP: this.filterSeries(this.data.SHAP, categories),
        FBT: this.filterSeries(this.data.FBT, categories),
        "Logistic Regression": this.filterSeries(this.data["Logistic Regression"], categories),
        "Decision Tree": this.filterSeries(this.data["Decision Tree"], categories),
        Lime: this.filterSeries(this.data.Lime, categories),
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
      if (this.chart) {
        const zoom = this.chart.getOption().dataZoom?.[0];
        this.chart.dispatchAction({
          type: "dataZoom",
          start: 0,
          end: Math.max(zoom.end - 5, 0),
        });
      }
    },

    zoomOut() {
      if (this.chart) {
        const zoom = this.chart.getOption().dataZoom?.[0];
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





<style>
.bar-chart-container {
  display: flex;
  flex-direction: column;
  height: 100%;
  position: relative;
  padding-top: 16px;
}

/* כפתורי זום */
.controls {
  position: absolute;
  top: 12px;
  right: 12px;
  display: flex;
  gap: 10px;
  z-index: 10;
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

.zoom-button i {
  font-size: 20px;
  pointer-events: none;
}

.zoom-button:hover {
  background-color: #e0e0e0;
  color: #333;
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.1);
  transform: scale(1.05);
}

.zoom-button:active {
  transform: scale(0.96);
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
}



/* הגרף */
.chart {
  flex: 1;
  width: 100%;
  height: 100%;
}

/* חיפוש */
.search-bar {
  margin-bottom: 12px;
  display: flex;
}

.search-input {
  width: 280px;
  padding: 10px;
  border: 2px solid #ccc;
  border-radius: 20px;
  font-size: 16px;
  outline: none;
  transition: all 0.3s ease;
  background-color: #f9f9f9;
}

.search-input:focus {
  border-color: #007a78;
  box-shadow: 0 0 5px rgba(0, 122, 120, 0.5);
}


</style>