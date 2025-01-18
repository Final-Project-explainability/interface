<template>
  <div class="global-page">
    <!-- Menu Bar -->
    <MenuBar />

    <!-- Main Content -->
    <div class="main-content">
      <FeatureMetric />

      <!-- Graph Section -->
      <div class="graph-section">
        <GraphControls
          :graphTypes="graphTypes"
          :activeType="activeGraphType"
          @updateType="updateGraphType"
        />
        <GraphContainer :type="activeGraphType" :data="filteredData" />
      </div>
    </div>
  </div>
</template>

<script>
import MenuBar from "../components/MenuBar.vue";
import FeatureMetric from "../components/FeatureMetric.vue";
import GraphContainer from "../components/GraphContainer.vue";
import GraphControls from "../components/GraphControls.vue";
import data from "../JSON/global graph data.json";
import limeData from "../JSON/lime_feature_importance_normalized.json";


export default {
  name: "GlobalPage",
  components: {
    MenuBar,
    FeatureMetric,
    GraphContainer,
    GraphControls,
  },
  data() {
    return {
      graphTypes: ["Bar", "Line", "Pie", "Radar"],
      activeGraphType: "Bar", // ברירת מחדל
      graphData: {
        Bar: data, // נתונים ל-Bar
        Line: data, // נתונים ל-Line
        // LIME: limeData, // נתונים ל-LIME
        Pie: data, // נתונים ל-Pie
        Radar: data, // נתונים ל-Scatter
      },
    };
  },
  computed: {
    filteredData() {
      return this.graphData[this.activeGraphType]; // מחזיר את הנתונים לפי סוג הגרף הפעיל
    },
  },
  methods: {
    updateGraphType(type) {
      this.activeGraphType = type; // מעדכן את סוג הגרף הפעיל
    },
  },
};

</script>

<style>
@import "../styles/Global.css";
</style>
