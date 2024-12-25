<template>
  <div class="explainability-metrics">
    <h2>Explainability Metrics</h2>
    <div class="metrics-container">
      <div v-for="model in models" :key="model.name" class="metric-group">
        <h3>{{ model.name }}</h3>
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
          name: "SHAP",
          features: [
            { name: "Heart Rate", value: 81 },
            { name: "Blood Pressure", value: 56 },
          ],
        },
        {
          name: "Lime",
          features: [
            { name: "Heart Rate", value: 71 },
            { name: "Blood Pressure", value: 60 },
          ],
        },
      ],
    };
  },
};
</script>

<style scoped>
.explainability-metrics {
  margin-top: 20px;
}

.metrics-container {
  display: flex;
  justify-content: space-between;
}

.metric-group {
  flex: 1;
  margin: 0 10px;
  text-align: center;
}

.metric {
  display: flex;
  justify-content: space-between;
  padding: 5px 0;
}
</style>
