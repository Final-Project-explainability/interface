<template>
  <div class="model-section" :class="groupClass">
    <!-- Model title -->
    <h3 class="model-title">{{ modelName }}</h3>
    <!-- Feature items list -->
    <div class="model-items" v-if="modelData && modelData.length">
      <!-- Render appropriate component for each feature dynamically -->
      <component
        v-for="(feature, index) in modelData"
        :key="feature.name"
        :is="getComponent"
        :feature="feature.name"
        :value="feature.percentage"
      />
    </div>
  </div>
</template>

<script>
import CircularFeature from "./CircularFeature.vue";
import VitalStatBlock from "@/components/VitalStatBlock.vue";
import MinimalDataTile from "@/components/MinimalDataTile.vue";

export default {
  name: "ModelExplainableSection",
  components: {
    VitalStatBlock,
    CircularFeature,
    MinimalDataTile,
  },
  props: {
    // Name of the model (e.g., "XGBoost", "Neural Net")
    modelName: {
      type: String,
      required: true,
    },
    // Array of features with { name, percentage } structure
    modelData: {
      type: Array,
      required: true,
    },
    // Indicates if the view is in 'All Mode' (affects parent display logic)
    isAllMode: {
      type: Boolean,
      default: false,
    },
    // Group type (SHAP, LIME, Inherent) for coloring
    group: {
      type: String,
      default: "",
    },
    // Determines which component is used to display each feature
    viewMode: {
      type: String,
      default: "vital", // "vital", "circular", or "mini"
    },

  },
  computed: {
    /**
     * Returns CSS class based on group prop.
     * Used to differentiate background colors per group.
     */
    groupClass() {
      const map = {
        SHAP: "group-shap",
        LIME: "group-lime",
        Inherent: "group-inherent",
      };
      return map[this.group] || "group-default";
    },
    /**
     * Dynamically returns the component to render for each feature
     * Based on the 'viewMode' prop.
     */
    getComponent() {
      switch (this.viewMode) {
        case "circular":
          return "CircularFeature";
        case "mini":
          return "MinimalDataTile";
        default:
          return "VitalStatBlock";
      }
    },

  },
};
</script>

<style scoped>
/* ===== Main Container ===== */
.model-section {
  min-width: 300px;
  margin-bottom: 12px;
  text-align: left;
  border-radius: 10px;
  padding: 12px;
  transition: background-color 0.3s ease;
}

/* ===== Model Title ===== */
.model-title {
  font-size: 18px;
  font-weight: bold;
  color: #34495e;
  margin-bottom: 0px;
  margin-top: 0;
}

/* ===== Feature Items List ===== */
.model-items {
  display: flex;
  gap: 15px;
  justify-content: flex-start;
  overflow-x: auto;
  white-space: nowrap;
  padding: 10px 0;
  overflow-x: scroll; /* במקום auto */
  scrollbar-gutter: stable both-edges;
}

/* Scrollbar styles */
.model-items::-webkit-scrollbar {
  height: 8px;
}

.model-items::-webkit-scrollbar-thumb {
  background: #c0c0c0;
  border-radius: 4px;
}

.model-items::-webkit-scrollbar-thumb:hover {
  background: #a0a0a0;
}

/* ===== Background Colors per Group Type ===== */
.group-shap {
  background-color: #e8f5e9; /* Soft green for SHAP explanations */
}

.group-lime {
  background-color: #fff9e6; /* Soft yellow for LIME explanations */
}

.group-inherent {
  background-color: #e3f2fd; /* Soft blue for inherent features */
}

.group-default {
  background-color: #f5f5f5; /* Neutral gray for default */
}
</style>
