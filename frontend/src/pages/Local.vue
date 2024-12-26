<template>
  <div class="local-page">
    <MenuBar />

    <div class="content-layout">
      <!-- צד שמאל -->
      <div class="left-section">
        <!-- החלק העליון -->
        <div class="top-left-container">
          <MortalityRisk
            :fetchMortalityRisk="fetchMortalityRisk"
            :mortalityPercentage="mortalityPercentage"
            v-model:selectedModel="selectedModel"
          />
        </div>

        <!-- החלק התחתון -->
        <PatientInfo :patientId="patientId" />
      </div>

      <!-- צד ימין -->
      <div class="right-section">
        <PatientDetails :patientData="patientDetails" />
        <PredictionExplanations />
      </div>
    </div>
  </div>
</template>

<script>
import MenuBar from "../components/MenuBar.vue";
import MortalityRisk from "../components/MortalityRisk.vue";
import PatientDetails from "../components/PatientDetails.vue";
import PredictionExplanations from "../components/PredictionExplanations.vue";
import PatientInfo from "../components/PatientInfo.vue"; // ייבוא הקומפוננטה החדשה

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
    PredictionExplanations,
    PatientInfo, // רישום הקומפוננטה
  },
  data() {
    return {
      selectedModel: "XGBOOST",
      mortalityPercentage: 0,
      patientDetails: {},
      patientId: "123456789", // מזהה מטופל
    };
  },
  methods: {
    fetchPatientDetails() {
      this.patientDetails = MockGetPatientDeatails(this.patientId);
    },
    fetchMortalityRisk() {
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
    selectedModel() {
      this.fetchMortalityRisk();
    },
  },
  mounted() {
    this.fetchPatientDetails();
    this.fetchMortalityRisk();
  },
};
</script>

<style scoped>
/* לכל האלמנטים בקומפוננטה */
* {
  box-sizing: border-box; /* מניעת חריגות */
  margin: 0;
  padding: 0;
}

/* עיצוב כללי */
.local-page {
  display: flex;
  flex-direction: column;
  height: 100vh; /* גובה מלא */
  font-family: Arial, sans-serif;
  background-color: #f9f9f9;
  overflow: hidden; /* מניעת גלישה */
}

.content-layout {
  display: flex;
  flex: 1;
  padding: 10px;
  gap: 10px;
  height: calc(100vh - 80px); /* גובה מותאם */
  overflow: hidden; /* מניעת גלישה */
}

/* צד שמאל */
.left-section {
  display: flex;
  flex-direction: column;
  width: 25%; /* צד שמאל תופס 25% מהרוחב */
  gap: 10px;
  height: 100%;
  min-width: 200px;
  max-width: 25%;
}

.top-left-container {
  flex: 7;
  background-image: url("https://png.pngtree.com/background/20210710/original/pngtree-minimalist-gradient-medical-background-picture-image_966366.jpg");
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

.bottom-left-container {
  flex: 1;
  background: linear-gradient(135deg, #e0f7fa, #b2ebf2);
  border: 2px solid #00796b;
  border-radius: 10px;
  padding: 20px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  justify-content: center;
}

/* צד ימין */
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
}

/* התאמות למסכים קטנים (רוחב עד 768px) */
@media (max-width: 768px) {
  .content-layout {
    flex-direction: column; /* מעבר לפריסה אנכית */
    gap: 20px; /* ריווח גדול יותר */
  }

  .left-section {
    width: 100%; /* צד שמאל תופס את כל הרוחב */
    max-width: 100%;
  }

  .right-section {
    width: 100%; /* צד ימין תופס את כל הרוחב */
    max-width: 100%;
  }

  .top-left-container {
    order: 2; /* שינוי סדר האלמנט */
  }

  .bottom-left-container {
    order: 1; /* שינוי סדר האלמנט */
  }
}

/* התאמות למסכים בינוניים (טאבלטים) */
@media (min-width: 768px) and (max-width: 1024px) {
  .left-section {
    width: 30%; /* צד שמאל תופס 30% מהרוחב */
    max-width: 30%;
  }

  .right-section {
    width: 70%; /* צד ימין תופס 70% מהרוחב */
    max-width: 70%;
  }
}

/* התאמות למסכים גדולים (מחשבים ומעלה - מעל 1200px) */
@media (min-width: 1200px) {
  .content-layout {
    gap: 20px;
  }

  .left-section {
    width: 20%; /* צד שמאל נשאר 20% */
    max-width: 20%;
  }

  .right-section {
    width: 80%; /* צד ימין תופס 80% */
    max-width: 80%;
  }
}
</style>



