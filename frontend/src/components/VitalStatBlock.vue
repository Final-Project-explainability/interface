<template>
  <div class="vital-card">
    <!-- Percentage value display (with +/- coloring) -->
    <div class="vital-value" :class="valueClass">
      {{ Math.abs(value).toFixed(1) }}%
    </div>

    <!-- Feature label (formatted for readability) -->
    <div class="vital-label">
      {{ formatFeature(feature) }}
    </div>

    <!-- Progress bar representing the magnitude of the value -->
    <div class="vital-bar">
      <div class="vital-bar-fill" :style="barStyle" />
    </div>
  </div>
</template>

<script>
export default {
  name: "VitalStatBlock",
  props: {
    // Numeric value to display (positive or negative)
    value: { type: Number, required: true },
    // Feature name (as raw string, e.g., "click_through_rate")
    feature: { type: String, required: true },
  },
  computed: {
    // Determines CSS class based on whether value is positive or negative
    valueClass() {
      return this.value >= 0 ? "value-positive" : "value-negative";
    },
    // Dynamic style for the progress bar: width & color
    barStyle() {
      return {
        width: `${Math.min(Math.abs(this.value), 100)}%`,
        backgroundColor: this.value >= 0 ? "#ff4d4f" : "#52c41a", // Red for positive, green for negative
      };
    },
  },
  methods: {
    // Formats the feature string: replaces underscores & capitalizes words
    formatFeature(f) {
      return f
        .replace(/_/g, " ") // Replace underscores with spaces
        .replace(/\b[a-z]/g, (c) => c.toUpperCase()); // Capitalize each word
    },
  },
};
</script>

<style scoped>
/* Card container styling */
.vital-card {
  width: 140px;
  background: #ffffff;
  border: 1px solid #e8e8e8;
  border-radius: 12px;
  padding: 6px 6px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);
  font-family: "Inter", "Helvetica Neue", sans-serif;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  transition: box-shadow 0.3s ease
}

/* Hover effect for subtle card elevation */
.vital-card:hover {
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

/* Value display (large percentage text) */
.vital-value {
  font-size: 20px;
  font-weight: 700;
  line-height: 1;
}

/* Positive value color (red tone) */
.value-positive {
  color: #d32029;
}

/* Negative value color (green tone) */
.value-negative {
  color: #237804;
}

/* Feature label styling */
.vital-label {
  font-size: 13px;
  font-weight: 500;
  color: #555;
  text-align: center;
  line-height: 1.2;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 100%;
}

/* Background track for the progress bar */
.vital-bar {
  width: 100%;
  height: 8px;
  background: #f5f5f5;
  border-radius: 6px;
  overflow: hidden;
  margin-top: 6px;
  position: relative;
}

/* Filled portion of the progress bar */
.vital-bar-fill {
  height: 100%;
  transition: width 0.6s ease, background-color 0.3s ease;
  border-radius: 6px;
}
</style>