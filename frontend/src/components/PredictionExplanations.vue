<template>
  <div class="prediction-explanations-container">
    <!-- Filters and Search -->
    <FilterAndSearch :onUpdateFilters="applyFilters" />

    <!-- Horizontal Slider Wrapper -->
    <div class="horizontal-slider-wrapper">
      <div class="vertical-scroll-container">
        <!-- Scrollable Vertical Container -->
        <div class="models-wrapper">
          <ModelExplainableSection
            v-for="(filteredModelData, modelName) in filteredPredictionData"
            :key="modelName"
            :model-name="modelName"
            :model-data="filteredModelData"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { MockGetPatientExplanaition } from "../local_functions_mock";
import ModelExplainableSection from "./ModelExplainableSection.vue";
import FilterAndSearch from "./FilterAndSearch.vue";

export default {
  name: "PredictionExplanations",
  components: {
    ModelExplainableSection,
    FilterAndSearch,
  },
  data() {
    return {
      predictionData: {}, // נתוני התחזיות מהמוק
      filteredPredictionData: {}, // נתונים לאחר סינון
    };
  },
  methods: {
    loadPredictionData() {
      const rawData = MockGetPatientExplanaition();

      // המרה למבנה המתאים
      this.predictionData = Object.keys(rawData).reduce((acc, modelName) => {
        acc[modelName] = Object.entries(rawData[modelName]).map(([name, percentage]) => ({
          name,
          percentage,
        }));
        return acc;
      }, {});

      // שכפול המידע לצורך סינון
      this.filteredPredictionData = { ...this.predictionData };
    },
    applyFilters({ filterType, sortOrder, searchQuery }) {
      let filteredData = { ...this.predictionData };

      if (filterType === "red") {
        filteredData = this.filterByColor(filteredData, "red");
      } else if (filterType === "green") {
        filteredData = this.filterByColor(filteredData, "green");
      }

      if (searchQuery) {
        filteredData = this.filterBySearch(filteredData, searchQuery);
      }

      if (sortOrder === "desc") {
        filteredData = this.sortByPercentage(filteredData, "desc");
      } else if (sortOrder === "asc") {
        filteredData = this.sortByPercentage(filteredData, "asc");
      } else if (sortOrder === "abc") {
        filteredData = this.sortByABC(filteredData);
      }

      this.filteredPredictionData = filteredData;
    },
    filterByColor(data, color) {
      const filteredData = {};
      Object.entries(data).forEach(([modelName, features]) => {
        filteredData[modelName] = features.filter((feature) => {
          return color === "red"
            ? feature.percentage > 0 // אדום: ערכים חיוביים
            : feature.percentage < 0; // ירוק: ערכים שליליים
        });
      });
      return filteredData;
    },
    filterBySearch(data, query) {
      const filteredData = {};
      Object.entries(data).forEach(([modelName, features]) => {
        filteredData[modelName] = features.filter((feature) =>
          feature.name.toLowerCase().includes(query.toLowerCase())
        );
      });
      return filteredData;
    },
    sortByPercentage(data, order) {
      const sortedData = {};
      Object.entries(data).forEach(([modelName, features]) => {
        sortedData[modelName] = [...features].sort((a, b) => {
          const diff = Math.abs(b.percentage) - Math.abs(a.percentage);
          return order === "desc" ? diff : -diff;
        });
      });
      return sortedData;
    },
    sortByABC(data) {
      const sortedData = {};
      Object.entries(data).forEach(([modelName, features]) => {
        sortedData[modelName] = [...features].sort((a, b) =>
          a.name.localeCompare(b.name)
        );
      });
      return sortedData;
    },
  },
  mounted() {
    this.loadPredictionData(); // טעינת הנתונים בזמן הרצת הקומפוננטה
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