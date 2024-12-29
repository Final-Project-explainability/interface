<template>
  <div class="model-section">
    <h3 class="model-title">{{ modelName }}</h3>
    <div class="model-items">
      <CircularFeature
        v-for="(feature, index) in modelData"
        :key="index"
        :feature="feature.name"
        :value="feature.percentage"
      />
    </div>
  </div>
</template>

<script>
import CircularFeature from "./CircularFeature.vue";

export default {
  name: "ModelExplainableSection",
  components: {
    CircularFeature,
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
  },
};
</script>

<style scoped>
.model-section {
  min-width: 300px;
  margin-bottom: 0px; /* רווח בין מודלים */
  text-align: left;
}

.model-title {
  font-size: 18px;
  font-weight: bold;
  color: #34495e;
  margin-bottom: 0px;
}

.model-items {
  display: flex;
  gap: 15px; /* רווח בין הפריטים */
  justify-content: flex-start; /* מיושר לשמאל */
  overflow-x: auto; /* גלילה אופקית במידה ויש יותר מדי פריטים */
  white-space: nowrap; /* פריטים נשארים באותה שורה */
  padding: 10px 0; /* רווח פנימי למראה נעים */
}

.model-items::-webkit-scrollbar {
  height: 8px; /* גובה גלילה אופקית */
}

.model-items::-webkit-scrollbar-thumb {
  background: #c0c0c0; /* צבע גלילה */
  border-radius: 4px; /* קצוות מעוגלים */
}

.model-items::-webkit-scrollbar-thumb:hover {
  background: #a0a0a0; /* צבע גלילה בהובר */
}
</style>
