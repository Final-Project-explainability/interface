// src/stores/panelStore.js
import { defineStore } from 'pinia'; // Import defineStore from Pinia to create a store
import { ref } from 'vue'; // Import ref from Vue to create reactive state

// Define and export a Pinia store named 'panelStore'
export const usePanelStore = defineStore('panelStore', () => {
  // Reactive state: stores the currently selected panel (default is 'Home')
  const selectedPanel = ref('Home');

  // Method to update the selected panel
  const setPanel = (panel) => {
    selectedPanel.value = panel;
  };

  // Expose state and method to components
  return { selectedPanel, setPanel };
});
