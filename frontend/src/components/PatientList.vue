<template>
  <div class="patient-list-container">
    <!-- כותרת -->
    <div class="header">
      <h2>Patient List</h2>
    </div>

    <!-- תוכן -->
    <div class="content">
      <!-- טעינה -->
      <div v-if="loading" class="loading-message">
        <i class="fas fa-spinner fa-spin"></i> Loading patient data...
      </div>

      <!-- שגיאה -->
      <div v-else-if="error" class="error-message">
        <i class="fas fa-exclamation-circle"></i> {{ error }}
      </div>

      <!-- רשימת מטופלים -->
      <div v-else-if="patients.length > 0" class="patient-list">
        <div
          v-for="(patient, index) in patients"
          :key="index"
          @click="goToPatientPage(patient.patient_id)"
          class="patient-card"
        >
          <div class="patient-card-content">
            <i class="fas fa-user-injured patient-icon"></i>
            <div class="patient-details">
              <span class="patient-id">Patient ID: {{ patient.patient_id }}</span>
            </div>
            <i class="fas fa-chevron-right arrow-icon"></i>
          </div>
        </div>
      </div>

      <!-- אין נתונים -->
      <div v-else class="no-data-message">
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
.patient-list-container {
  padding: 32px 24px;
  background: #f6fbfd;
  border-radius: 16px;
  max-width: 900px;
  margin: 0 auto;
  font-family: "Segoe UI", sans-serif;
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.06);
}

/* כותרת */
.header h2 {
  font-size: 28px;
  font-weight: 700;
  color: #01579b;
  text-align: center;
  margin-bottom: 24px;
}

/* תוכן */
.content {
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: 16px;
}

/* הודעות */
.loading-message,
.error-message,
.no-data-message {
  font-size: 17px;
  text-align: center;
  padding: 14px 20px;
  border-radius: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
  max-width: 500px;
  margin: 0 auto;
}

.loading-message {
  background: #e3f2fd;
  color: #0275d8;
}

.error-message {
  background: #fdecea;
  color: #c0392b;
  font-weight: bold;
}

.no-data-message {
  background: #f1f1f1;
  color: #607d8b;
}

/* רשימת מטופלים */
.patient-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
  max-height: 500px;
  overflow-y: auto;
  padding-right: 4px;
}

/* כרטיס מטופל */
.patient-card {
  background: white;
  border-radius: 12px;
  padding: 16px 20px;
  box-shadow: 0 4px 10px rgba(0, 188, 212, 0.08);
  transition: all 0.2s ease;
  cursor: pointer;
  border-left: 5px solid #00acc1;
}

.patient-card:hover {
  background: #e1f5fe;
  transform: translateX(3px);
  box-shadow: 0 8px 16px rgba(0, 188, 212, 0.12);
}

/* תוכן פנימי של כרטיס */
.patient-card-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.patient-icon {
  font-size: 24px;
  color: #00acc1;
  margin-right: 12px;
}

.patient-details {
  flex-grow: 1;
}

.patient-id {
  font-size: 17px;
  font-weight: 600;
  color: #37474f;
}

.arrow-icon {
  font-size: 18px;
  color: #90a4ae;
  transition: transform 0.2s ease;
}

.patient-card:hover .arrow-icon {
  transform: translateX(4px);
}

/* גלילה מותאמת */
.patient-list::-webkit-scrollbar {
  width: 8px;
}
.patient-list::-webkit-scrollbar-thumb {
  background-color: #b0bec5;
  border-radius: 4px;
}
.patient-list::-webkit-scrollbar-thumb:hover {
  background-color: #78909c;
}
</style>
