<template>
  <div class="model-selector">
    <label for="model" class="model-label">Choose Model:</label>
    <select
      id="model"
      class="model-dropdown"
      :value="selectedModel"
      @change="$emit('update:selectedModel', $event.target.value)"
    >
      <option v-for="model in models" :key="model" :value="model">
        {{ model }}
      </option>
    </select>
  </div>
</template>

<script>
export default {
  name: "ModelSelector",
  props: {
    selectedModel: {
      type: String,
      required: true,
    },
    models: {
      type: Array,
      default: () => ["XGBOOST", "LogisticRegression", "DecisionTree"], // מודלים זמינים
    },
  },
};
</script>

<style scoped>
.model-selector {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 10px;
}

.model-label {
  font-size: 16px;
  font-weight: bold;
  color: #333;
  margin-bottom: 5px;
}

.model-dropdown {
  padding: 10px;
  font-size: 14px;
  border: 2px solid #ddd;
  border-radius: 5px;
  background: #fff;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  outline: none;
  width: 100%;
  max-width: 300px;
}

.model-dropdown:hover {
  border-color: #888;
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.2);
}


</style>
