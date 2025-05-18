<template>
  <div class="feature-item">
    <div class="feature-name">{{ feature }}</div>
    <div class="feature-value">{{ value.toFixed(2) }}</div>
  </div>
</template>

<script>
export default {
  name: "FeatureItem",
  props: {
    feature: {
      type: String,
      required: true,
    },
    value: {
      type: Number,
      required: true,
    },
  },
};
</script>

<style scoped>
.feature-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-width: 100px;
  height: 80px;
  background: #e8f5e9;
  border: 2px solid #c8e6c9;
  border-radius: 8px;
  padding: 10px;
  text-align: center;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
}

.feature-item:hover {
  transform: translateY(-5px);
  box-shadow: 0px 8px 12px rgba(0, 0, 0, 0.15);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.feature-name {
  font-size: 14px;
  font-weight: bold;
  color: #1b5e20;
  margin-bottom: 5px;
}

.feature-value {
  font-size: 16px;
  font-weight: bold;
  color: #388e3c;
}
</style>
