<template>
  <div class="bar-chart-container">
    <!-- 🔧 Control bar (Search, Zoom, Dropdown) -->
    <div class="top-controls">
      <!-- 🔍 Search box for filtering visible features -->
      <div class="search-bar">
        <input
          type="text"
          v-model="searchQuery"
          placeholder="Search Feature..."
          class="search-input"
        />
      </div>

      <!-- 📦 Right group: Zoom buttons + Features dropdown -->
      <div class="right-group">
        <!-- 🔍 Zoom controls for chart scaling -->
        <div class="zoom-controls">
          <button class="zoom-button" @click="zoomIn" title="Zoom In">
            <i class="fas fa-search-plus"></i>
          </button>
          <button class="zoom-button" @click="zoomOut" title="Zoom Out">
            <i class="fas fa-search-minus"></i>
          </button>
        </div>

        <!-- 📝 Features selection dropdown -->
        <div class="dropdown-container" @click="toggleDropdown">
          <div class="dropdown-toggle">
            {{ selectedFeatures.length ? `${selectedFeatures.length} features selected` : 'Select features...' }}
            <span class="arrow">&#9662;</span>
          </div>

          <!-- Dropdown content panel -->
          <div class="dropdown-content" v-if="dropdownOpen" @click.stop>

            <!-- Search inside dropdown list -->
            <input
              type="text"
              v-model="dropdownSearch"
              placeholder="Search in dropdown..."
              class="search-input"
            />

            <!-- Select All / Clear All actions -->
            <div class="dropdown-actions">
              <button @click.stop="selectAll">
                <i class="fas fa-check-circle"></i> Select All
              </button>
              <button @click.stop="clearAll">
                <i class="fas fa-times-circle"></i> Clear All
              </button>
            </div>

            <!-- Features checklist -->
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

    <!-- 📊 The bar chart visualization itself -->
    <div ref="chart" class="chart"></div>
  </div>
</template>

<script>
import * as echarts from "echarts";

export default {
  name: "BarChart",
  props: {
    // The dataset object with SHAP, LIME, Inherent values
    data: Object,
    // Currently selected model name (string key)
    selectedModel: String,
  },
  data() {
    return {
      searchQuery: "",        // Search term for filtering chart categories
      dropdownSearch: "",     // Search term for filtering dropdown list
      dropdownOpen: false,    // Whether dropdown is open
      selectedFeatures: [],   // List of selected features to display
    };
  },
  computed: {
    // Get data for the currently selected model
    modelData() {
      return this.data?.[this.selectedModel] ?? {};
    },
    // List of all features available in SHAP data
    allFeatures() {
      return Object.keys(this.modelData.SHAP || {});
    },
    // Filtered feature list for dropdown search
    filteredDropdownList() {
      return this.allFeatures.filter((f) =>
        f.toLowerCase().includes(this.dropdownSearch.toLowerCase())
      );
    },
    // Filtered feature list for the actual bar chart display
    filteredCategories() {
      if (!this.selectedFeatures.length) return []; // Return empty if none selected

      return this.selectedFeatures.filter((f) =>
        f.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    },
  },
  watch: {
    // When selectedModel changes, re-select all features and re-render chart
    selectedModel: {
      immediate: true,
      handler() {
        this.selectedFeatures = [...this.allFeatures];
        this.$nextTick(this.initChart);
      },
    },
    // Re-render chart on feature selection change
    selectedFeatures() {
      this.$nextTick(this.initChart);
    },
    // Re-render chart on search input change
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

/* Generic input styling for search bars */
.search-bar input,
.dropdown-content {
  width: 240px;
  padding: 8px 12px;
  border: 1px solid #ccc;
  border-radius: 10px;
  font-size: 14px;
}

/* Search input field */
.search-input {
  width: 100%;
  max-width: 92%;
  padding: 6px 10px;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-size: 13px;
}


/* Dropdown container styling */
.dropdown-container {
  position: relative;
  width: 260px;
  font-size: 14px;
}

/* Dropdown toggle button */
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

/* Dropdown content panel */
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

/* Actions inside dropdown (select all, clear all) */
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

/* Feature list (checkboxes) */
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

/* Chart container */
.chart {
  flex: 1;
  width: 100%;
  height: 100%;
}

/* Force text color (prevents override issues) */
.dropdown-toggle,
.dropdown-content,
.feature-option {
  color: #000 !important;
}
</style>