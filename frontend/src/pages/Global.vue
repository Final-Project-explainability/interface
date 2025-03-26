<template>
  <div class="global-page">
    <!-- סרגל עליון -->
    <MenuBar />


    <!-- תוכן עיקרי -->
    <div class="main-content">
      <!-- צד שמאל: מידע על פיצ'רים -->
      <section class="feature-section" :class="{ collapsed: isFeatureCollapsed }">
        <button class="collapse-btn" @click="toggleFeatureSection">
          <i class="fas fa-chevron-left" :class="{ rotated: isFeatureCollapsed }"></i>
        </button>

        <!-- תוכן פנימי: FeatureMetric -->
        <FeatureMetric v-show="!isFeatureCollapsed" />
      </section>

      <!-- צד ימין: גרפים -->
      <section class="graph-section">
        <GraphControls
          :graphTypes="graphTypes"
          :activeType="activeGraphType"
          @updateType="updateGraphType"
        />
        <GraphContainer :type="activeGraphType" :data="filteredData" />
      </section>
    </div>
  </div>
</template>

<script>
import { nextTick } from "vue";
import MenuBar from "../components/MenuBar.vue";
import FeatureMetric from "../components/FeatureMetric.vue";
import GraphContainer from "../components/GraphContainer.vue";
import GraphControls from "../components/GraphControls.vue";
import data from "../JSON/global graph data.json";
import { eventBus } from "@/utils/eventBus";


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
      activeGraphType: "Bar",
      graphData: {
        Bar: data,
        Line: data,
        Pie: data,
        Radar: data,
      },
      isFeatureCollapsed: false,
    };
  },
  created() {
    eventBus.on("token-expired", this.handleLogout);
  },
  beforeUnmount() {
    eventBus.off("token-expired", this.handleLogout);
  },

  computed: {
    filteredData() {
      return this.graphData[this.activeGraphType];
    },
  },
  methods: {
    updateGraphType(type) {
      this.activeGraphType = type;
    },
    toggleFeatureSection() {
      this.isFeatureCollapsed = !this.isFeatureCollapsed;

      // פורס resize אחרי האנימציה
      nextTick(() => {
        setTimeout(() => {
          window.dispatchEvent(new Event("resize"));
        }, 300);
      });
    },
    handleLogout() {
      localStorage.removeItem("token");
      localStorage.removeItem("userId");
      localStorage.removeItem("userDetails");
      this.$router.push("/");
    },
  },
};
</script>

<style scoped>
/* מבנה כללי */
.global-page {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background-color: #f5f7fa;
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
  overflow: hidden;
}

.main-content {
  display: flex;
  flex: 1;
  padding: 20px;
  gap: 20px;
  overflow: hidden;
}

/* ===== Feature Section (Side Panel) ===== */
.feature-section {
  position: relative;
  flex: 1;
  background-color: #ffffff;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);
  min-width: 280px;
  max-width: 380px;
  transition:
    max-width 0.4s ease,
    min-width 0.4s ease,
    padding 0.3s ease,
    opacity 0.3s ease;
  overflow: hidden;
}

.feature-section.collapsed {
  max-width: 40px;
  min-width: 40px;
  padding: 0;
  opacity: 0.4;
}

/* כפתור הקטנה */
.collapse-btn {
  position: absolute;
  top: 40px;
  right: -9px;
  z-index: 100;
  background: #ffffff;
  border: 2px solid #007a78;
  border-radius: 25%;
  width: 36px;
  height: 36px;
  font-size: 18px;
  color: #0a0a0a;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  text-align: center;
}

.collapse-btn:hover {
  background-color: #e0f7fa;
  transform: scale(1.05);
}

.collapse-btn i {
  transition: transform 0.3s ease;
}

.collapse-btn i.rotated {
  transform: rotate(180deg);
}

/* ===== גרף ===== */
.graph-section {
  flex: 2;
  background-color: #ffffff;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

/* עיצוב פנימי לגרף */
.graph-section >>> .graph-container {
  flex: 1;
  overflow: hidden !important;
}

.graph-section >>> .chart-wrapper {
  flex: 1;
  overflow: hidden !important;
}

.graph-section >>> .chart {
  width: 100%;
  height: 100%;
  overflow: hidden;
}


</style>
