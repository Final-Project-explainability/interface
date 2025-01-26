<template>
  <div class="patient-list-container">
    <!-- כותרת הדף -->
    <div class="header">
      <h2>Patient List</h2>
    </div>

    <!-- תוכן הדף -->
    <div class="content">
      <!-- הודעת טעינה -->
      <div v-if="loading" class="loading-message">
        <i class="fas fa-spinner fa-spin"></i> Loading patient data...
      </div>

      <!-- הודעת שגיאה -->
      <div v-if="error" class="error-message">
        <i class="fas fa-exclamation-circle"></i> {{ error }}
      </div>

      <!-- רשימת המטופלים -->
      <div v-if="!loading && patients.length > 0" class="patient-list">
        <ul>
          <li
            v-for="(patient, index) in patients"
            :key="index"
            @click="goToPatientPage(patient.patient_id)"
            class="patient-card"
          >
            <div class="patient-card-content">
              <span class="patient-id">
                <i class="fas fa-user"></i> ID: {{ patient.patient_id }}
              </span>
            </div>
          </li>
        </ul>
      </div>

      <!-- הודעה אם אין נתונים -->
      <div v-else-if="!loading && patients.length === 0" class="no-data-message">
        <i class="fas fa-info-circle"></i> No patient data available.
      </div>
    </div>
  </div>
</template>

<script>
import Papa from "papaparse";

export default {
  name: "PatientList",
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
    this.fetchPatients(); // קריאת המטופלים כאשר הקומפוננטה נטענת
  },
};
</script>

<style scoped>
/* מכולת הדף */
.patient-list-container {
  padding: 30px;
  background: linear-gradient(to right, #e3f2fd, #f9f9f9);
  border-radius: 15px;
  box-shadow: 0px 6px 15px rgba(0, 0, 0, 0.1);
  max-width: 900px;
  margin: 0 auto;
  font-family: "Arial", sans-serif;
}

/* כותרת */
.header h2 {
  font-size: 28px;
  font-weight: bold;
  color: #2c3e50;
  text-align: center;
  margin-bottom: 20px;
}

/* תוכן */
.content {
  display: flex;
  flex-direction: column;
  align-items: center;
}

/* רשימת המטופלים */
.patient-list {
  width: 100%;
  max-height: 500px;
  overflow-y: auto;
  background: white;
  padding: 15px;
  border-radius: 12px;
  border: 1px solid #e0e0e0;
}

/* כרטיסיות מטופלים */
.patient-card {
  display: flex;
  align-items: center;
  background: #ffffff;
  padding: 15px;
  margin-bottom: 10px;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.patient-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.2);
  background: #f1f8ff;
}

/* תוכן הכרטיסיה */
.patient-card-content {
  display: flex;
  align-items: center;
}

.patient-id {
  font-size: 18px;
  font-weight: bold;
  color: #34495e;
}

/* הודעת טעינה */
.loading-message {
  font-size: 18px;
  color: #0275d8;
  text-align: center;
  display: flex;
  align-items: center;
  gap: 10px;
}

/* הודעת שגיאה */
.error-message {
  font-size: 18px;
  color: #e74c3c;
  font-weight: bold;
  text-align: center;
  margin: 20px 0;
  display: flex;
  align-items: center;
  gap: 10px;
}

/* הודעה אם אין נתונים */
.no-data-message {
  font-size: 18px;
  color: #7f8c8d;
  margin-top: 20px;
  text-align: center;
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