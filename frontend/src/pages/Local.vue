<template>
  <div class="local-page">
    <MenuBar />

    <div class="content-layout">
      <!-- צד שמאל -->
      <div class="left-section">
        <!-- חיפוש מטופל -->
        <div class="search-section">
          <PatientSearch
            v-model="searchQuery"
            @search="handlePatientSearch"
          />
        </div>

        <!-- הודעת שגיאה אם לא נמצא מטופל -->
        <div v-if="errorMessage" class="error-message">
          {{ errorMessage }}
        </div>

        <!-- סיכון תמותה -->
        <div class="top-left-container">
          <MortalityRisk
            :fetchMortalityRisk="fetchMortalityRisk"
            :mortalityPercentage="mortalityPercentage"
            v-model:selectedModel="selectedModel"
          />
        </div>

        <!-- פרטי המטופל -->
        <div>
          <PatientInfo v-if="isDataVisible" :patientId="patientId" />
          <div v-else class="info-message">
            {{ loadingMessage }}
          </div>
        </div>
      </div>

      <!-- צד ימין -->
      <div class="right-section">
        <PatientDetails v-if="isDataVisible" :patientData="patientDetails" />
        <PredictionExplanations v-if="isDataVisible" />
        <div v-else class="centered-message">
          {{ loadingMessage }}
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
  },
  data() {
    return {
      searchQuery: "", // ערך תיבת החיפוש
      selectedModel: "XGBOOST", // מודל ברירת מחדל
      mortalityPercentage: 0, // אחוזי תמותה ברירת מחדל
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
    };
  },
  methods: {
    async fetchPatientDetails() {
      try {
        const details = await GetPatientDetails(this.patientId);
        this.patientDetails = details;
      } catch (error) {
        this.errorMessage = "Failed to fetch patient details: " + error.message;
      }
    },
    async fetchMortalityRisk() {
      try {
        let prediction;
        if (this.selectedModel === "XGBOOST") {
          prediction = await GetPatientPredictXGBOOST(this.patientId);
        } else if (this.selectedModel === "DecisionTree") {
          prediction = await GetPatientPredictDecisionTree(this.patientId);
        } else if (this.selectedModel === "LogisticRegression") {
          prediction = await GetPatientPredictLogisticRegression(this.patientId);
        }
        this.mortalityPercentage = prediction;
      } catch (error) {
        this.errorMessage = "Failed to fetch mortality risk: " + error.message;
      }
    },
    async handlePatientSearch(query) {
      this.patientId = query;
      this.errorMessage = "";
      this.isDataVisible = false;

      try {
        await this.fetchPatientDetails();
        await this.fetchMortalityRisk();
        this.isDataVisible = true;
      } catch (error) {
        this.errorMessage = "Error during patient search: " + error.message;
        this.isDataVisible = false;
      }
    },
  },
  created() {
    const query = this.$route.query;
    if (query.patientId) {
      this.patientId = query.patientId;
      this.handlePatientSearch(query.patientId);
    }
  },
  watch: {
    async selectedModel() {
      if (this.isDataVisible) {
        await this.fetchMortalityRisk();
      }
    },
  },
};
</script>

<style scoped>
/* כל העיצוב נשאר כפי שהיה */
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

.local-page {
  display: flex;
  flex-direction: column;
  height: 100vh;
  font-family: Arial, sans-serif;
  background-color: #f9f9f9;
  overflow: hidden;
}

.content-layout {
  display: flex;
  flex: 1;
  padding: 10px;
  gap: 10px;
  height: calc(100vh - 80px);
  overflow: hidden;
}

.left-section {
  display: flex;
  flex-direction: column;
  width: 25%;
  gap: 10px;
  height: 100%;
  min-width: 200px;
  max-width: 25%;
}

.error-message {
  font-size: 16px;
  color: red;
  text-align: center;
  padding: 10px;
  background-color: rgba(255, 0, 0, 0.1);
  border: 1px solid red;
  border-radius: 8px;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);
  margin: 10px 0;
}

.search-section {
  margin-bottom: 10px;
}

.top-left-container {
  flex: 7;
  background-image: url("https://st2.depositphotos.com/1250282/9455/v/950/depositphotos_94554184-stock-illustration-abstract-molecules-medical-background.jpg");
  background-size: cover;
  background-position: center;
  border: 2px solid #004d40;
  border-radius: 10px;
  padding: 20px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: white;
  text-shadow: 0px 2px 4px rgba(0, 0, 0, 0.6);
}

.right-section {
  flex: 3;
  display: flex;
  flex-direction: column;
  gap: 10px;
  background-color: #ffffff;
  border: 2px solid #004d40;
  border-radius: 10px;
  padding: 20px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  height: 100%;
  min-width: 400px;
  max-width: 75%;
  overflow: hidden;
  position: relative;
}

.info-message {
  font-size: 16px;
  color: #004d40;
  text-align: center;
  padding: 20px;
  background-color: rgba(255, 255, 255, 0.8);
  border: 1px solid #004d40;
  border-radius: 8px;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);
}

.centered-message {
  font-size: 18px;
  font-family: "Open Sans", sans-serif;
  font-weight: 600;
  color: #444444;
  text-align: center;
  padding: 25px 20px;
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
