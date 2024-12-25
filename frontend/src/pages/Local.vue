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
          <h2>Latest Visit</h2>
          <p>Details of the latest appointment...</p>
        </div>
      </div>

      <!-- Right Section -->
      <div class="right-section">
        <h2>Patient Insights</h2>
        <p>This section displays deeper insights about the patient...</p>
      </div>
    </div>
  </div>
</template>

<script>
// ייבוא הקומפוננטות
import MenuBar from "../components/MenuBar.vue";
import MortalityRisk from "../components/MortalityRisk.vue";

// ייבוא הפונקציות מתוך local_functions.js
import {
  MockGetPatientPredictXGBOOST,
  MockGetPatientPredictDecisionTree,
  MockGetPatientPredictLogisticRegression,
  MockGetPatientDeatails,
  MockGetPatientExplanaition,
} from "../local_functions.js";

export default {
  name: "LocalPage",
  components: {
    MenuBar,
    MortalityRisk,
  },
  data() {
    return {
      selectedModel: "XGBOOST", // ברירת מחדל: מודל XGBOOST
      mortalityPercentage: 0, // אחוז תמותה ראשוני
    };
  },
  watch: {
    // צפייה בשינוי המודל הנבחר
    selectedModel() {
      this.fetchMortalityRisk();
    },
  },
  methods: {
    fetchMortalityRisk() {
      console.log("Selected Model:", this.selectedModel); // דיבאג
      if (this.selectedModel === "XGBOOST") {
        this.mortalityPercentage = MockGetPatientPredictXGBOOST();
      } else if (this.selectedModel === "DecisionTree") {
        this.mortalityPercentage = MockGetPatientPredictDecisionTree();
      } else if (this.selectedModel === "LogisticRegression") {
        this.mortalityPercentage = MockGetPatientPredictLogisticRegression();
      }
      console.log("Mortality Percentage:", this.mortalityPercentage); // דיבאג
    },
  },
  mounted() {
    this.fetchMortalityRisk(); // קריאה ראשונית בעת טעינת הקומפוננטה
  },
};
</script>


<style scoped>
/* כל שאר העיצוב נשאר כפי שהיה */
.local-page {
  display: flex;
  flex-direction: column;
  height: 100vh;
  font-family: Arial, sans-serif;
  background-color: #f9f9f9;
  overflow: hidden; /* מונע גלילה כללית */
}

.content-layout {
  display: flex;
  flex: 1;
  padding: 20px;
  gap: 20px;
  height: calc(100vh - 80px); /* התאמת הגובה למסך ללא גלילה */
}

.left-section {
  display: flex;
  flex-direction: column;
  width: 30%;
  gap: 20px;
  height: 96%;
}

.top-left-container {
  position: relative;
  flex: 7; /* 7/8 מהחלק השמאלי */
  background-image: url('https://img.freepik.com/premium-photo/full-frame-shot-old-paper_1048944-6592711.jpg'); /* הוספת תמונת רקע */
  background-size: cover; /* התאמה לרוחב ולגובה הקונטיינר */
  background-position: center; /* מיקום התמונה במרכז */
  background-repeat: no-repeat; /* מניעת חזרה על התמונה */
  border: 2px solid #004d40;
  border-radius: 10px;
  padding: 20px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: white; /* טקסט לבן */
  text-shadow: 0px 2px 4px rgba(0, 0, 0, 0.6);
  overflow: hidden;
}

/* שכבת חפיפה */
.top-left-container::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  border-radius: 10px;
  z-index: 1;
}

/* תוכן בתוך הקונטיינר */
.top-left-container > * {
  position: relative;
  z-index: 2;
}

.bottom-left-container {
  flex: 1; /* 1/8 מהחלק השמאלי */
  background-color: #eaf7f7;
  border: 2px solid #004d40;
  border-radius: 10px;
  padding: 20px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

.right-section {
  flex: 2;
  height: 90%; /* קיצור גובה הקונטיינר */
  background-color: #ffffff;
  border: 2px solid #004d40;
  border-radius: 10px;
  padding: 20px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  overflow: hidden; /* מניעת גלילה */
}
</style>
