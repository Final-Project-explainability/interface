<template>
  <div class="prediction-explanations-container">

    <!-- Horizontal Slider Wrapper -->
    <div class="horizontal-slider-wrapper">
      <div class="vertical-scroll-container">
        <!-- Scrollable Vertical Container -->
        <div class="models-wrapper">
          <ModelExplainableSection
            v-for="group in filteredPredictionData"
            :key="`${group.group}-${group.model || 'single'}-${viewMode}`"
            :model-name="group.model ? `${group.group} – ${group.model}` : group.group"
            :model-data="group.features"
            :group="group.group"
            :is-all-mode="selectedModel === 'All'"
            :view-mode="viewMode"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { GetPatientExplanation } from "../api/predictionApi.js";
import ModelExplainableSection from "./ModelExplainableSection.vue";

export default {
  name: "PredictionExplanations",
  components: {
    ModelExplainableSection,
  },
  props: {
    // Current patient ID
    patientId: {
      type: String,
      required: true,
    },
    // Selected ML model or "All"
    selectedModel: {
      type: String,
      required: true,
    },
    // View mode: vital / circular / mini
    viewMode: {
      type: String,
      default: "vital",
    },
    // Selected dataset name
    selectedDataset: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      predictionData: [],           // Raw explanations data
      filteredPredictionData: [],   // Filtered & sorted data for display
      lastFilters: null,            // Last applied filters (for re-applying on viewMode change)
    };
  },
  methods: {
    // Load prediction explanations based on selected model/dataset/patientId
    async loadPredictionData() {
      try {
        this.predictionData = [];
        this.filteredPredictionData = [];

        if (this.selectedModel === "All") {
          const rawData = await this.fetchAllExplanations();

          if (!rawData || Object.keys(rawData).length === 0) {
            throw new Error("No explanations found for any model.");
          }

          // Normalize raw data structure to uniform array of groups & features
          this.predictionData = Object.entries(rawData).flatMap(([group, models]) =>
            Object.entries(models).map(([model, features]) => ({
              group,
              model,
              features: Object.entries(features || {}).map(([name, percentage]) => ({
                name,
                percentage,
              })),
            }))
          );
        } else {
          const rawData = await GetPatientExplanation(this.patientId, this.selectedModel);

          if (!rawData || Object.keys(rawData).length === 0) {
            throw new Error(`No explanation data found for ${this.selectedModel}`);
          }

          this.predictionData = Object.entries(rawData).map(([group, features]) => ({
            group,
            model: this.selectedModel,
            features: Object.entries(features || {}).map(([name, percentage]) => ({
              name,
              percentage,
            })),
          }));
        }

        // Apply default filters after loading data
        this.applyFilters({
          filterType: "all",
          sortOrder: "default",
          searchQuery: "",
          viewMode: this.viewMode,
        });
      } catch (err) {
        console.error("❌ Failed to load explanation:", err.message);
        this.predictionData = [];
        this.filteredPredictionData = [];
      }
    },
    // Fetch explanations for all models (XGBOOST, LogisticRegression, DecisionTree)
    async fetchAllExplanations() {
      const models = ["XGBOOST", "LogisticRegression", "DecisionTree"];
      const explanationData = {};

      for (const model of models) {
        try {
          const modelData = await GetPatientExplanation(this.patientId, model);
          if (modelData) {
            for (const [group, features] of Object.entries(modelData)) {
              if (!explanationData[group]) explanationData[group] = {};
              explanationData[group][model] = features;
            }
          }
        } catch (err) {
          console.warn(`⚠️ Failed to load explanation for ${model}:`, err.message);
        }
      }

      return explanationData;
    },
    // Apply filters and sorting to prediction data
    applyFilters(filters) {
      this.lastFilters = filters;

      let filteredData = [...this.predictionData];

      filteredData = filteredData.map((group) => {
        let features = [...group.features];

        // Filter by positive (red) / negative (green) contributions
        if (filters.filterType === "red") {
          features = features.filter((f) => f.percentage > 0);
        } else if (filters.filterType === "green") {
          features = features.filter((f) => f.percentage < 0);
        }

        // Search query filter
        if (filters.searchQuery) {
          features = features.filter((f) =>
            f.name.toLowerCase().includes(filters.searchQuery.toLowerCase())
          );
        }

        // Sorting modes: default ranking, absolute desc/asc, alphabetical
        if (filters.sortOrder === "default") {
          const modelKey = group.model || this.selectedModel;
          const rankMap = this.getModelFeatureRanking(modelKey);

          features.sort((a, b) => {
            const aRank = rankMap[a.name] ?? Infinity;
            const bRank = rankMap[b.name] ?? Infinity;
            return aRank - bRank;
          });
        } else if (filters.sortOrder === "desc") {
          features.sort((a, b) => Math.abs(b.percentage) - Math.abs(a.percentage));
        } else if (filters.sortOrder === "asc") {
          features.sort((a, b) => Math.abs(a.percentage) - Math.abs(b.percentage));
        } else if (filters.sortOrder === "abc") {
          features.sort((a, b) => a.name.localeCompare(b.name));
        }

        return { ...group, features };
      });

      this.filteredPredictionData = filteredData;
    },
    // Get feature ranking for given model based on average absolute contribution
    getModelFeatureRanking(modelName) {
      const featureStats = {}; // { name: [abs1, abs2, ...] }

      for (const group of this.predictionData) {
        if (group.model !== modelName) continue;

        for (const feature of group.features) {
          if (!featureStats[feature.name]) featureStats[feature.name] = [];
          featureStats[feature.name].push(Math.abs(feature.percentage));
        }
      }

      const ranked = Object.entries(featureStats)
        .map(([name, values]) => ({
          name,
          avg: values.reduce((a, b) => a + b, 0) / values.length,
        }))
        .sort((a, b) => b.avg - a.avg); // Highest importance first

      return ranked.reduce((map, item, index) => {
        map[item.name] = index;
        return map;
      }, {});
    },

  },
  watch: {
    // Reload data when patientId, selectedModel or selectedDataset changes
    patientId: "loadPredictionData",
    selectedModel: "loadPredictionData",
    selectedDataset: "loadPredictionData",
    viewMode(newVal) {
      // When the view mode changes, re-apply the filters
      if (this.lastFilters) {
        this.applyFilters(this.lastFilters);
      }
    },
  },
  mounted() {
    // Load prediction data when the component is mounted
    this.loadPredictionData();
  },
};
</script>

<style scoped>
.prediction-explanations-container {
  border-radius: 10px;
  padding: 0px;
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;

}

/* Horizontal slider wrapper for the explanation sections */
.horizontal-slider-wrapper {
  display: flex;
  align-items: center;
  position: relative;
  overflow: hidden;
  height: calc(100% - 50px);
  flex: 1;
}

/* Scrollable vertical container to hold model explanations */
.vertical-scroll-container {
  overflow-y: auto;
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
}

/* Wrapper for multiple model sections displayed in vertical list */
.models-wrapper {
  display: flex;
  flex-direction: column;
  gap: 0px;
  justify-content: flex-start;
  align-items: flex-start;
}
</style>