// src/stores/panelStore.js
import { defineStore } from 'pinia';
import { ref } from 'vue';

export const usePanelStore = defineStore('panelStore', () => {
  const selectedPanel = ref('Home');

  const setPanel = (panel) => {
    selectedPanel.value = panel;
  };

  return { selectedPanel, setPanel };
});
