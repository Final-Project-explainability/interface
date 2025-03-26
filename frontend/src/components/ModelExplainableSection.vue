<template>
  <div class="model-section" :class="groupClass">
    <h3 class="model-title">{{ modelName }}</h3>

    <div class="model-items" v-if="modelData && modelData.length">
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
    modelName: {
      type: String,
      required: true,
    },
    modelData: {
      type: Array,
      required: true,
    },
    isAllMode: {
      type: Boolean,
      default: false,
    },
    group: {
      type: String,
      default: "",
    },
    viewMode: {
      type: String,
      default: "vital",
    },

  },
  computed: {
    groupClass() {
      const map = {
        SHAP: "group-shap",
        LIME: "group-lime",
        Inherent: "group-inherent",
      };
      return map[this.group] || "group-default";
    },
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
.model-section {
  min-width: 300px;
  margin-bottom: 12px;
  text-align: left;
  border-radius: 10px;
  padding: 12px;
  transition: background-color 0.3s ease;
}

/* כותרת קבוצה */
.model-title {
  font-size: 18px;
  font-weight: bold;
  color: #34495e;
  margin-bottom: 0px;
  margin-top: 0;
}

/* רשימת כרטיסים */
.model-items {
  display: flex;
  gap: 15px;
  justify-content: flex-start;
  overflow-x: auto;
  white-space: nowrap;
  padding: 10px 0;
}

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

/* רקעים לפי קבוצות הסבר */
.group-shap {
  background-color: #e8f5e9; /* ירקרק עדין */
}

.group-lime {
  background-color: #fff9e6; /* צהבהב עדין */
}

.group-inherent {
  background-color: #e3f2fd; /* תכלת רך */
}

.group-default {
  background-color: #f5f5f5;
}
</style>
