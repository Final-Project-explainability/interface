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
          :icon="getItemVisualConfig(key).icon"
          :backgroundColor="getItemVisualConfig(key).backgroundColor"
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
    getItemVisualConfig: {
      type: Function,
      default: () => () => ({}), // fallback ל־function ריקה אם לא הועבר
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
  background: #f9fafb; /* צבע רקע בהיר מאוד */
  border-radius: 16px; /* פינות עגלגלות יותר */
  padding: 20px;
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.08); /* צל עדין יותר */
  margin-bottom: 0px;
}

.section-title {
  font-size: 20px;
  font-weight: 600;
  text-align: left;
  color: #2c3e50; /* צבע כהה יותר לכותרת */
  margin-bottom: 15px;
  margin-top: 0;
}

.details-slider {
  overflow-x: auto;
  white-space: nowrap;
  padding: 12px 0;
  //background: #ffffff; /* רקע לבן */
  border-radius: 12px;
  //box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1); /* צל עדין */
}

.details-items {
  display: flex;
  gap: 20px;
}

.details-items > * {
  flex-shrink: 0; /* שלא יתקמטו */
}

.patient-detail-item {
  background: #ffffff;
  padding: 12px 16px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.08);
  width: 180px;
  min-width: 180px;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.patient-detail-item:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.patient-details-container {
  background: #f9fafb;
  border-radius: 16px;
  padding: 20px;
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.08);
  margin-bottom: 11px;

  /* תוספות: */
  border: 1px solid #e3e8ee; /* צבע מסגרת עדין */
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.03); /* צל עדין יותר */
}

</style>
