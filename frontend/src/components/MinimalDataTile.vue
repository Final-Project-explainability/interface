<template>
  <div class="data-tile">
    <!-- Numerical value with dynamic color based on sign -->
    <div class="value" :style="{ color: getColor(value) }">
      {{ Math.abs(value).toFixed(1) }}%
    </div>

    <!-- Human-readable feature label -->
    <div class="label">{{ formatFeature(feature) }}</div>
  </div>
</template>

<script>
export default {
  name: "MinimalDataTile",
  props: {
    // Numerical value to display (positive/negative)
    value: Number,
    feature: String,
  },
  methods: {
    /**
     * Returns color based on value sign.
     * Red for positive, green for negative.
     * @param {number} val - The numerical value
     * @returns {string} HEX color code
     */
    getColor(val) {
      return val >= 0 ? "#cf1322" : "#389e0d";
    },
    /**
     * Formats feature string to "Title Case" and replaces underscores with spaces.
     * Example: 'heart_rate' -> 'Heart Rate'
     * @param {string} f - The feature string
     * @returns {string} Formatted feature label
     */
    formatFeature(f) {
      return f.replace(/_/g, " ").replace(/\b[a-z]/g, (c) => c.toUpperCase());
    },
  },
};
</script>

<style scoped>
/* Container for the tile */
.data-tile {
  width: 100px;
  padding: 10px;
  border-radius: 10px;
  background: #f9f9f9;
  text-align: center;
  font-family: 'Roboto', sans-serif;
  box-shadow: inset 0 0 0 1px #e0e0e0;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

/* Numerical value style */
.value {
  font-size: 16px;
  font-weight: 600;
}

/* Feature label style */
.label {
  font-size: 12px;
  color: #777;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>