<template>
  <div class="prediction-explanations-container">
    <!-- Filters and Search -->
    <FilterAndSearch :onUpdateFilters="applyFilters" />

    <!-- Horizontal Slider Wrapper -->
    <div class="horizontal-slider-wrapper">
      <div class="vertical-scroll-container">
        <!-- Scrollable Vertical Container -->
        <div class="models-wrapper">
          <!-- מציגים את כל הקבוצות של המודל -->
          <div v-for="modelGroup in filteredPredictionData" :key="modelGroup.group">
<!--            &lt;!&ndash; כותרת הקבוצה &ndash;&gt;-->
<!--            <h3 class="group-title">{{ modelGroup.group }}</h3>-->

            <!-- רשימת הפיצ'רים -->
            <div class="features-list">
              <ModelExplainableSection
                :model-name="modelGroup.group"
                :model-data="modelGroup.features"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { MockGetPatientExplanaition } from "../local_functions_mock";
import { GetPatientExplanation} from "../local_functions";
import ModelExplainableSection from "./ModelExplainableSection.vue";
import FilterAndSearch from "./FilterAndSearch.vue";

export default {
  name: "PredictionExplanations",
  components: {
    ModelExplainableSection,
    FilterAndSearch,
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
  },
  data() {
    return {
      predictionData: [], // נתוני התחזיות הגולמיים עבור המודל שנבחר
      filteredPredictionData: [], // נתונים לאחר סינון
    };
  },
  methods: {
    async loadPredictionData() {
      // קריאה לפונקציה עם patientId ו-selectedModel
      const rawData = await GetPatientExplanation(this.patientId, this.selectedModel);
      console.log("Raw data from MockGetPatientExplanaition:", rawData);

      // עיבוד המידע: המרה למערך של אובייקטים עם קבוצות ופיצ'רים
      this.predictionData = Object.entries(rawData || {}).map(([group, features]) => ({
        group, // למשל: SHAP, Lime, Inherent
        features: Object.entries(features).map(([name, percentage]) => ({
          name,
          percentage,
        })),
      }));

      console.log("Processed predictionData:", this.predictionData);

      // שמירת המידע כנתונים מסוננים
      this.filteredPredictionData = [...this.predictionData];
    },
    applyFilters({ filterType, sortOrder, searchQuery }) {
      let filteredData = [...this.predictionData]; // שמירת המבנה הבסיסי

      filteredData = filteredData.map((group) => {
        // סינון הפיצ'רים בתוך כל קבוצה
        let features = [...group.features];

        // סינון לפי צבע
        if (filterType === "red") {
          features = features.filter((feature) => feature.percentage > 0);
        } else if (filterType === "green") {
          features = features.filter((feature) => feature.percentage < 0);
        }

        // חיפוש לפי שם
        if (searchQuery) {
          features = features.filter((feature) =>
            feature.name.toLowerCase().includes(searchQuery.toLowerCase())
          );
        }

        // מיון
        if (sortOrder === "desc") {
          features.sort((a, b) => Math.abs(b.percentage) - Math.abs(a.percentage));
        } else if (sortOrder === "asc") {
          features.sort((a, b) => Math.abs(a.percentage) - Math.abs(b.percentage));
        } else if (sortOrder === "abc") {
          features.sort((a, b) => a.name.localeCompare(b.name));
        }

        // החזרת הקבוצה עם הפיצ'רים המסוננים
        return {
          ...group,
          features,
        };
      });

      this.filteredPredictionData = filteredData;
    },
  },
  watch: {
    // ניטור שינויים ב-patientId או ב-selectedModel
    patientId: "loadPredictionData",
    selectedModel: "loadPredictionData",
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
  padding: 10px;
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
  gap: 20px; /* רווח בין השורות */
  justify-content: flex-start; /* יישור לשמאל */
  align-items: flex-start; /* יישור אלמנטים לשמאל */
}
</style>