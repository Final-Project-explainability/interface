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
}

.content-layout {
  display: flex;
  flex: 1;
  padding: 20px;
  gap: 20px;
}

.left-section {
  display: flex;
  flex-direction: column;
  width: 30%;
  gap: 20px;
}

/* קונטיינר עליון שמאלי */
.top-left-container {
  position: relative; /* כדי שנוכל להשתמש ב-::before */
  flex: 3;
  //background-image: url("https://media0.giphy.com/media/v1.Y2lkPTc5MGI3NjExeHV3eno2a2F4aDRraHpibzF2cTI0NHM4MGdqOGl4eTByZWswZzY3dyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/TTWnfO964s245vzY4e/giphy.webp");
  //background-image: url("https://media2.giphy.com/media/v1.Y2lkPTc5MGI3NjExYzhzODh5bGZ2M2t1YnRpZnhyZ3JsbjByeWpsa20zMDRvNG8ydndwcSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/3bc8pP1rVdfgN1uoMV/giphy.webp");
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
  color: white; /* טקסט לבן */
  text-shadow: 0px 2px 4px rgba(0, 0, 0, 0.6);
  overflow: hidden; /* מוודא שהשכבה לא תחרוג מגבולות הקונטיינר */
}

/* שכבת חפיפה */
.top-left-container::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  //background: rgba(164, 164, 164, 0.4); /* שכבה דהויה בצבע שחור עם שקיפות */
  border-radius: 10px; /* מתאימה את הצורה לשוליים המעוגלים */
  z-index: 1; /* גורמת לשכבה להיות מעל הרקע */
}

/* תוכן בתוך הקונטיינר */
.top-left-container > * {
  position: relative; /* התוכן יהיה מעל שכבת החפיפה */
  z-index: 2;
}

.bottom-left-container {
  flex: 1;
  background-color: #eaf7f7;
  border: 2px solid #004d40;
  border-radius: 10px;
  padding: 20px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

.right-section {
  flex: 2;
  background-color: #ffffff;
  border: 2px solid #004d40;
  border-radius: 10px;
  padding: 20px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}
</style>
