<template>
  <div class="model-section">
    <!-- Model Title -->
    <h3 class="model-title">{{ modelName }}</h3>

    <!-- Circular Features -->
    <div class="model-items">
      <CircularFeature
        v-for="(value, key) in modelData"
        :key="key"
        :feature="key"
        :value="value"
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
      type: Object,
      required: true,
    },
  },
};
</script>

<style scoped>
/* Individual Model Section */
.model-section {
  min-width: 300px; /* מינימום רוחב לכל סקשן */
  margin-bottom: 5px;
  text-align: left;
}

/* Model Title */
.model-title {
  font-size: 18px;
  font-weight: bold;
  color: #34495e;
  margin-bottom: 10px;
  margin-top: 0;
}

/* Model Items */
.model-items {
  display: flex;
  gap: 15px;
  justify-content: center; /* למרכז את העיגולים */
}


</style>
