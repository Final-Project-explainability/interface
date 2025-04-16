<template>
  <div class="sankey-wrapper">
    <div class="sankey-box">
      <!-- 🔽 Dropdown לבחירת פיצ'רים -->
      <div class="top-row">
        <div class="dropdown-container" @click="toggleDropdown">
          <div class="dropdown-toggle">
            {{ selectedFeatures.length ? `${selectedFeatures.length} features selected` : 'Select features...' }}
            <span class="arrow">&#9662;</span>
          </div>

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

      <!-- 🎯 גרף -->
      <div ref="chart" class="chart"></div>
    </div>
  </div>
</template>

<script>
import * as echarts from 'echarts';

export default {
  name: 'SankeyChart',
  props: {
    data: Object,
    selectedModel: String,
  },
  data() {
    return {
      chartInstance: null,
      observer: null,
      dropdownOpen: false,
      searchQuery: "",
      selectedFeatures: [],
    };
  },
  computed: {
    modelData() {
      return this.data?.[this.selectedModel] ?? null;
    },
    allFeatures() {
      return this.modelData ? Object.keys(this.modelData.SHAP || {}) : [];
    },
    filteredFeatureList() {
      return this.allFeatures.filter((f) =>
        f.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    },
    isLimitReached() {
      return this.selectedFeatures.length >= 15;
    },
  },
  watch: {
    selectedModel: {
      immediate: true,
      handler() {
        this.initializeFeatures();
      },
    },
    selectedFeatures() {
      this.renderChart();
    },
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
    initializeFeatures() {
      if (!this.modelData) return;

      this.$nextTick(() => {
        this.selectedFeatures = Object.keys(this.modelData.SHAP || {}).slice(0, 10);
        this.renderChart();
      });
    },
    toggleDropdown() {
      this.dropdownOpen = !this.dropdownOpen;
    },
    selectAll() {
      this.selectedFeatures = [...this.allFeatures.slice(0, 15)];
    },
    clearAll() {
      this.selectedFeatures = [];
    },
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
        tooltip: { trigger: 'item' },
        series: [
          {
            type: 'sankey',
            layout: 'none',
            data: nodes,
            links,
            emphasis: { focus: 'adjacency' },
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
    setupResizeObserver() {
      const el = this.$refs.chart;
      if (!el) return;

      this.observer = new ResizeObserver(() => {
        this.chartInstance?.resize();
      });

      this.observer.observe(el.parentNode); // מתבונן בקופסה מסביב
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

.sankey-box {
  background-color: #ffffff;
  border-radius: 16px;
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.06);
  padding: 24px;
  flex: 1;
  display: flex;
  flex-direction: column;
}

.top-row {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 12px;
}

.dropdown-container {
  position: relative;
  width: 280px;
  user-select: none;
  font-size: 14px;
  direction: ltr;
}

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

.arrow {
  font-size: 12px;
}

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

.search-input {
  width: 100%;
  max-width: 92%;
  padding: 6px 10px;
  margin-bottom: 8px;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-size: 13px;
}

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

.feature-list {
  display: flex;
  flex-direction: column;
  max-height: 180px;
  overflow-y: auto;
  gap: 6px;
}

.feature-option {
  font-size: 13px;
  display: flex;
  align-items: center;
  gap: 6px;
  color: #333;
}

/* ==== Chart ==== */
.chart {
  flex: 1;
  width: 100%;
  height: 100%;
}
</style>
