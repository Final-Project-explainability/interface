<template>
  <div class="data-selector-row">
    <!-- Label for the selector -->
    <span class="selector-label">DataSet Selector:</span>
    <!-- Toggle button group for dataset selection -->
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
// Importing Pinia store for shared data source selection state
import { useDataSourceStore } from "@/stores/dataSourceStore";

// Reactive store instance
const store = useDataSourceStore();

// Available dataset options
const sources = ["DataSet 1", "DataSet 2"];

// Updates selected dataset in store & persists to localStorage
function select(source) {
  store.selectedDataset = source;
  localStorage.setItem("selectedDataset", source); // Persist selection in localStorage
}

// Formats dataset labels (replace dashes, capitalize first letters)
function formatLabel(label) {
  return label.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}
</script>

<style scoped>
/* Container for the entire selector row */
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

/* Styling for the label text */
.selector-label {
  font-size: 14px;
  font-weight: 600;
  color: #555;
  white-space: nowrap;
}

/* Wrapper for toggle buttons */
.toggle-group {
  display: flex;
  border: 1px solid #bbb;
  border-radius: 6px;
  overflow: hidden;
}

/* Individual toggle button styling */
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

/* Remove right border from last toggle button */
.toggle-button:last-child {
  border-right: none;
}

/* Hover state styling for toggles */
.toggle-button:hover {
  background-color: #dddddd;
}

/* Active toggle button styling */
.toggle-button.active {
  background-color: #4db6ac;
  color: white;
  font-weight: bold;
}
</style>
