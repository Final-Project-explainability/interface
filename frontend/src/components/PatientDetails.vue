<template>
  <div class="patient-details-container">
    <h2 class="section-title">Patient Details</h2>
    <div class="details-slider">
      <div class="details-items" ref="slider">
        <PatientDetailItem
          v-for="(value, key, index) in patientData"
          :key="index"
          :title="formatKey(key)"
          :value="value"
        />
      </div>
    </div>
  </div>
</template>

<script>
import PatientDetailItem from "./PatientDetailItem.vue";

export default {
  name: "PatientDetails",
  components: {
    PatientDetailItem,
  },
  props: {
    patientData: {
      type: Object,
      required: true,
    },
  },
  methods: {
    formatKey(key) {
      return key
        .replace(/_/g, " ") // החלפת _ ברווחים
        .replace(/\b[a-z]/g, (char) => char.toUpperCase()); // אותיות ראשונות לגדולות
    },
  },
};
</script>

<style scoped>
.patient-details-container {
  background: #f4f6f8; /* צבע רקע בהיר */
  border-radius: 12px;
  padding: 15px;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1); /* צל עדין */
  margin-bottom: 20px;
}

.section-title {
  font-size: 18px;
  font-weight: bold;
  text-align: left;
  color: #333333;
  margin-bottom: 10px;
}

.details-slider {
  overflow-x: auto;
  white-space: nowrap;
  padding: 10px;
  background: #e9e9e9; /* רקע אפור בהיר */
  border-radius: 8px;
}

.details-items {
  display: flex;
  gap: 10px;
}
</style>
