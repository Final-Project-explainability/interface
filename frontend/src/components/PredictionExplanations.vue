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
          model: this.selectedModel, // 🧠 נדרש כדי שהמיון לפי מודל יעבוד
          features: Object.entries(features).map(([name, percentage]) => ({
            name,
            percentage,
          })),
        }));
      }

      // 🧠 קריאה להפעלת סינון ברירת מחדל מיד לאחר טעינה
      this.applyFilters({
        filterType: "all",
        sortOrder: "default",
        searchQuery: "",
        viewMode: this.viewMode,
      });
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
      this.lastFilters = filters;

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

        // 🧠 מיון לפי ממוצע מוחלט של מודל נוכחי
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
        .sort((a, b) => b.avg - a.avg); // הכי חשובים קודם

      return ranked.reduce((map, item, index) => {
        map[item.name] = index;
        return map;
      }, {});
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