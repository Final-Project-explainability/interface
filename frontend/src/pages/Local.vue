<template>
  <div class="local-page">
    <!-- תפריט עליון -->
    <MenuBar @search="handlePatientSearch" />

    <!-- תוכן ראשי -->
    <div class="main-content">

      <!-- טוסט הודעת שגיאה -->
      <transition name="fade-toast">
        <div v-if="errorMessage" class="floating-toast left">
          <i class="material-icons">error_outline</i>
          <span>{{ errorMessage }}</span>
          <button class="close-toast" @click="errorMessage = ''">
            <i class="material-icons">close</i>
          </button>
        </div>
      </transition>

      <!-- שורה עליונה: מורטליטי + פרטי מטופל + חיפוש -->
      <div class="top-row-container">
        <div class="mortality-card-container">
          <MortalityRisk
            :fetchMortalityRisk="fetchMortalityRisk"
            :mortalityPercentage="mortalityPercentage"
            v-model:selectedModel="selectedModel"
          />
        </div>

        <div class="patient-info-container">
          <PatientDetails
            v-if="isDataVisible"
            :patientData="patientDetails"
            :getItemVisualConfig="getItemVisualConfig"
          />
          <FilterAndSearch
            :onUpdateFilters="applyFiltersToPrediction"
            v-model:viewMode="viewMode"
          />
        </div>
      </div>

      <!-- תוכן עיקרי תחתון -->
      <div class="main-data-section">
          <PredictionExplanations
            ref="predictionExplanations"
            v-if="isDataVisible"
            :selectedModel="selectedModel"
            :patientId="patientId"
            :viewMode="viewMode"
          />
        <div v-else class="centered-message">
          <i class="material-icons" style="font-size: 36px; color: #00796b;">search</i>
          <p>{{ loadingMessage }}</p>
        </div>
      </div>
    </div>
  </div>
</template>


<script>
import MenuBar from "../components/MenuBar.vue";
import MortalityRisk from "../components/MortalityRisk.vue";
import PatientDetails from "../components/PatientDetails.vue";
import PredictionExplanations from "../components/PredictionExplanations.vue";
import PatientInfo from "../components/PatientInfo.vue";
import PatientSearch from "../components/PatientSearch.vue";
import { eventBus } from "@/utils/eventBus";
import FilterAndSearch from "../components/FilterAndSearch.vue";
import visualConfig from "../JSON/visualConfig.json";




import {
  GetPatientPredictXGBOOST,
  GetPatientPredictDecisionTree,
  GetPatientPredictLogisticRegression,
  GetPatientDetails,
} from "../local_functions.js";

export default {
  name: "LocalPage",
  components: {
    MenuBar,
    MortalityRisk,
    PatientDetails,
    PredictionExplanations,
    PatientInfo,
    PatientSearch,
    FilterAndSearch,
  },
  data() {
    return {
      searchQuery: "", // ערך תיבת החיפוש
      selectedModel: "XGBOOST", // מודל ברירת מחדל
      mortalityPercentage: 0, // אחוזי תמותה ברירת מחדל
      modelPercentages: {}, // אחוזים עבור כל המודלים
      patientDetails: {
        name: "No Data",
        age: 0,
        gender: "Unknown",
        diagnosis: "No Data",
      },
      patientId: "", // מזהה מטופל
      isDataVisible: false, // האם להציג נתונים
      errorMessage: "", // הודעת שגיאה
      loadingMessage: "Please search for a patient.", // הודעת טעינה
      viewMode: "vital",
    };
  },
  methods: {
    // מביא פרטי מטופל לפי מזהה
    async fetchPatientDetails() {
      try {
        const details = await GetPatientDetails(this.patientId);
        this.patientDetails = details;
      } catch (error) {
        this.errorMessage = "Failed to fetch patient details: " + error.message;
      }
    },

    // מביא את נתוני סיכון התמותה
    async fetchMortalityRisk(model) {
      try {
        if (model === "XGBOOST") {
          return await GetPatientPredictXGBOOST(this.patientId);
        } else if (model === "DecisionTree") {
          return await GetPatientPredictDecisionTree(this.patientId);
        } else if (model === "LogisticRegression") {
          return await GetPatientPredictLogisticRegression(this.patientId);
        }
      } catch (error) {
        this.errorMessage = "Failed to fetch mortality risk: " + error.message;
        return 0;
      }
    },

    // מביא את כל הנתונים עבור שלושת המודלים
    async fetchAllModels() {
      try {
        const models = ["XGBOOST", "LogisticRegression", "DecisionTree"];
        const percentages = {};
        for (const model of models) {
          percentages[model] = await this.fetchMortalityRisk(model);
        }
        this.modelPercentages = percentages;
      } catch (error) {
        this.errorMessage = "Failed to fetch model data: " + error.message;
      }
    },

    // מטפל בחיפוש מטופל
    async handlePatientSearch(query) {
      this.patientId = query;
      this.errorMessage = "";
      this.isDataVisible = false;

      try {
        await this.fetchPatientDetails();
        if (this.selectedModel === "All") {
          await this.fetchAllModels();
        } else {
          this.mortalityPercentage = await this.fetchMortalityRisk(this.selectedModel);
        }
        this.isDataVisible = true;
      } catch (error) {
        this.errorMessage = "Error during patient search: " + error.message;
        this.isDataVisible = false;
      }
    },
    handleLogout() {
      localStorage.removeItem("token");
      localStorage.removeItem("userId");
      localStorage.removeItem("userDetails");
      this.$router.push("/");
    },

    applyFiltersToPrediction(filters) {
      console.log("🔁 Filters received:", filters);
      const explanationRef = this.$refs.predictionExplanations;
      if (explanationRef && explanationRef.applyFilters) {
        explanationRef.applyFilters(filters);
      }

      if (filters.viewMode !== this.viewMode) {
        this.viewMode = filters.viewMode;
      }
    },

    getItemVisualConfig(key) {
      return visualConfig[key] || {}; // 👈 שימוש ישיר בקובץ שלך
    },


  },
  created() {
    eventBus.on("token-expired", this.handleLogout);
    const query = this.$route.query;
    if (query.patientId) {
      this.patientId = query.patientId;
      this.handlePatientSearch(query.patientId);
    }
  },
  beforeUnmount() {
    eventBus.off("token-expired", this.handleLogout);
  },
  watch: {
    async selectedModel(newValue) {
      if (this.isDataVisible) {
        if (newValue === "All") {
          this.viewMode = "mini";
          await this.fetchAllModels();
        } else {
          this.viewMode = "vital";
          this.mortalityPercentage = await this.fetchMortalityRisk(newValue);
        }
      }
    },
  },
};
</script>

<style scoped>
.local-page {
  display: flex;
  flex-direction: column;
  height: 100vh;
  width: 100vw; /* תופס את כל רוחב המסך */
  font-family: Arial, sans-serif;
  background-color: #f9f9f9;
  overflow: hidden;
}

.main-content {
  display: flex;
  flex-direction: column;
  gap: 2px; /* צמצום הריווח בין הרכיבים */
  padding: 20px;
  height: 100%;
  overflow: auto;
  margin-bottom: 0;
}

.top-row-container {
  display: flex;
  justify-content: flex-start; /* יישור רכיבים בצמוד לשמאל */
  gap: 20px; /* ריווח בין רכיבים */
  flex-wrap: wrap;
  align-items: flex-start;
  width: 100%;

}

.mortality-card-container {
  flex: 0 1 320px; /* קובע את הרוחב המקסימלי */
  max-width: 350px; /* גבול רוחב */
}

.patient-info-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0px; /* צמצום ריווח */
  overflow: hidden; /* מונע גלישה של התוכן */
}

.search-in-panel {
  background-color: #f1f8f7;
  padding: 12px 16px; /* ריווח פנימי של שורת החיפוש */
  border-radius: 12px;
  border: 1px solid #c8e6c9;
  color: #004d40;
  font-weight: 500;
  width: 100%; /* מבטיח שהחיפוש יתפשט עד הקצה */
}

.patient-id-display {
  margin: 0;
}

.main-data-section {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 15px; /* צמצום הריווח בין הרכיבים */
  margin-top: 16px;
}

.centered-message {
  font-size: 18px;
  font-family: "Open Sans", sans-serif;
  font-weight: 600;
  color: #444444;
  text-align: center;
  padding: 20px 15px; /* צמצום ריווח */
  background: #ffffff;
  border: 1px solid #dddddd;
  border-radius: 8px;
  box-shadow: 0px 5px 15px rgba(0, 0, 0, 0.1);
  margin: auto;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 80%;
  max-width: 400px;
}

</style>



