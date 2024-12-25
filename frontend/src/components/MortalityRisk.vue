<template>
  <div class="mortality-risk">
    <h2 class="mortality-title">Mortality Risk</h2>
    <div class="circle-chart">
      <svg class="progress-ring" width="300" height="300">
        <!-- מעגל פנימי שמשמש כרקע -->
        <circle
          class="progress-ring__background"
          :style="innerCircleStyle"
          r="100"
          cx="150"
          cy="150"
        />
        <!-- רקע טבעת חיצונית -->
        <circle
          class="progress-ring__background-outer"
          stroke="#e0e0e0"
          stroke-width="15"
          fill="transparent"
          r="130"
          cx="150"
          cy="150"
        />
        <!-- מעגל התקדמות -->
        <circle
          class="progress-ring__circle"
          stroke-width="15"
          fill="transparent"
          r="130"
          cx="150"
          cy="150"
          :style="outerCircleStyle"
        />
      </svg>
      <div class="center-content">
        <span class="percentage">{{ mortalityPercentage }}%</span>
      </div>
    </div>
    <div class="model-selector">
      <label for="model">Choose Model:</label>
      <select
        id="model"
        :value="selectedModel"
        @change="$emit('update:selectedModel', $event.target.value)"
      >
        <option value="XGBOOST">XGBOOST</option>
        <option value="LogisticRegression">Logistic Regression</option>
        <option value="DecisionTree">Decision Tree</option>
      </select>
    </div>
  </div>
</template>

<script>
export default {
  name: "MortalityRisk",
  props: {
    selectedModel: String,
    mortalityPercentage: Number,
  },
  computed: {
    // עיצוב למעגל החיצוני
    outerCircleStyle() {
      const percentage = this.mortalityPercentage;
      const radius = 130; // Radius of the circle
      const circumference = 2 * Math.PI * radius; // Circumference of the circle
      const offset = circumference - (percentage / 100) * circumference; // Calculate offset based on percentage
      const color = this.getColor(percentage); // Get color based on percentage
      return {
        strokeDasharray: `${circumference} ${circumference}`, // Full circle
        strokeDashoffset: offset, // Offset for the animation
        stroke: color, // Dynamic stroke color
        transition: "stroke-dashoffset 1.5s ease-out, stroke 1.5s ease-out", // Smooth animation
      };
    },
    // עיצוב למעגל הפנימי
    innerCircleStyle() {
      const color = this.getColor(this.mortalityPercentage, true); // Faded color
      return {
        fill: color, // Set the faded fill color
      };
    },
  },
  methods: {
    // פונקציה שמחזירה צבע לפי אחוזים
    getColor(percentage, faded = false) {
      let color;
      if (percentage <= 33) color = "#4caf50"; // Green for low risk
      else if (percentage <= 66) color = "#ff9800"; // Orange for medium risk
      else color = "#f44336"; // Red for high risk

      // אם אנחנו רוצים צבע דהוי
      if (faded) {
        return this.adjustColorOpacity(color, 0.3); // Faded version
      }
      return color;
    },
    // פונקציה ליצירת צבע דהוי
    adjustColorOpacity(hexColor, opacity) {
      const bigint = parseInt(hexColor.replace("#", ""), 16);
      const r = (bigint >> 16) & 255;
      const g = (bigint >> 8) & 255;
      const b = bigint & 255;
      return `rgba(${r}, ${g}, ${b}, ${opacity})`;
    },
  },
};
</script>

<style scoped>
/* קונטיינר כללי */
.mortality-risk {
  text-align: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 20px;
  padding: 30px;
  border-radius: 20px;
  max-width: 400px;
  margin: 0 auto;
}

/* כותרת */
.mortality-title {
  font-size: 28px;
  font-weight: bold;
  color: #333;
  text-transform: uppercase;
  margin-bottom: 20px;
  text-shadow: 0px 4px 6px rgba(0, 0, 0, 0.2);
}

/* מעגל */
.circle-chart {
  position: relative;
  width: 300px;
  height: 300px;
  margin-bottom: 20px;
}

/* רקע מעגל פנימי */
.progress-ring__background {
  r: 120; /* רדיוס פנימי */
  cx: 150;
  cy: 150;
}

/* רקע טבעת חיצוני */
.progress-ring__background-outer {
  stroke: #e0e0e0;
  stroke-width: 15;
  fill: transparent;
}

/* טבעת ה-SVG */
.progress-ring {
  transform: rotate(-90deg); /* Rotate to start from top */
}

/* מעגל התקדמות */
.progress-ring__circle {
  stroke-linecap: round; /* קצוות מעוגלים */
  transition: stroke-dashoffset 1.5s ease-out; /* אנימציה חלקה */
}

/* תוכן מרכז המעגל */
.center-content {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
}

.percentage {
  font-size: 60px;
  font-weight: 900;
  color: #000;
  text-shadow: 0px 4px 6px rgba(0, 0, 0, 0.3);
}

/* בורר המודל */
.model-selector {
  margin-top: 20px;
}

.model-selector label {
  font-size: 16px;
  font-weight: bold;
  color: #333;
  margin-right: 10px;
}

.model-selector select {
  padding: 10px;
  font-size: 14px;
  border: 2px solid #ddd;
  border-radius: 5px;
  background: #fff;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.model-selector select:hover {
  border-color: #888;
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.2);
}
</style>