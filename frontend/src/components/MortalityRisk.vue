<template>
  <div class="mortality-risk">
    <h2 class="mortality-title">Mortality Risk</h2>

    <!-- כאשר נבחר "All" -->
<div v-if="selectedModel === 'All'" class="circle-list">
  <div
    v-for="(model, index) in allModelsData"
    :key="index"
    class="circle-item"
    :style="{ backgroundColor: adjustBackgroundColor(model.percentage) }"
  >
    <!-- עיגול מתקדם -->
    <div class="circle-container">
      <svg class="circle-svg" viewBox="0 0 50 50">
        <!-- טבעת רקע -->
        <circle
          class="circle-background"
          cx="25"
          cy="25"
          r="20"
        ></circle>
        <!-- טבעת התקדמות -->
        <circle
          class="circle-progress"
          cx="25"
          cy="25"
          r="20"
          :style="circleProgressStyle(model.percentage)"
        ></circle>
      </svg>
      <span class="circle-percentage">{{ model.formattedPercentage }}%</span>
    </div>

    <!-- שם המודל -->
    <div class="model-details">
      <span class="model-name">{{ model.name }}</span>
    </div>
  </div>
</div>



    <!-- במצב רגיל הצג עיגול יחיד -->
    <div v-else class="circle-chart">
      <svg class="progress-ring" viewBox="0 0 300 300">
        <!-- מעגל פנימי שמשמש כרקע -->
        <circle
          class="progress-ring__background"
          :style="innerCircleStyle(mortalityPercentage)"
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
          :style="outerCircleStyle(mortalityPercentage)"
        />
      </svg>
      <div class="center-content">
        <span class="percentage">{{ formattedMortalityPercentage }}%</span>
      </div>
    </div>

    <!-- קומפוננטת ModelSelector -->
    <ModelSelector
      :selectedModel="selectedModel"
      :models="availableModels"
      @update:selectedModel="$emit('update:selectedModel', $event)"
    />
  </div>
</template>

<script>
import ModelSelector from "./ModelSelector.vue";

export default {
  name: "MortalityRisk",
  components: {
    ModelSelector,
  },
  props: {
    selectedModel: String,
    mortalityPercentage: Number, // אחוזי התמותה למודל הנוכחי
    fetchMortalityRisk: Function, // פונקציה שמביאה נתוני סיכון
  },
  data() {
    return {
      availableModels: ["XGBOOST", "LogisticRegression", "DecisionTree", "All"], // כולל All
      modelPercentages: {}, // אחוזי תמותה לכל מודל
    };
  },
  computed: {
    // ערך מעוגל להצגה במצב רגיל
    formattedMortalityPercentage() {
      return (this.mortalityPercentage * 100).toFixed(1);
    },
    // נתונים עבור כל המודלים כאשר נבחר "All"
    allModelsData() {
      return Object.entries(this.modelPercentages).map(([name, percentage]) => ({
        name,
        percentage,
        formattedPercentage: (percentage * 100).toFixed(1),
      }));
    },
  },
  methods: {
    // צבע עבור מעגל חיצוני
    outerCircleStyle(percentage) {
      const radius = 130;
      const circumference = 2 * Math.PI * radius;
      const offset = circumference - (percentage * circumference);
      const color = this.getColor(percentage * 100); // הכפלה ב-100
      return {
        strokeDasharray: `${circumference} ${circumference}`,
        strokeDashoffset: offset,
        stroke: color,
        transition: "stroke-dashoffset 1.5s ease-out, stroke 1.5s ease-out",
      };
    },
      circleProgressStyle(percentage) {
    const radius = 20; // רדיוס העיגול
    const circumference = 2 * Math.PI * radius; // היקף העיגול
    const offset = circumference - percentage * circumference;

    return {
      strokeDasharray: `${circumference} ${circumference}`,
      strokeDashoffset: offset,
      stroke: this.getColor(percentage * 100),
      transition: "stroke-dashoffset 1.5s ease-out, stroke 1.5s ease-out",
    };
  },
    // צבע עבור מעגל פנימי
    innerCircleStyle(percentage) {
      const color = this.getColor(percentage * 100, true); // צבע דהוי
      return {
        fill: color,
      };
    },
    // צבע לפי אחוזים
    getColor(percentage, faded = false) {
      let color;
      if (percentage <= 33) color = "#4caf50"; // ירוק
      else if (percentage <= 66) color = "#ff9800"; // כתום
      else color = "#f44336"; // אדום

      if (faded) {
        return this.adjustColorOpacity(color, 0.3);
      }
      return color;
    },
      adjustBackgroundColor(percentage) {
    const baseColor = this.getColor(percentage * 100); // קבלת הצבע הבסיסי לפי אחוזים
    return this.adjustColorOpacity(baseColor, 0.1); // הוספת שקיפות 10%
  },
    // יוצר צבע דהוי
    adjustColorOpacity(hexColor, opacity) {
      const bigint = parseInt(hexColor.replace("#", ""), 16);
      const r = (bigint >> 16) & 255;
      const g = (bigint >> 8) & 255;
      const b = bigint & 255;
      return `rgba(${r}, ${g}, ${b}, ${opacity})`;
    },
    async fetchAllModels() {
      // קבלת נתוני תמותה לכל המודלים
      const models = ["XGBOOST", "LogisticRegression", "DecisionTree"];
      const percentages = {};
      for (const model of models) {
        percentages[model] = await this.fetchMortalityRisk(model);
      }
      this.modelPercentages = percentages;
    },
  },
  watch: {
    selectedModel: {
      immediate: true,
      async handler(newValue) {
        if (newValue === "All") {
          await this.fetchAllModels();
        }
      },
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
  max-width: 100%; /* מתאים למסכים קטנים */
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
  width: 100%; /* התאמה למסכים קטנים */
  max-width: 300px; /* מגבלת גודל למסכים גדולים */
  height: auto; /* גובה אוטומטי */
  margin-bottom: 20px;
}

/* רקע מעגל פנימי */
.progress-ring__background {
  r: 120; /* רדיוס פנימי */
  cx: 150;
  cy: 150;
}

/* רקע טבעת חיצונית */
.progress-ring__background-outer {
  stroke: #e0e0e0;
  stroke-width: 15;
  fill: transparent;
}

/* טבעת ה-SVG */
.progress-ring {
  transform: rotate(-90deg); /* Rotate to start from top */
  width: 100%; /* להתאים לגודל הקונטיינר */
  height: auto; /* גובה אוטומטי */
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
  width: 90%; /* הגבלת הרוחב */
  height: 90%; /* הגבלת הגובה */
  display: flex; /* עיצוב גמיש */
  justify-content: center; /* מרכז אופקי */
  align-items: center; /* מרכז אנכי */
  overflow: hidden; /* למנוע גלישה */
}

.percentage {
  font-size: calc(2.5vw); /* גודל טקסט יחסי לרוחב המסך */
  font-weight: 900;
  color: #000;
  text-shadow: 0px 4px 6px rgba(0, 0, 0, 0.3);
  white-space: nowrap; /* מניעת שבירת שורה */
  overflow: hidden; /* מניעת גלישה */
  text-overflow: ellipsis; /* הצגת "..." אם יש גלישה */
  line-height: 1; /* מניעת ריווח מוגזם */
}

/* בורר המודל */
.model-selector {
  margin-top: -15px;
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

@media (max-width: 480px) {
  .circle-chart {
    max-width: 150px; /* מעגל קטן עוד יותר למסכים קטנים מאוד */
    height: auto;
  }

  .percentage {
    font-size: calc(5vw); /* טקסט קטן יותר למסכים קטנים מאוד */
  }

  .mortality-title {
    font-size: 20px; /* כותרת קטנה יותר למסכים קטנים מאוד */
  }
}

/* רשימה עיצובית עבור All */
.circle-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
  max-width: 600px;
  margin: 0 auto;
}

.circle-item {
  display: flex;
  align-items: center;
  gap: 1px;
  padding: 1px;
  border-radius: 10px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1); /* צל עדין */
  transition: background-color 0.3s ease; /* מעבר חלק בצבע */
}

.circle-container {
  position: relative;
  width: 50px;
  height: 50px;
}

.circle-svg {
  transform: rotate(-90deg);
  width: 50px;
  height: 50px;
}

.circle-background {
  fill: transparent;
  stroke: #e0e0e0;
  stroke-width: 5;
}

.circle-progress {
  fill: transparent;
  stroke-width: 5;
  stroke-linecap: round;
  transition: stroke-dashoffset 1.5s ease-out;
}

.circle-percentage {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 12px;
  font-weight: bold;
}

.model-details {
  font-size: 16px;
  font-weight: bold;
  color: #000000;
}




</style>