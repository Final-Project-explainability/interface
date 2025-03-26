<template>
  <div class="graph-buttons-container">
    <div class="graph-buttons">
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
    activeType: {
      type: String,
      required: true,
    },
    graphTypes: {
      type: Array,
      required: true,
    },
  },
  emits: ["updateType"],
  methods: {
    switchGraphType(type) {
      this.$emit("updateType", type);
    },
  },
};
</script>

<style scoped>
.graph-buttons {
  display: flex;
  gap: 4px;
  border-bottom: 2px solid #e0e0e0;
  position: relative;
}

.graph-button {
  position: relative;
  padding: 10px 16px;
  background: transparent;
  border: none;
  outline: none;
  font-size: 15px;
  font-weight: 500;
  color: #555;
  cursor: pointer;
  transition: color 0.25s ease;
}

.graph-button:hover {
  color: #1565c0;
}

.graph-button.active {
  color: #1565c0;
  font-weight: 600;
  background-color: #eaeaea; /* רקע אפור בהיר */
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
  border-bottom-left-radius: 0;
  border-bottom-right-radius: 0;
}


.graph-button.active::after {
  content: "";
  position: absolute;
  left: 0;
  bottom: -2px;
  width: 100%;
  height: 3px;
  background-color: #1565c0;
  border-radius: 4px;
  transition: all 0.3s ease;
}

</style>
