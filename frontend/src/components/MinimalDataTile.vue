<template>
  <div class="data-tile">
    <div class="value" :style="{ color: getColor(value) }">
      {{ Math.abs(value).toFixed(1) }}%
    </div>
    <div class="label">{{ formatFeature(feature) }}</div>
  </div>
</template>

<script>
export default {
  name: "MinimalDataTile",
  props: {
    value: Number,
    feature: String,
  },
  methods: {
    getColor(val) {
      return val >= 0 ? "#cf1322" : "#389e0d";
    },
    formatFeature(f) {
      return f.replace(/_/g, " ").replace(/\b[a-z]/g, (c) => c.toUpperCase());
    },
  },
};
</script>

<style scoped>
.data-tile {
  width: 100px;
  padding: 10px;
  border-radius: 10px;
  background: #f9f9f9;
  text-align: center;
  font-family: 'Roboto', sans-serif;
  box-shadow: inset 0 0 0 1px #e0e0e0;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.value {
  font-size: 16px;
  font-weight: 600;
}

.label {
  font-size: 12px;
  color: #777;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>