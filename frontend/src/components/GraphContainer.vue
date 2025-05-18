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

      <!-- TODO: choose if to remove -->
<!--      &lt;!&ndash; Render Boxplot Chart if type is 'Boxplot' &ndash;&gt;-->
<!--      <BoxplotChart-->
<!--        v-if="type === 'Boxplot'"-->
<!--        :data="data"-->
<!--        :selectedModel="selectedModel"-->
<!--      />-->

      <!-- Placeholder for future chart types -->

<!--      <LineChart v-else-if="type === 'Line'" :data="data" class="chart" />-->
<!--      <LimeChart v-else-if="type === 'LIME'" :data="data" class="chart" />-->
<!--      <PieChart v-else-if="type === 'Pie'" :data="data" class="chart" />-->
<!--      <RadarChart v-else-if="type === 'Radar'" :data="data" class="chart" />-->

      <!-- Fallback: No chart selected -->
      <div v-else class="empty-graph">No graph selected for display</div>
    </div>
  </div>
</template>

<script>
/* TODO:choose if to remove some that not used */
import BarChart from "../components/Graphs/BarChart.vue";
import LineChart from "../old files not used/not used graphs/LineChart.vue";
import LimeChart from "../old files not used/not used graphs/LimeChart.vue";
import PieChart from "../old files not used/not used graphs/PieChart.vue";
import RadarChart from "../old files not used/not used graphs/RadarChart.vue";
import GroupBarChart from "../old files not used/not used graphs/GroupedBarChart.vue";
import HeatmapChart from "../old files not used/not used graphs/HeatmapChart.vue";
import DotChart from "../old files not used/not used graphs/DotPlotChart.vue";
import DumbbellChart from "@/old files not used/not used graphs/DumbbellChart.vue";
import ComparisonTable from "@/components/Graphs/ComparisonTable.vue";
import StackedBar from "@/old files not used/not used graphs/StackedBar.vue";
import SankeyChart from "@/components/Graphs/SankeyChart.vue";
import BoxplotChart from "@/old files not used/not used graphs/BoxplotChart.vue";

export default {
  name: "GraphContainer",
  props: {
    type: String, // Graph type to display (e.g., 'Bar', 'Sankey', 'Boxplot', etc.)
    data: Object, // Data object to pass to the chart component
    selectedModel: String // Currently selected model (used by charts if needed)
  },
  components: { /* TODO: choose if to remove some that not used */
    BarChart,
    LineChart,
    LimeChart,
    PieChart,
    RadarChart,
    GroupBarChart,
    HeatmapChart,
    DotChart,
    DumbbellChart,
    ComparisonTable,
    StackedBar,
    SankeyChart,
    BoxplotChart,
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
