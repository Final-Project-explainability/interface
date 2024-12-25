<template>
  <div class="graph-container">
    <!-- Render גרף דינמי בהתאם לסוג הגרף הפעיל -->
    <BarChart v-if="type === 'Bar'" :data="data" />
    <LineChart v-if="type === 'Line'" :data="data" />
    <LimeChart v-if="type === 'LIME'" :data="data" />
    <PieChart v-if="type === 'Pie'" :data="data" />
    <RadarChart v-if="type === 'Radar'" :data="data" />
  </div>
</template>

<script>
import BarChart from "../components/Graphs/BarChart.vue";
import LineChart from "../components/Graphs/LineChart.vue";
import PieChart from "../components/Graphs/PieChart.vue";
import RadarChart from "./Graphs/RadarChart.vue";
import LimeChart from "../components/Graphs/LimeChart.vue";

export default {
  name: "GraphContainer",
  props: {
    type: String, // סוג הגרף (Bar, Line, וכו')
    data: Object, // הנתונים לגרף
  },
  components: {
    BarChart,
    LineChart,
    LimeChart,
    PieChart,
    RadarChart,
  },
};
</script>


<style>
.graph-container {
  display: flex;
  flex: 1;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
}
</style>

<style>
.graph-container {
  display: flex;
  flex: 1;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
}
</style>


<style>
@import "../styles/Global.css";
</style>