<template>
  <div class="graph-container">
    <div class="chart-wrapper">
      <!-- Render Bar Chart if type is 'Bar' -->
      <BarChart v-if="type === 'Bar'" :data="data" class="chart" :selectedModel="selectedModel"/>
      <!-- Render Sankey Chart if type is 'Sankey' -->
      <SankeyChart
        v-if="type === 'Sankey'"
        :data="data"
        :selectedModel="selectedModel"
      />
      <!-- Render Comparison Table if type is 'Comparison' -->
      <ComparisonTable
        v-if="type === 'Comparison'"
        :data="data"
        :selectedModel="selectedModel"
      />

      <!-- Fallback: No chart selected -->
      <div v-else class="empty-graph">No graph selected for display</div>
    </div>
  </div>
</template>

<script>
import BarChart from "../components/Graphs/BarChart.vue";
import ComparisonTable from "@/components/Graphs/ComparisonTable.vue";
import SankeyChart from "@/components/Graphs/SankeyChart.vue";

export default {
  name: "GraphContainer",
  props: {
    type: String, // Graph type to display (e.g., 'Bar', 'Sankey', 'Boxplot', etc.)
    data: Object, // Data object to pass to the chart component
    selectedModel: String // Currently selected model (used by charts if needed)
  },
  components: {
    BarChart,
    ComparisonTable,
    SankeyChart,
  },
};
</script>

<style scoped>
.graph-container {
  display: flex;
  flex-direction: column;
  flex: 1;
  height: 100%;
  padding: 24px;
  overflow: hidden;

  /* Background gradient & subtle shadow for visual appeal */
  background: linear-gradient(135deg, #f0f4f8 0%, #e6f7f9 100%);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.08);
  transition: box-shadow 0.3s ease, background 0.3s ease;

  /* Rounded bottom corners */
  border-top-left-radius: 0;
  border-top-right-radius: 0;
  border-bottom-left-radius: 16px;
  border-bottom-right-radius: 16px;
}


.chart-wrapper {
  flex: 1;
  overflow: auto;
  padding-top: 8px;
}

/* Ensure chart takes full size */
.chart {
  width: 100%;
  height: 100%;
}

/* Style for when no graph is selected */
.empty-graph {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  font-size: 16px;
  color: #888;
  font-weight: 500;
  font-style: italic;
}
</style>
