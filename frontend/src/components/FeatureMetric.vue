<template>
  <div class="feature-metric">
    <!-- Title & Toggle Switch -->
    <div class="header-glass-centered">
      <h2>Correlation</h2>

      <div class="glass-toggle-wrapper">
        <div class="glass-toggle">
          <!-- Animated background for toggle slider -->
          <div class="slider-bg" :class="{ right: !showAgreement }"></div>

          <!-- Agreement button -->
          <button
            :class="{ active: showAgreement }"
            @click="showAgreement = true"
          >
            Agreement
          </button>

          <!-- Disagreement button -->
          <button
            :class="{ active: !showAgreement }"
            @click="showAgreement = false"
          >
            Disagreement
          </button>
        </div>
      </div>
    </div>

    <!-- Feature list with dynamic values (agreement/disagreement) -->
    <ul class="feature-list">
      <li v-for="feature in displayedFeatures" :key="feature.name">
        <span class="feature-name">{{ feature.name }}</span>
        <span
          class="feature-value"
          :class="showAgreement ? 'agreement' : 'disagreement'"
        >
          {{ showAgreement ? feature.agreement : feature.disagreement }}%
        </span>
      </li>
    </ul>
  </div>
</template>

<script>
import featureData from "../../public/data/JSON/global_correlation.json";

export default {
  name: "FeatureMetric",
  props: {
    selectedModel: String, // Input prop to select model key from JSON
  },
  data() {
    return {
      showAgreement: true // Default view: Agreement values
    };
  },
  computed: {
    // Computed property to return the sorted feature list based on toggle state
    displayedFeatures() {
      const modelFeatures = featureData[this.selectedModel] || [];

      // Sort features descending by agreement or disagreement depending on toggle
      return modelFeatures.sort((a, b) =>
        this.showAgreement ? b.agreement - a.agreement : b.disagreement - a.disagreement
      );
    }
  }
};
</script>

<style scoped>
/* === Main container === */
.feature-metric {
  display: flex;
  flex-direction: column;
  height: 100%;
  background: #ffffff;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.06);
  overflow-y: auto;
  scroll-behavior: smooth;
  font-family: "Segoe UI", "Roboto", sans-serif;
  direction: rtl; /* Scrollbar on the left side */
}

/* Override content inside back to LTR */
.feature-metric * {
  direction: ltr;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  padding-bottom: 12px;
  border-bottom: 2px solid #eeeeee;
}

.header h2 {
  font-size: 22px;
  font-weight: 600;
  color: #333;
  margin: 0;
}

.toggle-container {
  display: flex;
  align-items: center;
  gap: 8px;
  background-color: #f1f1f1;
  border-radius: 20px;
  padding: 4px 10px;
}

.toggle-label {
  font-size: 14px;
  font-weight: 500;
  color: #444;
}

/* Toggle Switch */
.switch {
  position: relative;
  display: inline-block;
  width: 40px;
  height: 22px;
}

.switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.slider {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ccc;
  transition: 0.3s;
  border-radius: 34px;
}

.slider:before {
  position: absolute;
  content: "";
  height: 16px;
  width: 16px;
  left: 3px;
  bottom: 3px;
  background-color: white;
  transition: 0.3s;
  border-radius: 50%;
}

input:checked + .slider {
  background-color: #00b894;
}

input:checked + .slider:before {
  transform: translateX(18px);
}

.feature-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.feature-list li {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 4px;
  border-bottom: 1px solid #f0f0f0;
  transition: background 0.2s ease;
}

.feature-list li:hover {
  background-color: #f9f9f9;
  border-radius: 8px;
}

/* Feature name text */
.feature-name {
  font-size: 15px;
  color: #333;
  font-weight: 500;
}

/* Feature value (agreement/disagreement %) */
.feature-value {
  font-size: 15px;
  font-weight: bold;
  min-width: 50px;
  text-align: right;
}

/* Color for Agreement values */
.feature-value.agreement {
  color: #26a69a;
}

/* Color for Disagreement values */
.feature-value.disagreement {
  color: #e74c3c;
}

/* === Custom Scrollbar Styling === */
.feature-metric::-webkit-scrollbar {
  width: 8px;
}

.feature-metric::-webkit-scrollbar-thumb {
  background-color: #ccc;
  border-radius: 4px;
}

.feature-metric::-webkit-scrollbar-thumb:hover {
  background-color: #aaa;
}


/* === Toggle section === */
.header-glass-centered {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 20px;
  gap: 12px;
}

.header-glass-centered h2 {
  font-size: 22px;
  font-weight: 600;
  color: #333;
  margin: 0;
}

/* Toggle wrapper for centering */
.glass-toggle-wrapper {
  display: flex;
  justify-content: center;
  width: 100%;
}

/* Modern glass-like toggle container */
.glass-toggle {
  display: flex;
  position: relative;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(14px);
  border-radius: 14px;
  border: 1px solid rgba(0, 0, 0, 0.08);
  overflow: hidden;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.05);
  width: 280px;
  position: relative;
}

/* Animated sliding background inside toggle */
.slider-bg {
  position: absolute;
  top: 2px;
  left: 2px;
  width: 50%;
  height: calc(100% - 4px);
  background: rgba(217, 216, 216, 0.5);
  border-radius: 12px;
  box-shadow: inset 0 0 8px rgba(0,0,0,0.04);
  transition: all 0.35s ease;
  z-index: 0;
}
.slider-bg.right {
  transform: translateX(100%);
}

/* Toggle buttons styling */
.glass-toggle button {
  flex: 1;
  z-index: 1;
  background: transparent;
  border: none;
  font-size: 14px;
  font-weight: 500;
  padding: 10px 0;
  cursor: pointer;
  transition: all 0.2s ease;
  color: #333;
}

.glass-toggle button.active {
  color: #007a78;
  font-weight: 600;
}
</style>