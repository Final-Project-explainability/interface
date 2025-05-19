<template>
  <div class="search-container">
    <!-- Search input field -->
    <input
      type="text"
      class="search-input"
      v-model="searchQuery"
      placeholder="Enter patient ID..."
    />
    <!-- Search button -->
    <button class="search-button" @click="onSearch">
      Search
    </button>
  </div>
</template>

<script>
export default {
  name: "PatientSearch",
  data() {
    return {
      searchQuery: "", // Value of the input field
    };
  },
  methods: {
    onSearch() {
      if (this.searchQuery.trim()) {
        this.$emit("search", this.searchQuery.trim());// Emit event with patient ID
        this.searchQuery = ""; // Clear the input field
      } else {
        alert("Please enter a valid patient ID."); // Show error message if input is empty
      }
    },
  },
};
</script>

<style scoped>
/* Main container for search components */
.search-container {
  display: flex;
  flex-wrap: nowrap;
  justify-content: flex-start;
  align-items: center;
  gap: 10px;
  background-color: rgba(255, 255, 255, 0.8);
  padding: 10px 20px;
  border-radius: 20px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  max-width: 100%;
  margin: 0 auto;
  border: 1px solid #ddd;
}

/* Search input field */
.search-input {
  flex: 1;
  min-width: 0;
  padding: 12px 15px;
  border: 2px solid #ddd;
  border-radius: 10px;
  font-size: calc(6px + 0.5vw);
  transition: all 0.3s ease;
  outline: none;
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.1);
}

.search-input:focus {
  border-color: #4caf50;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

/* Search button */
.search-button {
  flex-shrink: 0;
  padding: 12px 20px;
  font-size: 16px;
  font-weight: bold;
  color: white;
  background-color: #00796b;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.search-button:hover {
  background-color: #004d40; /* Darker teal on hover */
  box-shadow: 0 6px 10px rgba(0, 0, 0, 0.2); /* Stronger shadow */
}

.search-button:active {
  transform: scale(0.95); /* Click animation effect */
}

/* Responsive adjustments for small screens */
@media (max-width: 480px) {
  .search-container {
    flex-direction: column; /* Stack elements vertically */
    gap: 10px;
    width: 90%;
    margin: 0 auto;
  }

  .search-input,
  .search-button {
    width: 100%; /* Full width for input and button */
  }
}
</style>