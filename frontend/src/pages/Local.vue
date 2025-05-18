<template>
  <div class="local-page" :key="selectedDataset">
    <MenuBar @search="handlePatientSearch" />

    <div class="main-content">
      <transition name="fade-toast">
        <div v-if="errorMessage" class="floating-toast left">
          <i class="material-icons">error_outline</i>
          <span>{{ errorMessage }}</span>
          <button class="close-toast" @click="errorMessage = ''">
            <i class="material-icons">close</i>
          </button>
        </div>
      </transition>

      <!-- Top Row: Mortality card + Patient info -->
      <div class="top-row-container" v-if="isDataVisible">
        <div class="mortality-card-container">
          <MortalityRisk
            :fetchMortalityRisk="fetchMortalityRisk"
            :mortalityPercentage="mortalityPercentage"
            v-model:selectedModel="selectedModel"
          />
        </div>

        <div class="patient-info-container">
          <PatientDetails
            :key="`${patientId}-${selectedDataset}`"
            :patientData="patientDetails"
            :getItemVisualConfig="getItemVisualConfig"
            :searchQuery="searchQuery"
          />
          <FilterAndSearch
            :onUpdateFilters="applyFiltersToPrediction"
            v-model:viewMode="viewMode"
            v-model:searchQuery="searchQuery"
          />
        </div>
      </div>

      <!-- Main Prediction Data Section -->
      <div class="main-data-section">
        <PredictionExplanations
          v-if="isDataVisible"
          :key="`${patientId}-${selectedDataset}`"
          ref="predictionExplanations"
          :selectedModel="selectedModel"
          :patientId="patientId"
          :viewMode="viewMode"
          :selectedDataset="selectedDataset"
        />

        <!-- Placeholder Messages -->
        <div v-else class="centered-message">
          <template v-if="patientNotFoundId">
            <i class="material-icons" style="font-size: 36px; color: #e53935;">block</i>
            <p style="margin-top: 10px; font-size: 18px;">
              Patient ID <strong>{{ patientNotFoundId }}</strong> was not found in the selected dataset.
            </p>
            <p style="margin-top: 4px; font-size: 15px; color: #666;">
              Please enter a different Patient ID to view predictions, or try switching the dataset and try again.
            </p>
          </template>

          <template v-else-if="!hasSearched">
            <i class="material-icons" style="font-size: 36px; color: #00796b;">search</i>
            <p>Please search for a patient.</p>
          </template>
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
import FilterAndSearch from "../components/FilterAndSearch.vue";
import visualConfig from "../../public/data/visualConfig.json";
import { eventBus } from "@/utils/eventBus";

import {
  GetPatientPredictXGBOOST,
  GetPatientPredictDecisionTree,
  GetPatientPredictLogisticRegression,
  GetPatientDetails,
  IsPatientInCurrentDataset,
} from "../api/predictionApi.js";

import { useDataSourceStore } from "@/stores/dataSourceStore";

export default {
  name: "LocalPage",
  components: {
    MenuBar,
    MortalityRisk,
    PatientDetails,
    PredictionExplanations,
    FilterAndSearch,
  },
  data() {
    return {
      searchQuery: "",
      selectedModel: "XGBOOST",
      mortalityPercentage: 0,
      modelPercentages: {},
      patientDetails: {
        name: "No Data",
        age: 0,
        gender: "Unknown",
        diagnosis: "No Data",
      },
      patientId: "",
      patientNotFoundId: null,
      isDataVisible: false,
      errorMessage: "",
      loadingMessage: "Please search for a patient.",
      viewMode: "vital",
      hasSearched: false,
    };
  },
  computed: {
    selectedDataset() {
      const store = useDataSourceStore();
      return store.selectedDataset;
    },
  },
  methods: {
    // Fetch basic patient details
    async fetchPatientDetails() {
      const details = await GetPatientDetails(this.patientId);
      this.patientDetails = details;
    },

    // Fetch mortality risk for a specific model
    async fetchMortalityRisk(model) {
      if (model === "XGBOOST") {
        return await GetPatientPredictXGBOOST(this.patientId);
      } else if (model === "DecisionTree") {
        return await GetPatientPredictDecisionTree(this.patientId);
      } else if (model === "LogisticRegression") {
        return await GetPatientPredictLogisticRegression(this.patientId);
      }
    },

    // Fetch mortality risk from all available models
    async fetchAllModels() {
      const models = ["XGBOOST", "LogisticRegression", "DecisionTree"];
      const percentages = {};
      for (const model of models) {
        percentages[model] = await this.fetchMortalityRisk(model);
      }
      this.modelPercentages = percentages;
    },

    // Handles patient search from MenuBar
    async handlePatientSearch(query) {
      this.hasSearched = true;
      this.patientNotFoundId = null;
      this.patientId = query;
      this.errorMessage = "";
      this.isDataVisible = false;
      this.resetPatientData();

      const exists = await IsPatientInCurrentDataset(query);
      if (!exists) {
        this.patientNotFoundId = query;
        this.patientId = "";
        return;
      }

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

    // Reset patient data to default values
    resetPatientData() {
      this.patientDetails = {
        name: "No Data",
        age: 0,
        gender: "Unknown",
        diagnosis: "No Data",
      };
      this.mortalityPercentage = 0;
      this.modelPercentages = {};
    },

    // Handle user logout on token expiration
    handleLogout() {
      localStorage.removeItem("token");
      localStorage.removeItem("userId");
      localStorage.removeItem("userDetails");
      this.$router.push("/");
    },

    // Apply filters to the prediction explanations component
    applyFiltersToPrediction(filters) {
      const explanationRef = this.$refs.predictionExplanations;
      if (explanationRef?.applyFilters) {
        explanationRef.applyFilters(filters);
      }

      if (filters.viewMode !== this.viewMode) {
        this.viewMode = filters.viewMode;
      }
    },

    // Retrieve visual configuration for a specific item key
    getItemVisualConfig(key) {
      return visualConfig[key] || {};
    },
  },
  async created() {
    eventBus.on("token-expired", this.handleLogout);

    const query = this.$route.query;

    if (query.patientId) {
      this.resetPatientData();
      this.hasSearched = true;

      try {
        const exists = await IsPatientInCurrentDataset(query.patientId);
        if (!exists) {
          this.patientNotFoundId = query.patientId;
          this.patientId = "";
          return;
        }
        this.patientId = query.patientId;
        await this.handlePatientSearch(query.patientId);
      } catch (err) {
        this.errorMessage = `Failed loading patient ${query.patientId}`;
      }
    }
  },
  beforeUnmount() {
    eventBus.off("token-expired", this.handleLogout);
  },
  watch: {
    // Re-fetch data when selected model changes
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

    // Reset all data when dataset is switched
    selectedDataset() {
      this.resetPatientData();
      this.isDataVisible = false;
      this.patientId = "";
      this.searchQuery = "";
      this.errorMessage = "";
      this.loadingMessage = "Please search for a patient.";
      this.patientNotFoundId = null;
      this.hasSearched = false;
    },
  },
};
</script>

<style scoped>
.local-page {
  display: flex;
  flex-direction: column;
  height: 100vh;
  width: 100vw;
  font-family: Arial, sans-serif;
  background-color: #f9f9f9;
  overflow: hidden;
}

.main-content {
  display: flex;
  flex-direction: column;
  gap: 2px; /* Reduce spacing between components */
  padding: 20px;
  height: 100%;
  overflow: auto;
  margin-bottom: 0;
}

.top-row-container {
  display: flex;
  justify-content: flex-start; /* Align items to the left */
  gap: 20px; /* Space between child elements */
  flex-wrap: wrap;
  align-items: flex-start;
  width: 100%;

}

.mortality-card-container {
  flex: 0 1 320px; /* Defines maximum width behavior */
  max-width: 350px; /* Maximum width limit */
}

.patient-info-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0px; /* Reduce spacing */
  overflow: hidden; /* Prevent content overflow */
}

.search-in-panel {
  background-color: #f1f8f7;
  padding: 12px 16px; /* Inner padding for search bar */
  border-radius: 12px;
  border: 1px solid #c8e6c9;
  color: #004d40;
  font-weight: 500;
  width: 100%; /* Ensure search input stretches to full width */
}

.patient-id-display {
  margin: 0;
}

.main-data-section {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 15px; /* Reduce spacing between items */
  margin-top: 16px;
}

.centered-message {
  font-size: 18px;
  font-family: "Open Sans", sans-serif;
  font-weight: 600;
  color: #444444;
  text-align: center;
  padding: 20px 15px; /* Reduce padding */
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



