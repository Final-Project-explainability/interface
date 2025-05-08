import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useDataSourceStore = defineStore('dataSource', () => {
  const stored = localStorage.getItem('selectedDataset');
  const selectedDataset = ref(stored || 'DataSet 1');

  const setDataset = (val) => {
    selectedDataset.value = val;
    localStorage.setItem('selectedDataset', val); // שמור גם בלוקל סטורג'
  };

  return {
    selectedDataset,
    setDataset
  };
});
