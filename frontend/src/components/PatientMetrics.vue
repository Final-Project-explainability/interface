<template>
  <div class="patient-metrics">
    <h2>Patient Data</h2>
    <div class="metrics-container">
      <div class="metric" v-for="metric in metrics" :key="metric.name">
        <div class="metric-name">{{ metric.name }}</div>
        <div class="metric-value">{{ metric.value }}</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "PatientMetrics",
  data() {
    return {
      metrics: [
        { name: "Heart Rate", value: "75 bpm" },
        { name: "Blood Pressure", value: "120/80" },
        { name: "BMI", value: "21.5" },
        { name: "Age", value: "43" },
        { name: "Fever", value: "36.8°C" },
        { name: "Weight", value: "81 kg" },
        { name: "Gender", value: "Male" },
      ],
    };
  },
};
</script>

<style scoped>
.patient-metrics {
  text-align: center;
}

.metrics-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 20px;
  margin-top: 20px;
}

.metric {
  background-color: #ffffff;
  border: 2px solid #004d40;
  border-radius: 10px;
  padding: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.metric-name {
  font-size: 14px;
  color: #004d40;
  margin-bottom: 5px;
}

.metric-value {
  font-size: 18px;
  color: #333;
  font-weight: bold;
}
</style>
