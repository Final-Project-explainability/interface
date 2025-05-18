<template>
  <div class="comparison-table">
    <!-- 🔍 External Search Filter -->
    <div class="top-row">
      <div class="external-search">
        <input
          type="text"
          v-model="externalSearchQuery"
          placeholder="Filter displayed features..."
        />
      </div>

      <!-- 🔽 Feature Selection Dropdown -->
      <div class="dropdown-container" @click="toggleDropdown">
        <div class="dropdown-toggle">
          {{ selectedFeatures.length ? `${selectedFeatures.length} features selected` : 'Select features...' }}
          <span class="arrow">&#9662;</span>
        </div>

        <div class="dropdown-content" v-if="dropdownOpen" @click.stop>
          <!-- Internal Search within Dropdown -->
          <input
            type="text"
            v-model="searchQuery"
            placeholder="Search in dropdown..."
            class="search-input"
          />

          <!-- Select All / Clear All Actions -->
          <div class="dropdown-actions">
            <button @click.stop="selectAll">
              <i class="fas fa-check-circle"></i> Select All
            </button>
            <button @click.stop="clearAll">
              <i class="fas fa-times-circle"></i> Clear All
            </button>
          </div>

          <!-- List of Available Features with Checkboxes -->
          <div class="feature-list">
            <label
              v-for="feature in filteredFeatureList"
              :key="feature"
              class="feature-option"
            >
              <input type="checkbox" :value="feature" v-model="selectedFeatures" />
              {{ feature }}
            </label>
          </div>
        </div>
      </div>
    </div>

    <!-- 🧾 Comparison Table -->
    <div class="table-wrapper">
      <table v-if="filteredDisplayedFeatures.length">
        <thead>
          <tr>
            <th class="header-cell">Feature</th>
            <th class="header-cell">SHAP</th>
            <th class="header-cell">LIME</th>
            <th class="header-cell">Inherent</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="feature in filteredDisplayedFeatures" :key="feature">
            <td class="feature-name">{{ feature }}</td>
            <td :style="cellStyle(model.SHAP[feature])">{{ model.SHAP[feature].toFixed(2) }}</td>
            <td :style="cellStyle(model.LIME[feature])">{{ model.LIME[feature].toFixed(2) }}</td>
            <td :style="cellStyle(model.Inherent[feature])">{{ model.Inherent[feature].toFixed(2) }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
export default {
  name: "ComparisonTable",
  props: {
    data: Object,
    selectedModel: String,
  },
  data() {
    return {
      dropdownOpen: false,
      searchQuery: "",
      externalSearchQuery: "",
      selectedFeatures: [],
    };
  },
  computed: {
    // Retrieves the selected model data or defaults to empty objects
    model() {
      return this.data?.[this.selectedModel] ?? {
        SHAP: {},
        LIME: {},
        Inherent: {},
      };
    },
    // Returns all available features from SHAP keys
    allFeatures() {
      return Object.keys(this.model.SHAP || {});
    },
    // Filters feature list based on dropdown internal search query
    filteredFeatureList() {
      return this.allFeatures.filter((f) =>
        f.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    },
    // Filters selected features based on external search input
    filteredDisplayedFeatures() {
      return this.selectedFeatures.filter((f) =>
        f.toLowerCase().includes(this.externalSearchQuery.toLowerCase())
      );
    },
  },
  watch: {
    // Updates selected features when model changes
    model: {
      handler() {
        this.selectedFeatures = [...this.allFeatures];
      },
      immediate: true,
    },
  },
  methods: {
    toggleDropdown() {
      this.dropdownOpen = !this.dropdownOpen;
    },
    selectAll() {
      this.selectedFeatures = [...this.allFeatures];
    },
    clearAll() {
      this.selectedFeatures = [];
    },
    // Calculates cell background color based on value intensity
    cellStyle(value) {
      const alpha = Math.min(1, value / 7);
      return {
        backgroundColor: `rgba(0, 122, 120, ${alpha})`,
        color: alpha > 0.6 ? "#fff" : "#000",
      };
    },
  },
};
</script>

<style scoped>
/* 🗂 Main container for the comparison table layout */
.comparison-table {
  display: flex;
  flex-direction: column;
  gap: 16px;
  height: 100%;
}

/* 🔍 Top control bar: external search & feature selection dropdown */
.top-row {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 12px;
}

/* 🔎 External search input styling */
.external-search input {
  padding: 8px 12px;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-size: 14px;
  width: 220px;
}

/* 🔽 Dropdown container for feature selection */
.dropdown-container {
  position: relative;
  width: 260px;
  user-select: none;
  font-size: 14px;
  direction: ltr;
}

/* 🖱 Dropdown toggle button styling */
.dropdown-toggle {
  padding: 10px 14px;
  background-color: #f1f1f1;
  border-radius: 12px;
  border: 1px solid #ccc;
  cursor: pointer;
  color: #000;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

/* ⬇️ Dropdown arrow icon */
.arrow {
  font-size: 12px;
}

/* 📋 Dropdown content panel (feature list & actions) */
.dropdown-content {
  position: absolute;
  top: 105%;
  right: 0;
  width: 100%;
  max-height: 320px;
  background-color: #fff;
  border-radius: 12px;
  border: 1px solid #ccc;
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.1);
  z-index: 100;
  padding: 10px;
  direction: ltr;
}

/* 🔎 Internal search input inside the dropdown */
.search-input {
  width: 100%;
  max-width: 92%;
  padding: 6px 10px;
  margin-bottom: 8px;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-size: 13px;
}

/* 🎛 Actions row: Select All / Clear All buttons */
.dropdown-actions {
  display: flex;
  justify-content: space-between;
  gap: 8px;
  margin-bottom: 8px;
}

/* 🖱 Dropdown action buttons styling */
.dropdown-actions button {
  flex: 1;
  background: #e9f5f5;
  color: #007a78;
  border: 1px solid #007a78;
  padding: 6px 10px;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.25s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
}

/* 🖱 Hover effect for dropdown action buttons */
.dropdown-actions button:hover {
  background-color: #007a78;
  color: #fff;
}

/* 📜 Scrollable feature list inside dropdown */
.feature-list {
  display: flex;
  flex-direction: column;
  max-height: 180px;
  overflow-y: auto;
  gap: 6px;
}

/* 🔘 Individual feature option (checkbox + label) */
.feature-option {
  font-size: 13px;
  display: flex;
  align-items: center;
  gap: 8px;
  color: #333;
}

/* 📊 Table container with scroll if needed */
.table-wrapper {
  flex: 1;
  overflow-y: auto;
}

/* 🗒 Table structure and layout */
table {
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
}


/* 🧱 Table cells styling */

th,
td {
  padding: 8px 12px;
  text-align: center;
  border: 1px solid #ddd;
}

/* 🏷 Table header cells styling */
.header-cell {
  background-color: #f2f2f2;
  color: #000;
  font-weight: 600;
}

/* 🏷 Feature name column styling */
.feature-name {
  color: #000;
  text-align: left;
  font-weight: 500;
}
</style>
