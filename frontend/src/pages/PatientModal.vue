<template>
  <div class="modal">
    <div class="modal-content">
      <span class="close-button" @click="$emit('onClose')">&times;</span>
      <h2 class="modal-title">Patient List</h2>

      <!-- טעינה -->
      <div v-if="loading" class="loading-message">
        Loading patient data...
      </div>

      <!-- הודעת שגיאה -->
      <div v-if="error" class="error-message">
        {{ error }}
      </div>

      <!-- הצגת רשימת המטופלים -->
      <div v-if="!loading && patients.length > 0" class="patient-list">
        <ul>
          <li
            v-for="(patient, index) in patients"
            :key="index"
            @click="goToPatientPage(patient.patient_id)"
            class="patient-card"
          >
            <div class="patient-card-content">
<!--              <i class="icon-id">🆔</i>-->
              <span class="patient-id">ID: {{ patient.patient_id }}</span>
            </div>
          </li>
        </ul>
      </div>

      <!-- הודעה אם אין נתונים -->
      <div v-else-if="!loading && patients.length === 0">
        <p class="no-data-message">No patient data available.</p>
      </div>
    </div>
  </div>
</template>

<script>
import Papa from "papaparse";

export default {
  name: "PatientModal",
  props: {
    showModal: {
      type: Boolean,
      required: true,
    },
  },
  data() {
    return {
      loading: true, // מצב טעינה
      error: "", // הודעת שגיאה
      patients: [], // רשימת המטופלים
    };
  },
  methods: {
    async fetchPatients() {
      try {
        const response = await fetch("/project_data/example_test_data.csv");
        if (!response.ok) {
          throw new Error("Failed to fetch patient data");
        }
        const csvText = await response.text();
        Papa.parse(csvText, {
          header: true,
          skipEmptyLines: true,
          complete: (results) => {
            this.patients = results.data;
            this.loading = false;
          },
          error: (error) => {
            this.error = "Failed to parse CSV file";
            console.error(error);
            this.loading = false;
          },
        });
      } catch (error) {
        this.error = error.message;
        console.error(error);
        this.loading = false;
      }
    },
    goToPatientPage(patientId) {
      // ניווט לדף Local עם מזהה המטופל
      this.$router.push({ path: "/local", query: { patientId } });
    },
  },
  mounted() {
    this.fetchPatients(); // טעינת המטופלים כאשר הקומפוננטה נטענת
  },
};
</script>

<style scoped>
/* עיצוב ה-Modal הכללי */
.modal {
  position: fixed;
  z-index: 1000;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.6); /* רקע כהה שקוף */
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-content {
  background: white;
  padding: 20px;
  border-radius: 15px;
  width: 50%;
  max-width: 600px;
  text-align: center;
  position: relative;
  box-shadow: 0px 4px 15px rgba(0, 0, 0, 0.3); /* צל מסביב */
  display: flex;
  flex-direction: column;
  align-items: center;
}

.modal-title {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 15px;
  color: #333333;
}

.close-button {
  position: absolute;
  top: 10px;
  right: 20px;
  font-size: 24px;
  font-weight: bold;
  color: #666;
  cursor: pointer;
}

.close-button:hover {
  color: #000;
}

/* עיצוב הרשימה */
.patient-list {
  max-height: 300px; /* גובה מקסימלי */
  overflow-y: auto; /* גלילה אנכית */
  width: 100%;
  padding: 10px;
  background-color: #f9f9f9;
  border-radius: 10px;
}

/* עיצוב הכרטיסיות של המטופלים */
.patient-card {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  background-color: #ffffff;
  padding: 15px;
  margin: 10px 0;
  border-radius: 12px;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1); /* צל קל */
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  border: 1px solid #eee; /* גבול עדין */
}

.patient-card:hover {
  transform: translateY(-2px); /* אפקט התרוממות */
  box-shadow: 0px 6px 10px rgba(0, 0, 0, 0.2); /* צל מודגש */
  background-color: #f0f8ff; /* רקע כחול בהיר */
}

.patient-card-content {
  display: flex;
  align-items: center;
  gap: 12px; /* רווח בין האייקון ל-ID */
}

.icon-id {
  font-size: 18px;
  color: #0275d8; /* צבע כחול */
}

.patient-id {
  font-size: 16px;
  font-weight: bold;
  color: #333;
}

/* עיצוב הודעה כאשר אין נתונים */
.no-data-message {
  font-size: 16px;
  color: #666;
  margin-top: 10px;
  text-align: center;
}

/* עיצוב הודעת טעינה ושגיאה */
.loading-message,
.error-message {
  font-size: 16px;
  color: #d9534f; /* אדום נעים */
  margin: 20px 0;
  text-align: center;
}

.error-message {
  font-weight: bold;
}

.loading-message {
  color: #0275d8; /* כחול נעים */
}

/* גלילה מותאמת אישית */
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-thumb {
  background-color: #888;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background-color: #555;
}
</style>
