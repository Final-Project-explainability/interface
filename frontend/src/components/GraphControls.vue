<template>
  <div class="graph-buttons-container">
    <div class="graph-buttons">
      <!-- כפתורים לבחירת סוג הגרף -->
      <button
        v-for="type in graphTypes"
        :key="type"
        class="graph-button"
        :class="{ active: activeType === type }"
        @click="switchGraphType(type)"
      >
        {{ type }}
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: "GraphControls",
  props: {
    // סוג הגרף הפעיל
    activeType: {
      type: String,
      required: true,
    },
    // סוגי גרפים זמינים
    graphTypes: {
      type: Array,
      required: true,
    },
  },
  emits: ["updateType"],
  methods: {
    switchGraphType(type) {
      this.$emit("updateType", type); // שולח את סוג הגרף שנבחר להורה
    },
  },
};
</script>

<style scoped>
.graph-buttons-container {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  margin-bottom: 20px;
}

.graph-buttons {
  display: flex;
  gap: 10px;
}

.graph-button {
  padding: 8px 16px;
  border-radius: 20px;
  background-color: #e0f7fa;
  border: 2px solid #004d40;
  color: #004d40;
  font-size: 14px;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.2s ease;
}

.graph-button:hover {
  background-color: #004d40;
  color: #ffffff;
  transform: scale(1.05); /* הגדלה עדינה */
}

.graph-button.active {
  background-color: #004d40;
  color: #ffffff;
}
</style>
