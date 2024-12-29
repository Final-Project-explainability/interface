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
  MockGetPatientDeatails,
  MockGetPatientPredictXGBOOST,
  MockGetPatientPredictDecisionTree,
  MockGetPatientPredictLogisticRegression,
  MockIsPatientExist,
} from "../local_functions_mock.js";

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
    handlePatientSearch(query) {
      this.patientId = query;

      if (!MockIsPatientExist(this.patientId)) {
        this.errorMessage = "Patient with the given ID does not exist.";
        this.isDataVisible = false;
        this.mortalityPercentage = 0;
        this.searchQuery = "";
        return;
      }

      this.errorMessage = "";
      this.fetchPatientDetails();
      this.fetchMortalityRisk();
      this.isDataVisible = true;
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
    selectedModel() {
      if (this.isDataVisible) {
        this.fetchMortalityRisk();
      }
    },
  },
};
</script>

<style scoped>
/* לכל האלמנטים בקומפוננטה */
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

/* עיצוב כללי */
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

/* צד שמאל */
.left-section {
  display: flex;
  flex-direction: column;
  width: 25%;
  gap: 10px;
  height: 100%;
  min-width: 200px;
  max-width: 25%;
}

/* הודעת שגיאה */
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

/* סיכון תמותה */
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
  position: relative;
}

.right-content {
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  padding-right: 10px;
}

/* התאמות רספונסיביות */
@media (max-width: 768px) {
  .content-layout {
    flex-direction: column;
    gap: 20px;
  }

  .left-section {
    width: 100%;
    max-width: 100%;
  }

  .right-section {
    width: 100%;
    max-width: 100%;
  }
}

@media (min-width: 768px) and (max-width: 1024px) {
  .left-section {
    width: 30%;
    max-width: 30%;
  }

  .right-section {
    width: 70%;
    max-width: 70%;
  }
}

@media (min-width: 1200px) {
  .content-layout {
    gap: 20px;
  }

  .left-section {
    width: 20%;
    max-width: 20%;
  }

  .right-section {
    width: 80%;
    max-width: 80%;
  }
}

/* הודעת ריק */
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

/* הודעה ממורכזת */
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


<!--<style scoped>-->
<!--/* לכל האלמנטים בקומפוננטה */-->
<!--* {-->
<!--  box-sizing: border-box;-->
<!--  margin: 0;-->
<!--  padding: 0;-->
<!--}-->

<!--/* עיצוב כללי */-->
<!--.local-page {-->
<!--  display: flex;-->
<!--  flex-direction: column;-->
<!--  height: 100vh;-->
<!--  font-family: Arial, sans-serif;-->
<!--  background-color: #f9f9f9;-->
<!--  overflow: hidden;-->
<!--}-->

<!--.content-layout {-->
<!--  display: flex;-->
<!--  flex: 1;-->
<!--  padding: 0; /* ביטול Padding מיותר */-->
<!--  gap: 10px;-->
<!--  height: calc(100vh - 80px); /* מתאים את הגובה */-->
<!--  overflow: hidden;-->
<!--}-->

<!--/* צד שמאל */-->
<!--.left-section {-->
<!--  display: flex;-->
<!--  flex-direction: column;-->
<!--  width: 25%;-->
<!--  gap: 10px;-->
<!--  height: 100%;-->
<!--  min-width: 200px;-->
<!--  max-width: 25%;-->
<!--}-->

<!--/* הודעת שגיאה */-->
<!--.error-message {-->
<!--  font-size: 16px;-->
<!--  color: red;-->
<!--  text-align: center;-->
<!--  padding: 10px;-->
<!--  background-color: rgba(255, 0, 0, 0.1);-->
<!--  border: 1px solid red;-->
<!--  border-radius: 8px;-->
<!--  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);-->
<!--  margin: 10px 0; /* מרווחים נוספים מעל ומתחת להודעה */-->
<!--}-->

<!--/* חיפוש */-->
<!--.search-section {-->
<!--  margin-bottom: 10px;-->
<!--}-->

<!--/* החלק העליון */-->
<!--.top-left-container {-->
<!--  flex: 7;-->
<!--  background-image: url("https://st2.depositphotos.com/1250282/9455/v/950/depositphotos_94554184-stock-illustration-abstract-molecules-medical-background.jpg");-->
<!--  background-size: cover;-->
<!--  background-position: center;-->
<!--  border: 2px solid #004d40;-->
<!--  border-radius: 10px;-->
<!--  padding: 20px;-->
<!--  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);-->
<!--  display: flex;-->
<!--  flex-direction: column;-->
<!--  justify-content: center;-->
<!--  align-items: center;-->
<!--  color: white;-->
<!--  text-shadow: 0px 2px 4px rgba(0, 0, 0, 0.6);-->
<!--}-->

<!--/* צד ימין */-->
<!--.right-section {-->
<!--  flex: 3;-->
<!--  display: flex;-->
<!--  flex-direction: column;-->
<!--  gap: 10px;-->
<!--  background-color: #ffffff;-->
<!--  border: 2px solid #004d40;-->
<!--  border-radius: 10px;-->
<!--  padding: 0; /* ביטול Padding מיותר */-->
<!--  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);-->
<!--  height: 100%;-->
<!--  min-width: 400px;-->
<!--  max-width: 75%;-->
<!--  overflow: hidden;-->
<!--  position: relative;-->
<!--}-->

<!--/* החלק של פרטי המטופל */-->
<!--.patient-details {-->
<!--  margin: 0; /* ביטול מרווח חיצוני */-->
<!--  padding: 0; /* ביטול מרווח פנימי */-->
<!--}-->

<!--/* תצוגת SHAP ו-LIME */-->
<!--.shap-container, .lime-container {-->
<!--  display: flex;-->
<!--  justify-content: flex-start; /* יישור לשמאל */-->
<!--  flex-wrap: wrap;-->
<!--  gap: 15px;-->
<!--  margin: 0; /* ביטול מרווח חיצוני */-->
<!--  padding: 10px; /* הוספת Padding קטן לתחום */-->
<!--}-->

<!--.feature-container {-->
<!--  display: flex;-->
<!--  justify-content: flex-start;-->
<!--  align-items: center;-->
<!--  gap: 15px;-->
<!--  margin: 0;-->
<!--  padding: 0;-->
<!--}-->

<!--/* התאמות רספונסיביות */-->
<!--@media (max-width: 768px) {-->
<!--  .content-layout {-->
<!--    flex-direction: column;-->
<!--    gap: 20px;-->
<!--  }-->

<!--  .left-section {-->
<!--    width: 100%;-->
<!--    max-width: 100%;-->
<!--  }-->

<!--  .right-section {-->
<!--    width: 100%;-->
<!--    max-width: 100%;-->
<!--  }-->
<!--}-->

<!--@media (min-width: 768px) and (max-width: 1024px) {-->
<!--  .left-section {-->
<!--    width: 30%;-->
<!--    max-width: 30%;-->
<!--  }-->

<!--  .right-section {-->
<!--    width: 70%;-->
<!--    max-width: 70%;-->
<!--  }-->
<!--}-->

<!--@media (min-width: 1200px) {-->
<!--  .content-layout {-->
<!--    gap: 20px;-->
<!--  }-->

<!--  .left-section {-->
<!--    width: 20%;-->
<!--    max-width: 20%;-->
<!--  }-->

<!--  .right-section {-->
<!--    width: 80%;-->
<!--    max-width: 80%;-->
<!--  }-->
<!--}-->

<!--/* הודעת ריק */-->
<!--.info-message {-->
<!--  font-size: 16px;-->
<!--  color: #004d40;-->
<!--  text-align: center;-->
<!--  padding: 20px;-->
<!--  background-color: rgba(255, 255, 255, 0.8); /* רקע שקוף */-->
<!--  border: 1px solid #004d40; /* מסגרת עדינה */-->
<!--  border-radius: 8px;-->
<!--  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);-->
<!--}-->

<!--/* הודעה ממורכזת */-->
<!--.centered-message {-->
<!--  font-size: 18px;-->
<!--  font-family: "Open Sans", sans-serif;-->
<!--  font-weight: 600;-->
<!--  color: #444444;-->
<!--  text-align: center;-->
<!--  padding: 25px 20px;-->
<!--  background: #ffffff;-->
<!--  border: 1px solid #dddddd;-->
<!--  border-radius: 8px;-->
<!--  box-shadow: 0px 5px 15px rgba(0, 0, 0, 0.1);-->
<!--  margin: auto;-->
<!--  position: absolute;-->
<!--  top: 50%;-->
<!--  left: 50%;-->
<!--  transform: translate(-50%, -50%);-->
<!--  width: 80%;-->
<!--  max-width: 400px;-->
<!--}-->
<!--</style>-->
