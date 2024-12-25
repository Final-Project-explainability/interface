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
import MenuBar from "../components/MenuBar.vue";
import MortalityRisk from "../components/MortalityRisk.vue";

export default {
  name: "LocalPage",
  components: {
    MenuBar,
    MortalityRisk,
  },
  data() {
    return {
      selectedModel: "XGBOOST", // Default model
      mortalityPercentage: 86, // Default mortality percentage
    };
  },
  watch: {
    // Watch for changes in selectedModel and call fetchMortalityRisk
    selectedModel() {
      this.fetchMortalityRisk();
    },
  },
  methods: {
    MockGetPatientPredictXGBOOST() {
      return 86; // Return example mortality percentage
    },
    MockGetPatientPredictDecisionTree() {
      return 20; // Return example mortality percentage
    },
    MockGetPatientPredictLogisticRegression() {
      return 64; // Return example mortality percentage
    },
    fetchMortalityRisk() {
      if (this.selectedModel === "XGBOOST") {
        this.mortalityPercentage = this.MockGetPatientPredictXGBOOST();
      } else if (this.selectedModel === "DecisionTree") {
        this.mortalityPercentage = this.MockGetPatientPredictDecisionTree();
      } else if (this.selectedModel === "LogisticRegression") {
        this.mortalityPercentage = this.MockGetPatientPredictLogisticRegression();
      }
    },
  },
  mounted() {
    this.fetchMortalityRisk(); // Initialize the percentage based on default model
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
  flex: 3;
  height: 50%; /* הגדרת גובה מוגבל */
  //background-image: url('https://designshack.net/wp-content/uploads/black-texture-background-368x245.jpg'); /* הוספת תמונת רקע */
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
  flex: 1;
  height: 30%; /* קיצור גובה הקונטיינר */
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
