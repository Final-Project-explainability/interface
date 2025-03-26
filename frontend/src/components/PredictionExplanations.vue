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
import { MockGetPatientExplanaition } from "../local_functions_mock";
import { GetPatientExplanation} from "../local_functions";
import ModelExplainableSection from "./ModelExplainableSection.vue";

export default {
  name: "PredictionExplanations",
  components: {
    ModelExplainableSection,
  },
  props: {
    patientId: {
      type: String,
      required: true,
    },
    selectedModel: {
      type: String,
      required: true,
    },
    viewMode: {
      type: String,
      default: "vital", // circular / vital / mini
    },
  },
  data() {
    return {
      predictionData: [], // נתוני התחזיות הגולמיים עבור המודל שנבחר
      filteredPredictionData: [], // נתונים לאחר סינון
      lastFilters: null, // 🆕 לשימוש חוזר
    };
  },
  methods: {
    async loadPredictionData() {
      if (this.selectedModel === "All") {
        const rawData = await this.fetchAllExplanations();

        // עיבוד לקבוצות -> מודלים -> features
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
        this.predictionData = Object.entries(rawData || {}).map(([group, features]) => ({
          group,
          features: Object.entries(features).map(([name, percentage]) => ({
            name,
            percentage,
          })),
        }));
      }

      this.filteredPredictionData = [...this.predictionData];
    },
    async fetchAllExplanations() {
      const models = ["XGBOOST", "LogisticRegression", "DecisionTree"];
      const explanationData = {};

      for (const model of models) {
        const modelData = await GetPatientExplanation(this.patientId, model);

        for (const [group, features] of Object.entries(modelData)) {
          if (!explanationData[group]) explanationData[group] = {};
          explanationData[group][model] = features;
        }
      }

      return explanationData;
    },
    applyFilters(filters) {
      this.lastFilters = filters; // 🧠 שמור את האחרון

      let filteredData = [...this.predictionData];

      filteredData = filteredData.map((group) => {
        let features = [...group.features];

        // סינון צבע
        if (filters.filterType === "red") {
          features = features.filter((f) => f.percentage > 0);
        } else if (filters.filterType === "green") {
          features = features.filter((f) => f.percentage < 0);
        }

        // חיפוש
        if (filters.searchQuery) {
          features = features.filter((f) =>
            f.name.toLowerCase().includes(filters.searchQuery.toLowerCase())
          );
        }

        // מיון
        if (filters.sortOrder === "desc") {
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
  },
  watch: {
    // ניטור שינויים ב-patientId או ב-selectedModel
    patientId: "loadPredictionData",
    selectedModel: "loadPredictionData",
    viewMode(newVal) {
      // כאשר מצב תצוגה משתנה, נריץ את הסינון מחדש
      if (this.lastFilters) {
        this.applyFilters(this.lastFilters);
      }
    },
  },
  mounted() {
    // טעינת המידע בזמן עליית הקומפוננטה
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

.horizontal-slider-wrapper {
  display: flex;
  align-items: center;
  position: relative;
  overflow: hidden;
  height: calc(100% - 50px);
  flex: 1;
}

.vertical-scroll-container {
  overflow-y: auto;
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
}

.models-wrapper {
  display: flex;
  flex-direction: column; /* כל מודל יוצג בשורה נפרדת */
  gap: 0px; /* רווח בין השורות */
  justify-content: flex-start; /* יישור לשמאל */
  align-items: flex-start; /* יישור אלמנטים לשמאל */
}
</style>