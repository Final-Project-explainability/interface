<template>
  <div class="global-page">
    <!-- Menu Bar -->
    <MenuBar />

    <!-- Main Content -->
    <div class="main-content">
      <!-- Feature Metric Component -->
      <FeatureMetric />

      <!-- Graph Container Component -->
      <GraphContainer :data="data" />
    </div>
  </div>
</template>

<script>
import MenuBar from "../components/MenuBar.vue";
import FeatureMetric from "../components/FeatureMetric.vue";
import GraphContainer from "../components/GraphContainer.vue";
import data from "../JSON/global graph data.json"; // Import JSON data

export default {
  name: "GlobalPage",
  components: {
    MenuBar,
    FeatureMetric,
    GraphContainer,
  },
  data() {
    return {
      data, // Assign imported JSON data to the component's data property
    };
  },
};
</script>

<!--<style scoped>-->
<!--/* Styles for the Global Page */-->
<!--.global-page {-->
<!--  display: flex;-->
<!--  flex-direction: column;-->
<!--  min-height: 100vh;-->
<!--  background-color: #eaf7f9; /* Light blue background */-->
<!--  font-family: Arial, sans-serif;-->
<!--}-->

<!--.main-content {-->
<!--  display: flex;-->
<!--  justify-content: space-between;-->
<!--  padding: 20px;-->
<!--  gap: 20px;-->
<!--}-->
<!--</style>-->


<style>
@import "../styles/Global.css";
</style>