<template>
  <div class="feature-metric">
    <!-- כותרת + טוגל -->
    <div class="header">
      <h2>Feature Metric:</h2>
      <div class="toggle-container">
        <span class="toggle-label">Agreement</span>
        <label class="switch">
          <input type="checkbox" v-model="showAgreement" />
          <span class="slider round"></span>
        </label>
      </div>
    </div>

    <!-- רשימת פיצ'רים -->
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
import featureData from "../JSON/feature_metrics.json";

export default {
  name: "FeatureMetric",
  data() {
    return {
      features: featureData.features, // ייבוא נתוני ה-JSON
      showAgreement: true // ברירת מחדל: הצגת Agreement
    };
  },
  computed: {
    // מחזיר את רשימת הפיצ'רים להצגה לפי מצב הטוגל
    displayedFeatures() {
      return this.features.sort((a, b) =>
          this.showAgreement ? b.agreement - a.agreement : b.disagreement - a.disagreement
      );
    }
  }
};
</script>

<style scoped>
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
  direction: rtl; /* ✅ מעביר את הסקרול לשמאל */
}

/* מחזיר את התוכן הרגיל לשמאל */
.feature-metric * {
  direction: ltr;
}




/* כותרת + טוגל */
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

/* רשימת פיצ'רים */
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

.feature-name {
  font-size: 15px;
  color: #333;
  font-weight: 500;
}

.feature-value {
  font-size: 15px;
  font-weight: bold;
  min-width: 50px;
  text-align: right;
}

.feature-value.agreement {
  color: #26a69a;
}

.feature-value.disagreement {
  color: #e74c3c;
}

/* Scrollbar עיצוב */
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

</style>
