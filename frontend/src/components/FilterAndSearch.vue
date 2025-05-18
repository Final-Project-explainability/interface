<template>
  <div class="filters-container">
    <!-- Search Input -->
    <input
      type="text"
      v-model="searchQuery"
      class="search-input"
      placeholder="🔍 Search features..."
      @input="handleSearchInput"
    />

    <!-- Filter by Type Dropdown -->
    <select v-model="selectedFilterType" class="filter-dropdown" @change="updateFilters">
      <option value="all">All (Default)</option>
      <option value="red">🔴 Red Only</option>
      <option value="green">🟢 Green Only</option>
    </select>

    <!-- Sort by Dropdown -->
    <select v-model="selectedSortOrder" class="filter-dropdown" @change="updateFilters">
      <option value="default">Default (Avg. Importance)</option>
      <option value="desc">↓ Descending by %</option>
      <option value="asc">↑ Ascending by %</option>
      <option value="abc">🔤 Sort by ABC</option>
    </select>

    <!-- View Mode Icons -->
    <div class="view-mode-buttons">
      <button
        class="view-button"
        :class="{ active: viewMode === 'circular' }"
        @click="changeViewMode('circular')"
        title="Circular View"
      >🔵</button>

      <button
        class="view-button"
        :class="{ active: viewMode === 'vital' }"
        @click="changeViewMode('vital')"
        title="Card View"
      >📊</button>

      <button
        class="view-button"
        :class="{ active: viewMode === 'mini' }"
        @click="changeViewMode('mini')"
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
      required: true, // Callback to update filters in parent component
    },
    viewMode: {
      type: String,
      default: "vital", // Default view mode
    },
    searchQuery: {
      type: String,
      default: "", // Initial search query value
    },
  },
  data() {
    return {
      selectedFilterType: "all", // Default filter type
      selectedSortOrder: "default", // Default sorting option
      searchQuery: "", // Local search query state
    };
  },
  methods: {
    // Change view mode and notify parent component
    changeViewMode(mode) {
      // Emit v-model update for viewMode (parent binding)
      this.$emit("update:viewMode", mode);

      // Emit updated filter state as well
      this.$emit("updateFilters", {
        filterType: this.selectedFilterType,
        sortOrder: this.selectedSortOrder,
        searchQuery: this.searchQuery,
        viewMode: mode,
      });
    },
    // Trigger filter update on dropdown changes
    updateFilters() {
      this.$emit("updateFilters", {
        filterType: this.selectedFilterType,
        sortOrder: this.selectedSortOrder,
        searchQuery: this.searchQuery,
        viewMode: this.viewMode,
      });
    },
    // Handle search input typing
    handleSearchInput() {
      this.updateFilters(); // Apply filters on each keystroke
      this.$emit("update:searchQuery", this.searchQuery); // Sync with v-model binding
    },
  },
};
</script>

<style scoped>
/* Main container for filter controls */
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
  border: 1px solid #e3e8ee;
}

/* Input fields styling */
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

/* Focus state highlight */
.search-input:focus,
.filter-dropdown:focus {
  border-color: #6366f1;
  background-color: #fff;
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.2);
}

/* Hover effect on inputs */
.filter-dropdown:hover,
.search-input:hover {
  background-color: #f3f4f6;
  border-color: #a5b4fc;
}

/* Search input expands to available space */
.search-input {
  flex: 1;
  min-width: 220px;
}

/* View mode buttons group */
.view-mode-buttons {
  display: flex;
  gap: 8px;
  margin-left: auto; /* Pushes to the right */
}

/* View mode buttons appearance */
.view-button {
  background: #f3f4f6;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  padding: 6px 10px;
  font-size: 20px;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
}

/* Hover effect for view buttons */
.view-button:hover {
  background-color: #e0e7ff;
  border-color: #6366f1;
}

/* Active state styling */
.view-button.active {
  background-color: #6366f1;
  color: white;
  border-color: #4f46e5;
}

/* Responsive behavior for mobile */
@media (max-width: 600px) {
  .filters-container {
    flex-direction: column;
    align-items: stretch;
  }

  .search-input,
  .filter-dropdown {
    width: 100%;
  }

  .view-mode-buttons {
    justify-content: center;
    margin-left: 0;
    margin-top: 10px;
  }
}
</style>