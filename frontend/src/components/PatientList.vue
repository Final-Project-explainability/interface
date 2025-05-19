<template>
  <div class="patient-list-container">
    <div class="header">
      <h2>Patient List</h2>
    </div>

    <div class="content">
      <!-- Loading state -->
      <div v-if="loading" class="loading-message">
        <i class="fas fa-spinner fa-spin"></i> Loading patient data...
      </div>

      <!-- Error state -->
      <div v-else-if="error" class="error-message">
        <i class="fas fa-exclamation-circle"></i> {{ error }}
      </div>

      <!-- Patient list -->
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

      <!-- No data available -->
      <div v-else class="no-data-message">
        <i class="fas fa-info-circle"></i> No patient data available.
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, computed } from 'vue';
import { useRouter } from 'vue-router';
import Papa from 'papaparse';
import { useDataSourceStore } from '@/stores/dataSourceStore';

const router = useRouter();
const dataSourceStore = useDataSourceStore();

const loading = ref(true);
const error = ref("");
const patients = ref([]);


// Maps dataset names to file paths
const datasetMap = {
  "DataSet 1": "patients_details_DataSet1.json",
  "DataSet 2": "patients_details_DataSet2.json",
};

/**
 * Fetches patient data based on selected dataset.
 * Supports JSON and CSV formats.
 */
const fetchPatients = async () => {
  loading.value = true;
  error.value = "";
  patients.value = [];

  const datasetName = dataSourceStore.selectedDataset;
  const fileName = datasetMap[datasetName];
  if (!fileName) {
    error.value = `Unknown dataset: ${datasetName}`;
    loading.value = false;
    return;
  }

  try {
    const response = await fetch(`/data/${fileName}`);
    if (!response.ok) throw new Error("Failed to fetch file");

    const fileExtension = fileName.split('.').pop().toLowerCase();

    if (fileExtension === 'json') {
      const jsonData = await response.json();
      if (Array.isArray(jsonData)) {
        patients.value = jsonData;
      } else if (Array.isArray(jsonData.patients)) {
        patients.value = jsonData.patients;
      } else {
        throw new Error("Invalid JSON structure");
      }
      loading.value = false;
    } else if (fileExtension === 'csv') {
      const csvText = await response.text();
      Papa.parse(csvText, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          patients.value = results.data;
          loading.value = false;
        },
        error: (err) => {
          error.value = "Failed to parse CSV";
          console.error(err);
          loading.value = false;
        }
      });
    } else {
      throw new Error(`Unsupported file type: .${fileExtension}`);
    }
  } catch (err) {
    error.value = err.message;
    loading.value = false;
    console.error(err);
  }
};


// Re-fetch data when dataset changes (and on mount)
watch(
  () => dataSourceStore.selectedDataset,
  () => {
    fetchPatients();
  },
  { immediate: true }
);

const goToPatientPage = (id) => {
  router.push({ path: "/local", query: { patientId: id } });
};
</script>

<style scoped>
/* ==== Container Styles ==== */
.patient-list-container {
  padding: 32px 24px;
  background: #f6fbfd;
  border-radius: 16px;
  max-width: 900px;
  margin: 0 auto;
  font-family: "Segoe UI", sans-serif;
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.06);
}

/* ==== Header ==== */
.header h2 {
  font-size: 28px;
  font-weight: 700;
  color: #01579b;
  text-align: center;
  margin-bottom: 24px;
}

/* ==== Content Layout ==== */
.content {
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: 16px;
}

/* ==== States (loading, error, empty) ==== */
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

/* ==== Patient List ==== */
.patient-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
  max-height: 500px;
  overflow-y: auto;
  padding-right: 4px;
}

/* ==== Patient Card ==== */
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

/* ==== Patient Card Content ==== */
.patient-card-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

/* Icon style */
.patient-icon {
  font-size: 24px;
  color: #00acc1;
  margin-right: 12px;
}

/* Patient ID text */
.patient-details {
  flex-grow: 1;
}

.patient-id {
  font-size: 17px;
  font-weight: 600;
  color: #37474f;
}

/* Chevron arrow */
.arrow-icon {
  font-size: 18px;
  color: #90a4ae;
  transition: transform 0.2s ease;
}

.patient-card:hover .arrow-icon {
  transform: translateX(4px);
}

/* ==== Custom Scrollbar ==== */
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