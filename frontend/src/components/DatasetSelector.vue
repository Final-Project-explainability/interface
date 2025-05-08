<template>
  <div class="data-selector-row">
    <span class="selector-label">DataSet Selector:</span>
    <div class="toggle-group">
      <button
        v-for="source in sources"
        :key="source"
        :class="['toggle-button', { active: source === store.selectedDataset }]"
        @click="select(source)"
      >
        {{ formatLabel(source) }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { useDataSourceStore } from "@/stores/dataSourceStore";

const store = useDataSourceStore();
const sources = ["DataSet 1", "DataSet 2"];

function select(source) {
  store.selectedDataset = source;
  localStorage.setItem("selectedDataset", source); // ✅ שמירה ל-localStorage
}


function formatLabel(label) {
  return label.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}
</script>



<style scoped>
.data-selector-row {
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(145deg, #f0f0f0, #e0e0e0);
  border: 1px solid #c0c0c0;
  border-radius: 12px;
  padding: 10px 16px;
  box-shadow: inset 0 1px 3px rgba(0,0,0,0.05);
  gap: 12px;
  margin-top: 15px;
  flex-wrap: wrap;
}

.selector-label {
  font-size: 14px;
  font-weight: 600;
  color: #555;
  white-space: nowrap;
}

.toggle-group {
  display: flex;
  border: 1px solid #bbb;
  border-radius: 6px;
  overflow: hidden;
}

.toggle-button {
  padding: 6px 14px;
  font-size: 13px;
  background: #eeeeee;
  color: #333;
  border: none;
  outline: none;
  cursor: pointer;
  transition: background-color 0.2s ease, color 0.2s ease;
  font-weight: 500;
  border-right: 1px solid #ccc;
}

.toggle-button:last-child {
  border-right: none;
}

.toggle-button:hover {
  background-color: #dddddd;
}

.toggle-button.active {
  background-color: #4db6ac;
  color: white;
  font-weight: bold;
}
</style>
