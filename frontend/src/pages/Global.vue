<template>
  <div class="global-page">
    <!-- Top Navigation Bar -->
    <MenuBar />

    <!-- Main Content Area -->
    <div class="main-content">
      <!-- Left Panel: Feature Metrics Information -->
      <section class="feature-section" :class="{ collapsed: isFeatureCollapsed }">
        <button class="collapse-btn" @click="toggleFeatureSection">
          <i class="fas fa-chevron-left" :class="{ rotated: isFeatureCollapsed }"></i>
        </button>

        <FeatureMetric v-show="!isFeatureCollapsed" :selectedModel="selectedModel" />
      </section>

      <!-- Right Panel: Graphs Section -->
      <section class="graph-section">
        <GraphControls
          :graphTypes="graphTypes"
          :activeType="activeGraphType"
          :selectedModel="selectedModel"
          :modelList="['XGBoost', 'Logistic Regression', 'Decision Tree']"
          @updateType="updateGraphType"
          @updateModel="updateModel"
        />

        <GraphContainer
          v-if="!isLoadingData"
          :type="activeGraphType"
          :data="filteredData"
          :selectedModel="selectedModel"
        />

        <div v-else class="graph-loading">
          🔄 Loading graph data...
        </div>
      </section>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import { eventBus } from '@/utils/eventBus';
import { useDataSourceStore } from '@/stores/dataSourceStore';

import MenuBar from "../components/MenuBar.vue";
import FeatureMetric from "../components/FeatureMetric.vue";
import GraphContainer from "../components/GraphContainer.vue";
import GraphControls from "../components/GraphControls.vue";

const router = useRouter();
const dataSourceStore = useDataSourceStore();

const graphTypes = ["Bar", "Comparison", "Sankey"];
const activeGraphType = ref("Bar");
const selectedModel = ref("XGBoost");
const isFeatureCollapsed = ref(false);
const isLoadingData = ref(true); // 🔁 Loading state for graphs

const graphData = ref({
  Bar: [],
  Comparison: [],
  Sankey: [],
});

// Mapping of dataset names to JSON file names
const datasetNameToFileMap = {
  "DataSet 1": "global_graph_DataSet1.json",
  "DataSet 2": "global_graph_DataSet2.json",
};

// Loads dataset JSON based on selected name
const loadDataset = async (datasetName) => {
  const fileName = datasetNameToFileMap[datasetName];
  if (!fileName) {
    console.warn(`⚠️ Unknown dataset: ${datasetName}`);
    return;
  }

  isLoadingData.value = true;
  try {
    const response = await fetch(`/data/JSON/${fileName}`);
    const json = await response.json();
    graphData.value = {
      Bar: json,
      Comparison: json,
      Sankey: json,
    };
  } catch (error) {
    console.error("❌ Failed to load dataset:", error);
  } finally {
    isLoadingData.value = false;
  }
};

// Initial dataset load on component mount
onMounted(() => {
  loadDataset(dataSourceStore.selectedDataset);
});

// Watch for dataset changes and reload accordingly
watch(() => dataSourceStore.selectedDataset, (newDataset) => {
  loadDataset(newDataset);
});

// Computed property to get filtered data based on active graph type
const filteredData = computed(() => {
  return graphData.value[activeGraphType.value] || [];
});

// Update selected graph type from controls
function updateGraphType(type) {
  activeGraphType.value = type;
}

// Update selected model from controls
function updateModel(model) {
  selectedModel.value = model;
}
// Toggle feature section collapse/expand with animation resize trigger
function toggleFeatureSection() {
  isFeatureCollapsed.value = !isFeatureCollapsed.value;
  setTimeout(() => {
    window.dispatchEvent(new Event("resize"));
  }, 300);
}

// Handle logout when token expires
function handleLogout() {
  localStorage.removeItem("token");
  localStorage.removeItem("userId");
  localStorage.removeItem("userDetails");
  router.push("/");
}

// Listen for global token expiration event
eventBus.on("token-expired", handleLogout);
</script>

<style scoped>
/* === Global Layout Styles === */
.global-page {
  display: flex;
  flex-direction: column;
  height: 100vh;
  width: 100vw;
  background-color: #f5f7fa;
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
  overflow: hidden;
}

.main-content {
  display: flex;
  flex: 1;
  padding: 20px;
  gap: 20px;
  overflow: hidden;
}

/* ===== Feature Section (Side Panel) ===== */
.feature-section {
  position: relative;
  flex: 1;
  background-color: #ffffff;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);
  min-width: 280px;
  max-width: 380px;
  transition:
    max-width 0.4s ease,
    min-width 0.4s ease,
    padding 0.3s ease,
    opacity 0.3s ease;
  overflow: hidden;
}

.feature-section.collapsed {
  max-width: 40px;
  min-width: 40px;
  padding: 0;
  opacity: 0.4;
}

/* Collapse/Expand Button Styling */
.collapse-btn {
  position: absolute;
  top: 40px;
  right: -9px;
  z-index: 100;
  background: #ffffff;
  border: 2px solid #007a78;
  border-radius: 25%;
  width: 36px;
  height: 36px;
  font-size: 18px;
  color: #0a0a0a;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  text-align: center;
}

.collapse-btn:hover {
  background-color: #e0f7fa;
  transform: scale(1.05);
}

.collapse-btn i {
  transition: transform 0.3s ease;
}

.collapse-btn i.rotated {
  transform: rotate(180deg);
}

/* ===== Graph Section (Right Panel) ===== */
.graph-section {
  flex: 2;
  background-color: #ffffff;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

/* Graph internal layout overrides */
.graph-section >>> .graph-container {
  flex: 1;
  overflow: hidden !important;
}

.graph-section >>> .chart-wrapper {
  flex: 1;
  overflow: hidden !important;
}

.graph-section >>> .chart {
  width: 100%;
  height: 100%;
  overflow: hidden;
}
</style>
