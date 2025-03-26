
<template>
  <div class="vital-card">
    <!-- ערך אחוז -->
    <div class="vital-value" :class="valueClass">
      {{ Math.abs(value).toFixed(1) }}%
    </div>

    <!-- שם הפיצ׳ר -->
    <div class="vital-label">
      {{ formatFeature(feature) }}
    </div>

    <!-- פס מדידה -->
    <div class="vital-bar">
      <div class="vital-bar-fill" :style="barStyle" />
    </div>
  </div>
</template>

<script>
export default {
  name: "VitalStatBlock",
  props: {
    value: { type: Number, required: true },
    feature: { type: String, required: true },
  },
  computed: {
    valueClass() {
      return this.value >= 0 ? "value-positive" : "value-negative";
    },
    barStyle() {
      return {
        width: `${Math.min(Math.abs(this.value), 100)}%`,
        backgroundColor: this.value >= 0 ? "#ff4d4f" : "#52c41a",
      };
    },
  },
  methods: {
    formatFeature(f) {
      return f
        .replace(/_/g, " ")
        .replace(/\b[a-z]/g, (c) => c.toUpperCase());
    },
  },
};
</script>

<style scoped>
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

.vital-card:hover {
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.vital-value {
  font-size: 20px;
  font-weight: 700;
  line-height: 1;
}

.value-positive {
  color: #d32029;
}

.value-negative {
  color: #237804;
}

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

.vital-bar {
  width: 100%;
  height: 8px;
  background: #f5f5f5;
  border-radius: 6px;
  overflow: hidden;
  margin-top: 6px;
  position: relative;
}

.vital-bar-fill {
  height: 100%;
  transition: width 0.6s ease, background-color 0.3s ease;
  border-radius: 6px;
}
</style>