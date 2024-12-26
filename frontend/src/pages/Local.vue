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

        <!-- החלק העליון -->
        <div class="top-left-container">
          <MortalityRisk
            :fetchMortalityRisk="fetchMortalityRisk"
            :mortalityPercentage="mortalityPercentage"
            v-model:selectedModel="selectedModel"
          />
        </div>

        <!-- החלק התחתון -->
        <div>
          <!-- הצגת פרטי המטופל רק אם בוצע חיפוש -->
          <PatientInfo v-if="isDataVisible" :patientId="patientId" />
          <!-- הודעת ברירת מחדל אם לא בוצע חיפוש -->
          <div v-else class="info-message">
            Please enter a patient's ID to display details.
          </div>
        </div>
      </div>

      <!-- צד ימין -->
      <div class="right-section">
        <PatientDetails v-if="isDataVisible" :patientData="patientDetails" />
        <PredictionExplanations v-if="isDataVisible" />
        <div v-else class="centered-message">
          Please enter a patient's ID in the search bar to display information.
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
      selectedModel: "XGBOOST",
      mortalityPercentage: 0, // אחוזי תמותה ברירת מחדל (0%)
      patientDetails: {
        // ערכי ברירת מחדל לנתוני מטופל
        name: "No Data",
        age: 0,
        gender: "Unknown",
        diagnosis: "No Data",
      },
      patientId: "", // מזהה מטופל (מתחיל כריק)
      isDataVisible: false, // מצב ראשוני: הסתרת פרטי מטופל ו-SHAP/LIME
      errorMessage: "", // הודעת שגיאה למקרה של ID לא תקין
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
      console.log("Searching for patient:", query); // לוגיקת החיפוש
      this.patientId = query; // עדכון מזהה המטופל

      // בדיקה אם המטופל קיים
      if (!MockIsPatientExist(this.patientId)) {
        this.errorMessage = "Patient with the given ID does not exist."; // הודעת שגיאה
        this.isDataVisible = false; // מסתיר נתונים
        this.mortalityPercentage = 0; // מאפס את אחוזי התמותה
        this.searchQuery = ""; // מנקה את תיבת החיפוש
        return; // מפסיק את ביצוע הפונקציה
      }
      // אם המטופל קיים, ממשיכים לטעינת הנתונים
      this.errorMessage = ""; // מנקה הודעת שגיאה

      this.fetchPatientDetails(); // עדכון נתוני המטופל
      this.fetchMortalityRisk(); // עדכון נתוני המורטליטי
      this.isDataVisible = true; // הפיכת המידע לנראה
      this.searchQuery = ""; // מנקה את תיבת החיפוש
    },
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
  height: calc(100vh - 80px); /* מתאים את הגובה */
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
  margin: 10px 0; /* מרווחים נוספים מעל ומתחת להודעה */
}


.search-section {
  margin-bottom: 10px;
}

/* החלק העליון */
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
  overflow-y: auto; /* גלילה אנכית */
  overflow-x: hidden; /* הסתרת גלילה אופקית */
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
  background-color: rgba(255, 255, 255, 0.8); /* רקע שקוף */
  border: 1px solid #004d40; /* מסגרת עדינה */
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