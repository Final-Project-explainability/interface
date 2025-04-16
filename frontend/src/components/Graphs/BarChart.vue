<template>
  <div class="bar-chart-container">
    <!-- 🔧 שורת שליטה -->
    <div class="top-controls">
      <!-- 🔍 חיפוש -->
      <div class="search-bar">
        <input
          type="text"
          v-model="searchQuery"
          placeholder="Search Feature..."
          class="search-input"
        />
      </div>

      <!-- 📦 Dropdown + Zoom -->
      <div class="right-group">
        <!-- כפתורי זום -->
        <div class="zoom-controls">
          <button class="zoom-button" @click="zoomIn" title="Zoom In">
            <i class="fas fa-search-plus"></i>
          </button>
          <button class="zoom-button" @click="zoomOut" title="Zoom Out">
            <i class="fas fa-search-minus"></i>
          </button>
        </div>

        <!-- Dropdown -->
        <div class="dropdown-container" @click="toggleDropdown">
          <div class="dropdown-toggle">
            {{ selectedFeatures.length ? `${selectedFeatures.length} features selected` : 'Select features...' }}
            <span class="arrow">&#9662;</span>
          </div>
          <div class="dropdown-content" v-if="dropdownOpen" @click.stop>
            <input
              type="text"
              v-model="dropdownSearch"
              placeholder="Search in dropdown..."
              class="search-input"
            />
            <div class="dropdown-actions">
              <button @click.stop="selectAll">
                <i class="fas fa-check-circle"></i> Select All
              </button>
              <button @click.stop="clearAll">
                <i class="fas fa-times-circle"></i> Clear All
              </button>
            </div>
            <div class="feature-list">
              <label
                v-for="f in filteredDropdownList"
                :key="f"
                class="feature-option"
              >
                <input type="checkbox" :value="f" v-model="selectedFeatures" />
                {{ f }}
              </label>
            </div>
          </div>
        </div>


      </div>
    </div>

    <!-- 📊 גרף -->
    <div ref="chart" class="chart"></div>
  </div>
</template>

<script>
import * as echarts from "echarts";

export default {
  name: "BarChart",
  props: {
    data: Object,
    selectedModel: String,
  },
  data() {
    return {
      searchQuery: "",
      dropdownSearch: "",
      dropdownOpen: false,
      selectedFeatures: [],
    };
  },
  computed: {
    modelData() {
      return this.data?.[this.selectedModel] ?? {};
    },
    allFeatures() {
      return Object.keys(this.modelData.SHAP || {});
    },
    filteredDropdownList() {
      return this.allFeatures.filter((f) =>
        f.toLowerCase().includes(this.dropdownSearch.toLowerCase())
      );
    },
    filteredCategories() {
      if (!this.selectedFeatures.length) return []; // 🔥 מחזיר כלום אם אין בחירה

      return this.selectedFeatures.filter((f) =>
        f.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    },
  },
  watch: {
    selectedModel: {
      immediate: true,
      handler() {
        this.selectedFeatures = [...this.allFeatures];
        this.$nextTick(this.initChart);
      },
    },
    selectedFeatures() {
      this.$nextTick(this.initChart);
    },
    searchQuery() {
      this.$nextTick(this.initChart);
    },
  },
  mounted() {
    window.addEventListener("resize", this.resizeChart);
    this.$nextTick(this.initChart);
  },
  beforeUnmount() {
    window.removeEventListener("resize", this.resizeChart);
    this.chart?.dispose();
  },
  methods: {
    toggleDropdown() {
      this.dropdownOpen = !this.dropdownOpen;
    },
    selectAll() {
      this.selectedFeatures = [...this.allFeatures];
    },
    clearAll() {
      this.selectedFeatures = [];
    },
    zoomIn() {
      const zoom = this.chart?.getOption()?.dataZoom?.[0];
      if (zoom) {
        this.chart.dispatchAction({
          type: "dataZoom",
          start: zoom.start,
          end: Math.max(zoom.end - 5, zoom.start + 1),
        });
      }
    },
    zoomOut() {
      const zoom = this.chart?.getOption()?.dataZoom?.[0];
      if (zoom) {
        this.chart.dispatchAction({
          type: "dataZoom",
          start: zoom.start,
          end: Math.min(zoom.end + 5, 100),
        });
      }
    },
    resizeChart() {
      this.chart?.resize();
    },
    initChart() {
      if (!this.$refs.chart || !this.modelData.SHAP) return;

      const categories = this.filteredCategories;
      const chartHeight = Math.max(categories.length * 25, 400);
      this.$refs.chart.style.height = `${chartHeight}px`;

      if (this.chart) this.chart.dispose();
      this.chart = echarts.init(this.$refs.chart);

      const buildSeries = (sourceKey, color) => ({
        name: sourceKey,
        type: "bar",
        data: categories.map((f) => this.modelData[sourceKey]?.[f] ?? 0),
        itemStyle: { color },
      });

      const option = {
        tooltip: { trigger: "axis", axisPointer: { type: "shadow" } },
        legend: { data: ["SHAP", "LIME", "Inherent"], top: 10 },
        grid: { left: "3%", right: "4%", bottom: "3%", containLabel: true },
        xAxis: { type: "value", boundaryGap: [0, 0.01] },
        yAxis: { type: "category", data: categories },
        series: [
          buildSeries("SHAP", "#c0392b"),
          buildSeries("LIME", "#2ecc71"),
          buildSeries("Inherent", "#f39c12"),
        ],
        dataZoom: [
          {
            type: "slider",
            yAxisIndex: 0,
            filterMode: "filter",
            start: 0,
            end: Math.min(8 / categories.length * 100, 100),
          },
        ],
      };

      this.chart.setOption(option);
    },
  },
};
</script>

<style scoped>
.bar-chart-container {
  display: flex;
  flex-direction: column;
  height: 100%;
  padding-top: 0px;
  gap: 10px;
}

.top-controls {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  flex-wrap: wrap;
  gap: 10px;
  padding: 0 0px;
}

.right-group {
  display: flex;
  align-items: center;
  gap: 12px;
}

/* Search input */
.search-bar input,
.dropdown-content {
  width: 240px;
  padding: 8px 12px;
  border: 1px solid #ccc;
  border-radius: 10px;
  font-size: 14px;
}

.search-input {
  width: 100%;
  max-width: 92%;
  padding: 6px 10px;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-size: 13px;
}


/* Dropdown */
.dropdown-container {
  position: relative;
  width: 260px;
  font-size: 14px;
}

.dropdown-toggle {
  padding: 10px 14px;
  background-color: #f1f1f1;
  border-radius: 12px;
  border: 1px solid #ccc;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.dropdown-content {
  position: absolute;
  top: 105%;
  right: 0;
  width: 100%;
  max-height: 300px;
  background: #fff;
  border: 1px solid #ccc;
  border-radius: 12px;
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.08);
  padding: 10px;
  z-index: 100;
}

.dropdown-actions {
  display: flex;
  justify-content: space-between;
  margin: 8px 0;
  gap: 8px;
}

.dropdown-actions button {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 6px 12px;
  background-color: #e9f5f5;
  color: #007a78;
  border: 1px solid #007a78;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.25s ease;
}

.dropdown-actions button:hover {
  background-color: #007a78;
  color: #ffffff;
}

.feature-list {
  max-height: 160px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.feature-option {
  font-size: 13px;
  display: flex;
  align-items: center;
  gap: 8px;
}

/* Zoom Buttons */
.zoom-controls {
  display: flex;
  gap: 10px;
  align-items: center;
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

.dropdown-toggle,
.dropdown-content,
.feature-option {
  color: #000 !important;
}
</style>
