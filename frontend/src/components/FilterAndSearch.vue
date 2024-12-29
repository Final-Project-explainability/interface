<template>
  <div class="filters-container">
        <!-- Search Input -->
    <input
      type="text"
      v-model="searchQuery"
      class="search-input"
      placeholder="Search features..."
      @input="updateFilters"
    />

    <!-- Filter by Type Dropdown -->
    <select v-model="selectedFilterType" class="filter-dropdown" @change="updateFilters">
      <option value="all">All (Default)</option>
      <option value="red">Red Only</option>
      <option value="green">Green Only</option>
    </select>

    <!-- Sort by Dropdown -->
    <select v-model="selectedSortOrder" class="filter-dropdown" @change="updateFilters">
      <option value="default">Default (No Sorting)</option>
      <option value="desc">Descending by % (Absolute)</option>
      <option value="asc">Ascending by % (Absolute)</option>
      <option value="abc">Sort by ABC</option>
    </select>

<!--    &lt;!&ndash; Search Input &ndash;&gt;-->
<!--    <input-->
<!--      type="text"-->
<!--      v-model="searchQuery"-->
<!--      class="search-input"-->
<!--      placeholder="Search features..."-->
<!--      @input="updateFilters"-->
<!--    />-->
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
  },
  data() {
    return {
      selectedFilterType: "all",
      selectedSortOrder: "default",
      searchQuery: "",
    };
  },
  methods: {
    updateFilters() {
      this.onUpdateFilters({
        filterType: this.selectedFilterType,
        sortOrder: this.selectedSortOrder,
        searchQuery: this.searchQuery,
      });
    },
  },
};
</script>

<style scoped>
.filters-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  gap: 10px;
  background-color: #f4f4f4;
  border-bottom: 1px solid #ddd;
  border-radius: 8px;
}

.filter-dropdown {
  padding: 5px;
  font-size: 14px;
  border-radius: 4px;
  border: 1px solid #ccc;
}

.search-input {
  padding: 5px 10px;
  font-size: 14px;
  border-radius: 4px;
  border: 1px solid #ccc;
  flex: 1;
}
</style>
