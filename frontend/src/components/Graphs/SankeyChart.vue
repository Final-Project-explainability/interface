<template>
  <div class="sankey-wrapper">
    <div class="sankey-box">
      <!-- 🔽 Dropdown to select features for visualization -->
      <div class="top-row">
        <div class="dropdown-container" @click="toggleDropdown">
          <div class="dropdown-toggle">
            {{ selectedFeatures.length ? `${selectedFeatures.length} features selected` : 'Select features...' }}
            <span class="arrow">&#9662;</span>
          </div>

          <!-- Dropdown content: search, select all, clear all, feature checkboxes -->
          <div class="dropdown-content" v-if="dropdownOpen" @click.stop>
            <input
              type="text"
              v-model="searchQuery"
              placeholder="Search features..."
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
                v-for="feature in filteredFeatureList"
                :key="feature"
                class="feature-option"
              >
                <input
                  type="checkbox"
                  :value="feature"
                  v-model="selectedFeatures"
                  :disabled="isLimitReached && !selectedFeatures.includes(feature)"
                />
                {{ feature }}
              </label>
            </div>
          </div>
        </div>
      </div>

      <!-- 🎯 Sankey diagram visualization -->
      <div ref="chart" class="chart"></div>
    </div>
  </div>
</template>

<script>
import * as echarts from 'echarts';

export default {
  name: 'SankeyChart',
  props: {
    data: Object,          // Input data containing SHAP, LIME, Inherent values
    selectedModel: String, // The model currently selected for visualization
  },
  data() {
    return {
      chartInstance: null,  // ECharts instance
      observer: null,       // Resize observer for responsiveness
      dropdownOpen: false,  // Dropdown visibility state
      searchQuery: "",      // Query for filtering features in dropdown
      selectedFeatures: [], // Currently selected features for the Sankey chart
    };
  },
  computed: {
    // Extract model data for the selected model
    modelData() {
      return this.data?.[this.selectedModel] ?? null;
    },
    // Get all available features from SHAP keys
    allFeatures() {
      return this.modelData ? Object.keys(this.modelData.SHAP || {}) : [];
    },
    // Filter feature list based on search query
    filteredFeatureList() {
      return this.allFeatures.filter((f) =>
        f.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    },
    // Limit to maximum 15 selected features
    isLimitReached() {
      return this.selectedFeatures.length >= 15;
    },
  },
  watch: {
    // When selected model changes, reinitialize feature selection
    selectedModel: {
      immediate: true,
      handler() {
        this.initializeFeatures();
      },
    },
    // Re-render chart when selected features change
    selectedFeatures() {
      this.renderChart();
    },
    // Watch for changes in data (deep watch)
    data: {
      deep: true,
      handler() {
        this.initializeFeatures();
      },
    },
  },
  mounted() {
    this.setupResizeObserver();
  },
  beforeUnmount() {
    this.observer?.disconnect();
    this.chartInstance?.dispose();
  },
  methods: {
    // Initialize default selected features (first 10)
    initializeFeatures() {
      if (!this.modelData) return;

      this.$nextTick(() => {
        this.selectedFeatures = Object.keys(this.modelData.SHAP || {}).slice(0, 10);
        this.renderChart();
      });
    },
    // Toggle dropdown visibility
    toggleDropdown() {
      this.dropdownOpen = !this.dropdownOpen;
    },
    // Select up to 15 features at once
    selectAll() {
      this.selectedFeatures = [...this.allFeatures.slice(0, 15)];
    },
    // Clear all selected features
    clearAll() {
      this.selectedFeatures = [];
    },
    // Render the Sankey chart using ECharts
    renderChart() {
      if (!this.modelData || !this.$refs.chart) return;

      if (this.chartInstance) {
        this.chartInstance.dispose();
      }
      this.chartInstance = echarts.init(this.$refs.chart);

      const methods = ['SHAP', 'LIME', 'Inherent'];

      const nodes = [
        ...methods.map((m) => ({ name: m })),
        ...this.selectedFeatures.map((f) => ({ name: f })),
      ];

      const links = methods.flatMap((method) =>
        this.selectedFeatures.map((f) => ({
          source: method,
          target: f,
          value: this.modelData[method]?.[f] ?? 0,
        }))
      );

      this.chartInstance.setOption({
        tooltip: { trigger: 'item' }, // Tooltip on hover
        series: [
          {
            type: 'sankey',
            layout: 'none',
            data: nodes,
            links,
            emphasis: { focus: 'adjacency' }, // Highlight connections
            lineStyle: { color: 'gradient', curveness: 0.5 },
            nodeGap: 12,
            nodeAlign: 'left',
            label: { color: '#333', fontSize: 12 },
          },
        ],
      });

      this.$nextTick(() => {
        this.chartInstance.resize();
      });
    },
    // Setup resize observer to keep chart responsive
    setupResizeObserver() {
      const el = this.$refs.chart;
      if (!el) return;

      this.observer = new ResizeObserver(() => {
        this.chartInstance?.resize();
      });

      this.observer.observe(el.parentNode); // Observe parent box for resizing
    },
  },
};
</script>

<style scoped>
.sankey-wrapper {
  display: flex;
  flex-direction: column;
  height: 100%;
}

/* Container box for Sankey chart with padding and shadow */
.sankey-box {
  background-color: #ffffff;
  border-radius: 16px;
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.06);
  padding: 24px;
  flex: 1;
  display: flex;
  flex-direction: column;
}

/* Align dropdown to top-right */
.top-row {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 12px;
}

/* Dropdown container styling */
.dropdown-container {
  position: relative;
  width: 280px;
  user-select: none;
  font-size: 14px;
  direction: ltr;
}

/* Dropdown toggle button */
.dropdown-toggle {
  padding: 10px 14px;
  background-color: #f1f1f1;
  border-radius: 12px;
  border: 1px solid #ccc;
  cursor: pointer;
  color: #000;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

/* Dropdown arrow icon */
.arrow {
  font-size: 12px;
}

/* Dropdown content panel */
.dropdown-content {
  position: absolute;
  top: 105%;
  right: 0;
  width: 100%;
  max-height: 320px;
  background-color: #fff;
  border-radius: 12px;
  border: 1px solid #ccc;
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.1);
  z-index: 100;
  padding: 10px;
  direction: ltr;
}

/* Search input inside dropdown */
.search-input {
  width: 100%;
  max-width: 92%;
  padding: 6px 10px;
  margin-bottom: 8px;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-size: 13px;
}

/* Buttons: Select All / Clear All */
.dropdown-actions {
  display: flex;
  justify-content: space-between;
  gap: 8px;
  margin-bottom: 8px;
}

.dropdown-actions button {
  flex: 1;
  background: #e9f5f5;
  color: #007a78;
  border: 1px solid #007a78;
  padding: 6px 10px;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  transition: all 0.25s ease;
}

.dropdown-actions button:hover {
  background-color: #007a78;
  color: #fff;
}

/* Feature list inside dropdown with scroll */
.feature-list {
  display: flex;
  flex-direction: column;
  max-height: 180px;
  overflow-y: auto;
  gap: 6px;
}

/* Single feature option (checkbox + label) */
.feature-option {
  font-size: 13px;
  display: flex;
  align-items: center;
  gap: 6px;
  color: #333;
}

/* Sankey chart container */
.chart {
  flex: 1;
  width: 100%;
  height: 100%;
}
</style>