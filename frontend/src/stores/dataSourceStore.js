import { defineStore } from 'pinia'; // Import Pinia's defineStore to create a store
import { ref } from 'vue'; // Import ref from Vue to create reactive state

// Define and export the data source store
export const useDataSourceStore = defineStore('dataSource', () => {
  // Retrieve the last selected dataset from localStorage (if available)
  const stored = localStorage.getItem('selectedDataset');

  // Reactive reference to the currently selected dataset
  // Defaults to 'DataSet 1' if nothing is stored
  const selectedDataset = ref(stored || 'DataSet 1');

  // Function to update the selected dataset
  const setDataset = (val) => {
    selectedDataset.value = val;
    localStorage.setItem('selectedDataset', val); // Also persist to localStorage
  };

  // Expose state and update function
  return {
    selectedDataset,
    setDataset
  };
});
