<template>
  <div class="graph-container">
    <div class="chart-wrapper">
      <BarChart v-if="type === 'Bar'" :data="data" class="chart" :selectedModel="selectedModel"/>
      <StackedBar
        v-if="type === 'Stack'"
        :data="data"
        :selectedModel="selectedModel"
      />
      <ComparisonTable
        v-if="type === 'Comparison'"
        :data="data"
        :selectedModel="selectedModel"
      />

<!--      <LineChart v-else-if="type === 'Line'" :data="data" class="chart" />-->
<!--      <LimeChart v-else-if="type === 'LIME'" :data="data" class="chart" />-->
<!--      <PieChart v-else-if="type === 'Pie'" :data="data" class="chart" />-->
<!--      <RadarChart v-else-if="type === 'Radar'" :data="data" class="chart" />-->
      <div v-else class="empty-graph">לא נבחר גרף להצגה</div>
    </div>
  </div>
</template>

<script>
import BarChart from "../components/Graphs/BarChart.vue";
import LineChart from "../components/Graphs/LineChart.vue";
import LimeChart from "../components/Graphs/LimeChart.vue";
import PieChart from "../components/Graphs/PieChart.vue";
import RadarChart from "../components/Graphs/RadarChart.vue";
import GroupBarChart from "../components/Graphs/GroupedBarChart.vue";
import HeatmapChart from "../components/Graphs/HeatmapChart.vue";
import DotChart from "../components/Graphs/DotPlotChart.vue";
import DumbbellChart from "@/components/Graphs/DumbbellChart.vue";
import ComparisonTable from "@/components/Graphs/ComparisonTable.vue";
import StackedBar from "@/components/Graphs/StackedBar.vue";

export default {
  name: "GraphContainer",
  props: {
    type: String,
    data: Object,
    selectedModel: String // ✅ חדש
  },
  components: {
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

  /* רקע וצל */
  background: linear-gradient(135deg, #f0f4f8 0%, #e6f7f9 100%);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.08);
  transition: box-shadow 0.3s ease, background 0.3s ease;

  /* 👇 כאן הקסם: עיגול רק בתחתית */
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

.chart {
  width: 100%;
  height: 100%;
}

/* כאשר אין גרף מוצג */
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
