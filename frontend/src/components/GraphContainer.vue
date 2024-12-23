<template>
  <div class="graph-container" ref="graphRef">
    <!-- Graph Buttons Row -->
    <div class="graph-buttons-container">
      <!-- Graph Buttons (Left Side) -->
      <div class="graph-buttons">
        <button
          v-for="graph in graphButtons"
          :key="graph"
          class="graph-button"
          :class="{ active: activeGraph === graph }"
          @click="handleGraphChange(graph)"
        >
          {{ graph }}
        </button>
      </div>

      <!-- Fullscreen Button (Right Side) -->
      <button class="fullscreen-button" @click="handleFullscreen">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="2"
          stroke="currentColor"
          class="fullscreen-icon"
        >
          <path
            v-if="isFullscreen"
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M4 10v-3a1 1 0 011-1h3m7 0h3a1 1 0 011 1v3m0 7v3a1 1 0 01-1 1h-3m-7 0H5a1 1 0 01-1-1v-3"
          />
          <path
            v-else
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M8 3H5a2 2 0 00-2 2v3m0 8v3a2 2 0 002 2h3m8 0h3a2 2 0 002-2v-3m0-8V5a2 2 0 00-2-2h-3"
          />
        </svg>
        {{ isFullscreen ? "Exit Full Screen" : "Full Screen" }}
      </button>
    </div>

    <!-- Graph Area -->
    <h2>Graph Placeholder</h2>
    <p>This area will display the {{ activeGraph }} graph.</p>
  </div>
</template>

<script>
import { ref } from "vue";

export default {
  name: "GraphContainer",
  setup() {
    const graphRef = ref(null); // Reference for the graph container
    const isFullscreen = ref(false); // Track fullscreen state
    const activeGraph = ref("Row"); // Track active graph button
    const graphButtons = ["Row", "Radar", "Scatterplot"]; // Graph button options

    // Handle fullscreen toggle
    const handleFullscreen = () => {
      if (!isFullscreen.value) {
        if (graphRef.value.requestFullscreen) {
          graphRef.value.requestFullscreen();
        } else if (graphRef.value.webkitRequestFullscreen) {
          // Safari
          graphRef.value.webkitRequestFullscreen();
        } else if (graphRef.value.msRequestFullscreen) {
          // IE/Edge
          graphRef.value.msRequestFullscreen();
        }
        isFullscreen.value = true;
      } else {
        if (document.exitFullscreen) {
          document.exitFullscreen();
        } else if (document.webkitExitFullscreen) {
          // Safari
          document.webkitExitFullscreen();
        } else if (document.msExitFullscreen) {
          // IE/Edge
          document.msExitFullscreen();
        }
        isFullscreen.value = false;
      }
    };

    // Handle graph button click
    const handleGraphChange = (graphType) => {
      activeGraph.value = graphType;
    };

    return {
      graphRef,
      isFullscreen,
      activeGraph,
      graphButtons,
      handleFullscreen,
      handleGraphChange,
    };
  },
};
</script>

<!--<style scoped>-->
<!--/* Graph Container */-->
<!--.graph-container {-->
<!--  flex: 2;-->
<!--  background-color: #ffffff;-->
<!--  border: 2px solid #004d40;-->
<!--  border-radius: 10px;-->
<!--  padding: 20px;-->
<!--  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);-->
<!--}-->

<!--.graph-container h2 {-->
<!--  font-size: 24px;-->
<!--  color: #004d40;-->
<!--  margin-bottom: 10px;-->
<!--}-->

<!--.graph-container p {-->
<!--  font-size: 16px;-->
<!--  color: #555;-->
<!--}-->

<!--.graph-buttons-container {-->
<!--  display: flex;-->
<!--  justify-content: space-between;-->
<!--  align-items: center;-->
<!--  margin-bottom: 20px;-->
<!--}-->

<!--.graph-buttons {-->
<!--  display: flex;-->
<!--  gap: 10px;-->
<!--}-->

<!--.graph-button {-->
<!--  padding: 8px 16px;-->
<!--  border: 2px solid #004d40;-->
<!--  border-radius: 20px;-->
<!--  background-color: #e0f7fa;-->
<!--  color: #004d40;-->
<!--  font-size: 14px;-->
<!--  font-weight: bold;-->
<!--  cursor: pointer;-->
<!--  transition: background-color 0.3s ease, transform 0.2s ease;-->
<!--}-->

<!--.graph-button:hover {-->
<!--  background-color: #004d40;-->
<!--  color: #ffffff;-->
<!--  transform: scale(1.05);-->
<!--}-->

<!--.graph-button.active {-->
<!--  background-color: #004d40;-->
<!--  color: #ffffff;-->
<!--}-->

<!--.fullscreen-button {-->
<!--  display: flex;-->
<!--  align-items: center;-->
<!--  gap: 8px;-->
<!--  padding: 8px 16px;-->
<!--  border: 2px solid #6c757d;-->
<!--  border-radius: 20px;-->
<!--  background-color: #e9ecef;-->
<!--  color: #495057;-->
<!--  font-size: 14px;-->
<!--  font-weight: bold;-->
<!--  cursor: pointer;-->
<!--  transition: background-color 0.3s ease, transform 0.2s ease;-->
<!--}-->

<!--.fullscreen-button:hover {-->
<!--  background-color: #6c757d;-->
<!--  color: #ffffff;-->
<!--  transform: scale(1.05);-->
<!--}-->

<!--.fullscreen-icon {-->
<!--  width: 20px;-->
<!--  height: 20px;-->
<!--  fill: #495057;-->
<!--}-->

<!--.fullscreen-button:hover .fullscreen-icon {-->
<!--  fill: #ffffff;-->
<!--}-->
<!--</style>-->


<style>
@import "../styles/Global.css";
</style>