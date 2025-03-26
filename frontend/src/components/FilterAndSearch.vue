<template>
  <div class="filters-container">
    <!-- Search Input -->
    <input
      type="text"
      v-model="searchQuery"
      class="search-input"
      placeholder="🔍 Search features..."
      @input="updateFilters"
    />

    <!-- Filter by Type Dropdown -->
    <select v-model="selectedFilterType" class="filter-dropdown" @change="updateFilters">
      <option value="all">All (Default)</option>
      <option value="red">🔴 Red Only</option>
      <option value="green">🟢 Green Only</option>
    </select>

    <!-- Sort by Dropdown -->
    <select v-model="selectedSortOrder" class="filter-dropdown" @change="updateFilters">
      <option value="default">Default (No Sorting)</option>
      <option value="desc">↓ Descending by %</option>
      <option value="asc">↑ Ascending by %</option>
      <option value="abc">🔤 Sort by ABC</option>
    </select>

    <!-- View Mode Icons -->
    <div class="view-mode-buttons">
      <button
        class="view-button"
        :class="{ active: viewMode === 'circular' }"
        @click="setViewMode('circular')"
        title="Circular View"
      >🔵</button>

      <button
        class="view-button"
        :class="{ active: viewMode === 'vital' }"
        @click="setViewMode('vital')"
        title="Card View"
      >📊</button>

      <button
        class="view-button"
        :class="{ active: viewMode === 'mini' }"
        @click="setViewMode('mini')"
        title="Compact View"
      >🧩</button>
    </div>
  </div>
</template>


<script>
export default {
  name: "FilterAndSearch",
  props: {
    onUpdateFilters: {
      type: Function,
      required: true,
    },
    viewMode: {
      type: String,
      default: "vital",
    },
  },
  data() {
    return {
      selectedFilterType: "all",
      selectedSortOrder: "default",
      searchQuery: "",
      // viewMode: "vital", // אפשרויות: "vital", "circular", "mini"
    };
  },
  methods: {
    updateFilters() {
      this.$emit("updateFilters", {
        filterType: this.selectedFilterType,
        sortOrder: this.selectedSortOrder,
        searchQuery: this.searchQuery,
        viewMode: this.viewMode, // עכשיו זה מגיע מ־prop
      });
    },
    setViewMode(mode) {
      this.$emit("update:viewMode", mode); // ← מעדכן את האב
      this.updateFilters();
    },
  },
};
</script>

<style scoped>
.filters-container {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
  align-items: center;
  gap: 12px;
  padding: 10px;
  background: #ffffff;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);
  margin: 0;
  border: 1px solid #e3e8ee; /* צבע מסגרת עדין */

}

.search-input,
.filter-dropdown {
  padding: 10px 14px;
  font-size: 15px;
  border-radius: 8px;
  border: 1px solid #d1d5db;
  outline: none;
  transition: all 0.2s ease-in-out;
  background-color: #f9fafb;
  color: #111827;
  box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.04);
}

.search-input:focus,
.filter-dropdown:focus {
  border-color: #6366f1;
  background-color: #fff;
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.2);
}

.filter-dropdown:hover,
.search-input:hover {
  background-color: #f3f4f6;
  border-color: #a5b4fc;
}

.search-input {
  flex: 1;
  min-width: 220px;
}

@media (max-width: 600px) {
  .filters-container {
    flex-direction: column;
    align-items: stretch;
  }

  .search-input,
  .filter-dropdown {
    width: 100%;
  }
}

.view-mode-buttons {
  display: flex;
  gap: 8px;
  margin-left: auto; /* מקבע אותם לצד ימין של השורה */
}

.view-mode-buttons button {
  background: #f3f4f6;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  padding: 6px 10px;
  font-size: 20px;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
}

.view-mode-buttons button:hover {
  background-color: #e0e7ff;
  border-color: #6366f1;
}

.view-mode-buttons button.active {
  background-color: #6366f1;
  color: white;
  border-color: #4f46e5;
}

</style>
