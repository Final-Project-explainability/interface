<template>
  <div class="explainability-metrics">
    <h2>Explainability Metrics</h2>
    <!-- Container holding all model metric groups -->
    <div class="metrics-container">
      <!-- Iterate over models and render their metrics -->
      <div v-for="model in models" :key="model.name" class="metric-group">
        <!-- Model name (e.g., SHAP, LIME) -->
        <h3>{{ model.name }}</h3>
        <!-- Iterate over each feature and display its importance -->
        <div class="metric" v-for="feature in model.features" :key="feature.name">
          <span>{{ feature.name }}</span>
          <span>{{ feature.value }}%</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "ExplainabilityMetrics",
  data() {
    return {
      models: [
        {
          name: "SHAP", // Name of the explainability method
          features: [
            {name: "Heart Rate", value: 81}, // Feature name & its contribution (%)
            {name: "Blood Pressure", value: 56},
          ],
        },
        {
          name: "Lime",
          features: [
            {name: "Heart Rate", value: 71},
            {name: "Blood Pressure", value: 60},
          ],
        },
      ],
    };
  },
};
</script>

<style scoped>
/* Wrapper for the entire explainability section */
.explainability-metrics {
  margin-top: 20px;
}

/* Layout container for all model groups */
.metrics-container {
  display: flex;
  justify-content: space-between;
}

/* Individual group container (per model like SHAP, LIME) */
.metric-group {
  flex: 1;
  margin: 0 10px;
  text-align: center;
}

/* Single feature row (name + value) */
.metric {
  display: flex;
  justify-content: space-between;
  padding: 5px 0;
}
</style>
