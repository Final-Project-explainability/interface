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
  flex: 1;
  background-color: #ffffff;
  border: 2px solid #004d40;
  border-radius: 10px;
  padding: 20px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  overflow-y: auto;
}

/* קונטיינר לכותרת ולכפתור הטוגל */
.header {
  display: flex;
  justify-content: space-between;
  align-items: center; /* יישור אנכי */
  margin-bottom: 20px;
  background-color: rgba(0, 77, 64, 0.05); /* רקע דהוי מאחורה */
  padding: 10px;
  border-radius: 10px;
}

.header h2 {
  font-size: 24px;
  color: #004d40;
  margin: 0; /* ביטול מרווחים חיצוניים */
}

.toggle-container {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 5px 10px;
  background-color: rgba(7, 7, 7, 0.1); /* רקע ירוק דהוי */
  border-radius: 20px;
}

.toggle-label {
  font-size: 16px;
  color: #004d40;
  font-weight: bold;
}

/* רשימת הפיצ'רים */
.feature-list {
  list-style-type: none;
  padding: 0;
  margin: 0;
}

.feature-list li {
  display: flex;
  justify-content: space-between;
  padding: 10px 0;
  border-bottom: 1px solid #ddd;
}

.feature-name {
  font-size: 16px;
  color: #333;
}

.feature-value {
  font-size: 16px;
  font-weight: bold;
}

.feature-value.agreement {
  color: #4caf50; /* ירוק להסכמה */
}

.feature-value.disagreement {
  color: #f44336; /* אדום לאי-הסכמה */
}

/* עיצוב כפתור הטוגל */
.switch {
  position: relative;
  display: inline-block;
  width: 36px;
  height: 20px;
}

.switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ccc;
  transition: 0.4s;
  border-radius: 34px;
}

.slider:before {
  position: absolute;
  content: "";
  height: 16px;
  width: 16px;
  left: 2px;
  bottom: 2px;
  background-color: white;
  transition: 0.4s;
  border-radius: 50%;
}

input:checked + .slider {
  background-color: #4caf50;
}

input:checked + .slider:before {
  transform: translateX(16px);
}
</style>
