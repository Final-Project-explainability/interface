<template>
  <div class="patient-details">
    <ul>
      <li><strong>Heart Rate:</strong> 75 bpm</li>
      <li><strong>Blood Pressure:</strong> 120/80</li>
      <li><strong>BMI:</strong> 21.5</li>
      <li><strong>Age:</strong> 43</li>
      <li><strong>Fever:</strong> 36.8°C</li>
      <li><strong>Weight:</strong> 81 kg</li>
      <li><strong>Gender:</strong> Male</li>
    </ul>
  </div>
</template>

<script>
export default {
  name: "PatientDetails",
};
</script>

<style scoped>
.patient-details {
  height: 100%; /* תופס את כל הגובה */
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.patient-details ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.patient-details li {
  font-size: 14px;
  color: #333;
  margin-bottom: 5px;
}

.patient-details strong {
  color: #004d40;
}
</style>
