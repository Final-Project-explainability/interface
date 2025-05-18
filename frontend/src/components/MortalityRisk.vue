<template>
  <div class="mortality-risk-card" :style="getCardBoxShadow(mortalityPercentage)">
    <h3 class="mortality-risk-title">Mortality Risk</h3>

    <!-- Single model visualization -->
    <div v-if="selectedModelLocal !== 'All'" class="single-risk-box">
      <div class="neovital-ring">
        <svg viewBox="0 0 120 120">
          <defs>
            <!-- Gradient for progress ring -->
            <linearGradient id="neoGradient" x1="1" y1="0" x2="0" y2="1">
              <stop offset="0%" :stop-color="startColor" />
              <stop offset="100%" :stop-color="endColor" />
            </linearGradient>
          </defs>
          <!-- Background circle -->
          <circle class="circle-bg" cx="60" cy="60" r="50" />
          <!-- Foreground circle (progress indicator) -->
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
        <!-- Centered text for risk percentage -->
        <div class="center-text" :key="formattedRisk">
          <div class="percent">{{ formattedRisk }}%</div>
          <div class="subtitle">Risk Level</div>
        </div>
      </div>
    </div>

    <!-- Multi-model comparison view -->
    <div v-else class="multi-risk-box">
      <div v-for="(value, model) in modelPercentages" :key="model" class="model-item">
        <div class="model-name">{{ model }}</div>
        <div class="model-progress-bar">
          <div class="progress" :style="getProgressBarStyle(value)"></div>
        </div>
        <div class="model-percentage">{{ formatRisk(value) }}%</div>
      </div>
    </div>

    <!-- Model selection dropdown -->
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
    selectedModel: String,              // Selected model from parent component
    mortalityPercentage: Number,        // Current risk value (0-1)
    fetchMortalityRisk: Function,       // Async function to fetch risk per model
  },
  emits: ["update:selectedModel"],
  data() {
    return {
      selectedModelLocal: this.selectedModel,
      modelPercentages: {},             // Risk values per model (when in 'All' mode)
      availableModels: ["XGBOOST", "DecisionTree", "LogisticRegression", "All"],
    };
  },
  computed: {
    // Returns risk formatted as percentage string (e.g., "12.3")
    formattedRisk() {
      const value = Number(this.mortalityPercentage);
      return isNaN(value) ? "0.0" : (value * 100).toFixed(1);
    },
    // Normalized percentage (0-1)
    percentageDecimal() {
      return isNaN(this.mortalityPercentage)
        ? 0
        : Math.min(Math.max(this.mortalityPercentage, 0), 1);
    },
    // Circumference of SVG circle (for dasharray)
    circumference() {
      return 2 * Math.PI * 50;
    },
    // Calculates stroke dashoffset for progress circle
    dashOffset() {
      return this.circumference * (1 - this.percentageDecimal);
    },
    // Start gradient color based on risk
    startColor() {
      return this.getColor(this.percentageDecimal * 100, true);
    },
    // End gradient color based on risk
    endColor() {
      return this.getColor(this.percentageDecimal * 100, false);
    },
  },
  watch: {
    // Handle model selection change
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
    /**
     * Returns dynamic box-shadow style based on risk level.
     * Blue glow for 'All', green/yellow/red for individual model.
     */
    getCardBoxShadow(value) {
      const percentage = value * 100;
      // Default shadow: soft blue glow
      let boxShadow = '0 0 20px rgba(0, 0, 255, 0.7)';

      // For "All" mode - always blue highlight regardless of percentage
      if (this.selectedModelLocal === 'All') {
        boxShadow = '0 0 25px rgba(0, 0, 255, 0.7)'; // Bright blue glow
      }
      // Low risk (0% - 33%) -> Green glow
      else if (percentage <= 33) {
        boxShadow = '0 0 25px 5px rgba(76, 175, 80, 0.8)';
      }
      // Medium risk (34% - 66%) -> Orange glow
      else if (percentage <= 66) {
        boxShadow = '0 0 25px 5px rgba(255, 152, 0, 0.8)';
      }
      // High risk (> 66%) -> Red glow
      else {
        boxShadow = '0 0 25px 5px rgba(244, 67, 54, 0.8)';
      }

      // Return the final box-shadow style object
      return {
        boxShadow: boxShadow,
      };
    },
    /**
     * Returns style object for progress bar width & color based on risk value.
     */
    getProgressBarStyle(value) {
      const percentage = value * 100;
      let color = '#4caf50'; // Default color (Green)

      if (percentage <= 33) {
        color = '#4caf50';  // green
      } else if (percentage <= 66) {
        color = '#ff9800';  // orange
      } else {
        color = '#f44336';  // red
      }

      return {
        width: this.formatRisk(value) + '%',
        backgroundColor: color,
      };
    },
    /**
     * Fetches mortality risk for all available models.
     * Populates modelPercentages.
     */
    async fetchAllModelRisks() {
      const models = ["XGBOOST", "DecisionTree", "LogisticRegression"];
      const results = {};
      for (const model of models) {
        const val = await this.fetchMortalityRisk(model);
        results[model] = val;
      }
      this.modelPercentages = results;
    },
    /**
     * Formats a risk value (0-1) into percentage string.
     */
    formatRisk(val) {
      const num = Number(val);
      return isNaN(num) ? "0.0" : (num * 100).toFixed(1);
    },
    /**
     * Returns color gradient based on percentage.
     */
    getColor(percentage, isStart) {
      if (percentage <= 33) return isStart ? "#4cd964" : "#34c759"; // Blue
      else if (percentage <= 66) return isStart ? "#ffe259" : "#ffa751"; // Yellow-orange
      else return isStart ? "#ff5f6d" : "#ffc371"; // Red-orange
    },
  },
};
</script>

<style scoped>
/* ==== Mortality Risk Card Container ==== */
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


/* ==== Single Model View (Circular Ring) ==== */
.single-risk-box {
  display: flex;
  justify-content: center;
  align-items: center;
  padding-top: 0px;
  overflow: visible;
  flex: 1;
  height: 100%;
}


/* ==== Card Title ==== */
.mortality-risk-title {
  font-size: 18px;
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 0px;
  margin-top: 0px;
}

/* ==== Model Selector Dropdown ==== */
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


/* ==== Circular Ring Container ==== */
.neovital-ring {
  position: relative;
  width: 140px;
  height: 140px;
  margin: auto;
  overflow: visible;  /* Allows shadow glow to overflow */
}


.neovital-ring svg {
  width: 140px;
  height: 140px;
  transform: rotate(-90deg); /* Start progress from top */
}

/* Background Circle */
.circle-bg {
  fill: none;
  stroke: rgba(200, 200, 200, 0.3);
  stroke-width: 10;
}

/* Foreground Progress Circle */
.circle-fg {
  fill: none;
  stroke-width: 10;
  stroke-linecap: round;
  transition: stroke-dashoffset 1s ease, stroke 1s ease;
  filter: drop-shadow(0 0 6px rgba(0, 0, 0, 0.2));
}

/* ==== Center Text in Circular Ring ==== */
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
  transition: opacity 0.5s ease-in-out;   /* Smooth transition on value change */
}

/* Fade-in Animation for Percentage Text */
@keyframes fadeIn {
  0% { opacity: 0; }
  100% { opacity: 1; }
}


.center-text .subtitle {
  font-size: 13px;
  color: #888;
  margin-top: 2px;
}


/* ==== Multi-Model Comparison View ==== */
.multi-risk-box {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: 15px;
}


/* ==== Individual Model Item in Multi-View ==== */
.model-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #ffffff;
  border-radius: 8px;
  padding: 8px;
  box-shadow: 0 0 25px rgba(0, 0, 0, 0.1);
  font-size: 14px;
  transition: box-shadow 0.3s ease-in-out;
}

/* Model Name Text */
.model-name {
  font-weight: bold;
  color: #004d40;
}

/* Progress Bar Background */
.model-progress-bar {
  flex: 1;
  height: 6px;
  background-color: #f0f0f0;
  border-radius: 10px;
  margin-left: 10px;
  overflow: hidden;
}

/* Progress Indicator (colored bar) */
.progress {
  height: 100%;
  border-radius: 10px;
  transition: width 0.5s ease-out;
}


/* Risk Percentage Label */
.model-percentage {
  font-weight: bold;
  color: #00796b;
  margin-left: 10px;
}
</style>