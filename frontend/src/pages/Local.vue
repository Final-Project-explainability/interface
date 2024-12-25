<template>
  <div class="local-page">
    <!-- Menu Bar -->
    <MenuBar />

    <div class="content-layout">
      <!-- Left Section -->
      <div class="left-section">
        <!-- Top Left Container -->
        <div class="top-left-container">
          <MortalityRisk
            :fetchMortalityRisk="fetchMortalityRisk"
            :mortalityPercentage="mortalityPercentage"
            v-model:selectedModel="selectedModel"
          />
        </div>

        <!-- Bottom Left Container -->
        <div class="bottom-left-container">
          <h2 class="section-title">Patient Information</h2>
          <div class="patient-info">
            <span class="patient-label">Patient ID:</span>
            <span class="patient-value">{{ patientId }}</span>
          </div>
        </div>
      </div>

      <!-- Right Section -->
      <div class="right-section">
        <PatientDetails :patientData="patientDetails" />
      </div>
    </div>
  </div>
</template>

<script>
// ייבוא קומפוננטות
import MenuBar from "../components/MenuBar.vue";
import MortalityRisk from "../components/MortalityRisk.vue";
import PatientDetails from "../components/PatientDetails.vue";

// ייבוא פונקציות המוק
import {
  MockGetPatientDeatails,
  MockGetPatientPredictXGBOOST,
  MockGetPatientPredictDecisionTree,
  MockGetPatientPredictLogisticRegression,
} from "../local_functions_mock.js";

export default {
  name: "LocalPage",
  components: {
    MenuBar,
    MortalityRisk,
    PatientDetails,
  },
  data() {
    return {
      selectedModel: "XGBOOST", // ברירת מחדל: מודל XGBOOST
      mortalityPercentage: 0, // אחוז תמותה ראשוני
      patientDetails: {}, // פרטי המטופל
      patientId: "123456789", // מזהה מטופל לדוגמה
    };
  },
  methods: {
    fetchPatientDetails() {
      // קריאה לפונקציית המוק לטעינת נתוני המטופל
      this.patientDetails = MockGetPatientDeatails(this.patientId);
    },
    fetchMortalityRisk() {
      // עדכון ערכי אחוזי התמותה לפי המודל הנבחר
      if (this.selectedModel === "XGBOOST") {
        this.mortalityPercentage = MockGetPatientPredictXGBOOST(this.patientId);
      } else if (this.selectedModel === "DecisionTree") {
        this.mortalityPercentage = MockGetPatientPredictDecisionTree(this.patientId);
      } else if (this.selectedModel === "LogisticRegression") {
        this.mortalityPercentage = MockGetPatientPredictLogisticRegression(this.patientId);
      }
    },
  },
  watch: {
    // צפייה בשינוי המודל הנבחר ועדכון האחוזים בהתאם
    selectedModel() {
      this.fetchMortalityRisk();
    },
  },
  mounted() {
    this.fetchPatientDetails(); // קריאה לפרטי המטופל בעת טעינת הקומפוננטה
    this.fetchMortalityRisk(); // קריאה לפרטי אחוזי תמותה בעת טעינת הקומפוננטה
  },
};
</script>

<style scoped>
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
  padding: 20px;
  gap: 20px;
  height: calc(100vh - 80px);
}

.left-section {
  display: flex;
  flex-direction: column;
  width: 30%;
  gap: 20px;
  height: 96%;
}

.top-left-container {
  flex: 7;
  background-image: url('https://img.freepik.com/premium-photo/full-frame-shot-old-paper_1048944-6592711.jpg');
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
  overflow: hidden;
}

.bottom-left-container {
  flex: 1;
  background: linear-gradient(135deg, #e0f7fa, #b2ebf2);
  border: 2px solid #00796b;
  border-radius: 10px;
  padding: 20px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

.section-title {
  font-size: 18px;
  font-weight: bold;
  color: #004d40;
  text-align: center;
}

.patient-info {
  display: flex;
  justify-content: space-between;
  padding: 10px 15px;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 8px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.patient-label {
  font-size: 16px;
  font-weight: bold;
  color: #00796b;
}

.patient-value {
  font-size: 16px;
  font-weight: bold;
  color: #004d40;
}

.right-section {
  flex: 2;
  height: 90%;
  background-color: #ffffff;
  border: 2px solid #004d40;
  border-radius: 10px;
  padding: 20px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}
</style>
