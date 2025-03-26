<template>
  <div class="mortality-risk-card" :style="getCardBoxShadow(mortalityPercentage)">
    <h3 class="mortality-risk-title">Mortality Risk</h3>

    <!-- תצוגת מודל בודד -->
    <div v-if="selectedModelLocal !== 'All'" class="single-risk-box">
      <div class="neovital-ring">
        <svg viewBox="0 0 120 120">
          <defs>
            <linearGradient id="neoGradient" x1="1" y1="0" x2="0" y2="1">
              <stop offset="0%" :stop-color="startColor" />
              <stop offset="100%" :stop-color="endColor" />
            </linearGradient>
          </defs>
          <circle class="circle-bg" cx="60" cy="60" r="50" />
          <circle
            class="circle-fg"
            cx="60"
            cy="60"
            r="50"
            :stroke-dasharray="circumference"
            :stroke-dashoffset="dashOffset"
            stroke="url(#neoGradient)"
          />
        </svg>
        <div class="center-text" :key="formattedRisk">
          <div class="percent">{{ formattedRisk }}%</div>
          <div class="subtitle">Risk Level</div>
        </div>
      </div>
    </div>

    <!-- מצב "הכל" -->
    <div v-else class="multi-risk-box">
      <div v-for="(value, model) in modelPercentages" :key="model" class="model-item">
        <div class="model-name">{{ model }}</div>
        <div class="model-progress-bar">
          <div class="progress" :style="getProgressBarStyle(value)"></div>
        </div>
        <div class="model-percentage">{{ formatRisk(value) }}%</div>
      </div>
    </div>

    <div class="model-selector">
      <label for="modelSelect">Model:</label>
      <select id="modelSelect" v-model="selectedModelLocal">
        <option v-for="model in availableModels" :key="model" :value="model">
          {{ model }}
        </option>
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
    fetchMortalityRisk: Function,
  },
  emits: ["update:selectedModel"],
  data() {
    return {
      selectedModelLocal: this.selectedModel,
      modelPercentages: {},
      availableModels: ["XGBOOST", "DecisionTree", "LogisticRegression", "All"],
    };
  },
  computed: {
    formattedRisk() {
      const value = Number(this.mortalityPercentage);
      return isNaN(value) ? "0.0" : (value * 100).toFixed(1);
    },
    percentageDecimal() {
      return isNaN(this.mortalityPercentage)
        ? 0
        : Math.min(Math.max(this.mortalityPercentage, 0), 1);
    },
    circumference() {
      return 2 * Math.PI * 50;
    },
    dashOffset() {
      return this.circumference * (1 - this.percentageDecimal);
    },
    startColor() {
      return this.getColor(this.percentageDecimal * 100, true);
    },
    endColor() {
      return this.getColor(this.percentageDecimal * 100, false);
    },
  },
  watch: {
    async selectedModelLocal(newVal) {
      this.$emit("update:selectedModel", newVal);
      if (newVal === "All") {
        await this.fetchAllModelRisks();
      }
    },
  },
  mounted() {
    if (this.selectedModelLocal === "All") {
      this.fetchAllModelRisks();
    }
  },
  methods: {
    getCardBoxShadow(value) {
      const percentage = value * 100;
      let boxShadow = '0 0 20px rgba(0, 0, 255, 0.7)'; // הילה כחולה עבור "הכל"

      // אם המודל הוא "הכל", נוודא שההילה כחולה
      if (this.selectedModelLocal === 'All') {
        boxShadow = '0 0 25px rgba(0, 0, 255, 0.7)'; // כחול בהיר עבור "הכל"
      } else if (percentage <= 33) {
        boxShadow = '0 0 25px 5px rgba(76, 175, 80, 0.8)'; // ירוק (סיכון נמוך)
      } else if (percentage <= 66) {
        boxShadow = '0 0 25px 5px rgba(255, 152, 0, 0.8)'; // כתום (סיכון בינוני)
      } else {
        boxShadow = '0 0 25px 5px rgba(244, 67, 54, 0.8)'; // אדום (סיכון גבוה)
      }

      return {
        boxShadow: boxShadow, // החלת ההילה
      };
    },
    getProgressBarStyle(value) {
      const percentage = value * 100;
      let color = '#4caf50'; // Default color (Green)

      if (percentage <= 33) {
        color = '#4caf50';  // ירוק
      } else if (percentage <= 66) {
        color = '#ff9800';  // כתום
      } else {
        color = '#f44336';  // אדום
      }

      return {
        width: this.formatRisk(value) + '%',
        backgroundColor: color,  // צבע הקו משתנה בהתאם לאחוזים
      };
    },
    async fetchAllModelRisks() {
      const models = ["XGBOOST", "DecisionTree", "LogisticRegression"];
      const results = {};
      for (const model of models) {
        const val = await this.fetchMortalityRisk(model);
        results[model] = val;
      }
      this.modelPercentages = results;
    },
    formatRisk(val) {
      const num = Number(val);
      return isNaN(num) ? "0.0" : (num * 100).toFixed(1);
    },
    getColor(percentage, isStart) {
      if (percentage <= 33) return isStart ? "#4cd964" : "#34c759"; // Blue
      else if (percentage <= 66) return isStart ? "#ffe259" : "#ffa751"; // Yellow-orange
      else return isStart ? "#ff5f6d" : "#ffc371"; // Red-orange
    },
  },
};
</script>


<style scoped>
.mortality-risk-card {
  background: #ffffff;
  border-radius: 14px;
  padding: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  width: 300px;
  min-height: 250px;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  gap: 10px;
  text-align: center;
  overflow: visible;
  transition: box-shadow 0.3s ease-in-out;
}



/* תצוגת "מודל בודד" עם הילה */
.single-risk-box {
  display: flex;
  justify-content: center;
  align-items: center;
  padding-top: 0px;
  overflow: visible;
  flex: 1;
  height: 100%;
}


.mortality-risk-title {
  font-size: 18px;
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 0px;
  margin-top: 0px;
}

.model-selector {
  margin-top: auto;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
  color: #004d40;
}

.model-selector select {
  padding: 6px 15px;
  font-size: 16px;
  font-weight: 500;
  border-radius: 10px;
  background-color: #f8f8f8;
  border: 1px solid #bbb;
  transition: all 0.3s ease;
}

.model-selector select:hover {
  background-color: #e0e0e0;
}

.model-selector select:focus {
  border-color: #004d40;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
}



.neovital-ring {
  position: relative;
  width: 140px;
  height: 140px;
  margin: auto;
  overflow: visible; /* זה מאפשר להילה לצאת מחוץ לתחום שלה */
}


.neovital-ring svg {
  width: 140px;
  height: 140px;
  transform: rotate(-90deg);
}

.circle-bg {
  fill: none;
  stroke: rgba(200, 200, 200, 0.3);
  stroke-width: 10;
}

.circle-fg {
  fill: none;
  stroke-width: 10;
  stroke-linecap: round;
  transition: stroke-dashoffset 1s ease, stroke 1s ease;
  filter: drop-shadow(0 0 6px rgba(0, 0, 0, 0.2));
}

.center-text {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
}

.center-text .percent {
  font-size: 26px;
  font-weight: bold;
  color: #222;
  opacity: 0;
  animation: fadeIn 1s ease-out forwards;
  transition: opacity 0.5s ease-in-out;  /* מעבר חלק בזמן שינוי אחוז הסיכון */
}

@keyframes fadeIn {
  0% { opacity: 0; }
  100% { opacity: 1; }
}



.center-text .subtitle {
  font-size: 13px;
  color: #888;
  margin-top: 2px;
}









.multi-risk-box {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: 15px;
}








/* הגדרת הילה חדה */
.model-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #ffffff;
  border-radius: 8px;
  padding: 8px;
  box-shadow: 0 0 25px rgba(0, 0, 0, 0.1); /* צל רגיל */
  font-size: 14px;
  transition: box-shadow 0.3s ease-in-out; /* שינוי הילה */
}

.model-name {
  font-weight: bold;
  color: #004d40;
}

.model-progress-bar {
  flex: 1;
  height: 6px;
  background-color: #f0f0f0;
  border-radius: 10px;
  margin-left: 10px;
  overflow: hidden;
}

.progress {
  height: 100%;
  border-radius: 10px;
  transition: width 0.5s ease-out;
}

.model-percentage {
  font-weight: bold;
  color: #00796b;
  margin-left: 10px;
}

</style>