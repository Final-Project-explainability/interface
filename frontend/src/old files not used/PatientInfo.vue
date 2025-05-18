<template>
  <div class="patient-info-container">
    <h2 class="section-title">Patient Information</h2>
    <div class="patient-info">
      <span class="patient-label">Patient ID:</span>
      <span class="patient-value">{{ patientId }}</span>
    </div>
  </div>
</template>

<script>
export default {
  name: "PatientInfo",
  props: {
    patientId: {
      type: String,
      required: true,
    },
  },
};
</script>

<style scoped>
.patient-info-container {
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

.section-title {
  font-size: 18px;
  font-weight: bold;
  color: #004d40;
  text-align: center;
  margin-bottom: 10px;
}

.patient-info {
  display: flex;
  justify-content: space-between;
  padding: 10px 15px;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 8px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.patient-label {
  font-size: 16px;
  font-weight: bold;
  color: #00796b;
}

.patient-value {
  font-size: 16px;
  font-weight: bold;
  color: #004d40;
}
</style>
