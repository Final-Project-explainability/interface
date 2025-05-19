<template>
  <div class="patient-details-container">
    <h2 class="section-title">Patient Details</h2>

    <div class="details-slider">
      <div class="details-items" ref="slider">
        <!-- Render PatientDetailItem for each patient data key-value -->
        <PatientDetailItem
          v-for="(value, key, index) in filteredPatientData"
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
    // Patient data object (key-value pairs)
    patientData: {
      type: Object,
      required: true,
    },
    // Function that returns visual config for each key (icon, backgroundColor)
    getItemVisualConfig: {
      type: Function,
      default: () => () => ({}), // Fallback empty function
    },
    // Search string to filter patient data by key or value
    searchQuery: {
      type: String,
      default: "",
    },
  },
  computed: {
    /**
     * Filters patient data based on search query.
     * Matches either key names or values (case insensitive).
     */
    filteredPatientData() {
      const result = {};
      const query = (this.searchQuery || "").toLowerCase(); // Defensive null handling

      for (const [key, value] of Object.entries(this.patientData || {})) {
        const keyMatch = key.toLowerCase().includes(query);
        const valueMatch = String(value).toLowerCase().includes(query);
        if (!query || keyMatch || valueMatch) {
          result[key] = value;
        }
      }

      return result;
    },
  },
  methods: {
    /**
     * Converts key names from snake_case to Title Case.
     * Example: "heart_rate" -> "Heart Rate"
     */
    formatKey(key) {
      return key
        .replace(/_/g, " ") // Replace underscores with spaces
        .replace(/\b[a-z]/g, (char) => char.toUpperCase()); // Capitalize first letter
    },
  },
};
</script>

<style scoped>
/* ==== Main Container ==== */
.patient-details-container {
  background: #f9fafb;
  border-radius: 16px;
  padding: 20px;
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.08);
  margin-bottom: 0px;
}

/* ==== Section Title ==== */
.section-title {
  font-size: 20px;
  font-weight: 600;
  text-align: left;
  color: #2c3e50;
  margin-bottom: 15px;
  margin-top: 0;
}

/* ==== Horizontal Scroll Slider ==== */
.details-slider {
  overflow-x: auto;
  white-space: nowrap;
  padding: 12px 0;
  border-radius: 12px;
}

/* ==== Items Container (flex layout) ==== */
.details-items {
  display: flex;
  gap: 20px;
}

/* Prevent items from shrinking */
.details-items > * {
  flex-shrink: 0;
}

/* ==== Legacy .patient-detail-item styles (should be removed if using PatientDetailItem.vue instead) ==== */
.patient-detail-item {
  background: #ffffff;
  padding: 12px 16px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.08);
  width: 180px;
  min-width: 180px;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

/* Hover effect for card */
.patient-detail-item:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.patient-details-container {
  background: #f9fafb;
  border-radius: 16px;
  padding: 20px;
  margin-bottom: 11px;
  border: 1px solid #e3e8ee;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.03);
}
</style>