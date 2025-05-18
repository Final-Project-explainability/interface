<template>
  <div class="graph-controls">
    <!-- Graph Type Selector -->
    <div class="graph-buttons">
      <button
        v-for="type in graphTypes"
        :key="type"
        class="graph-button"
        :class="{ active: activeType === type }"
        @click="$emit('updateType', type)"
      >
        {{ type }}
      </button>
    </div>

    <!-- Model Selector -->
    <div class="model-buttons">
      <button
        v-for="model in modelList"
        :key="model"
        class="model-button"
        :class="{ active: selectedModel === model }"
        @click="$emit('updateModel', model)"
      >
        {{ model }}
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: "GraphControls",
  props: {
    activeType: {
      type: String, // Currently selected graph type
      required: true,
    },
    graphTypes: {
      type: Array, // Available graph types to select from
      required: true,
    },
    selectedModel: String, // Currently selected model
    modelList: Array,      // Available models to select from
  },
  emits: ["updateType", "updateModel"],
  methods: {
    switchGraphType(type) {
      this.$emit("updateType", type);
    },
  },
};
</script>

<style scoped>
/* Graph type buttons wrapper */
.graph-buttons {
  display: flex;
  gap: 4px;
  border-bottom: 2px solid #e0e0e0;
  position: relative;
}

/* Individual graph type button */
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

/* Hover effect for graph button */
.graph-button:hover {
  color: #1565c0;
}

/* Active graph button styling */
.graph-button.active {
  color: #1565c0;
  font-weight: 600;
  background-color: #eaeaea; /* רקע אפור בהיר */
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
  border-bottom-left-radius: 0;
  border-bottom-right-radius: 0;
}

/* Bottom highlight bar for active graph button */
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

/* Container for graph and model controls */
.graph-controls {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0px;
}


/* Model selection buttons wrapper */
.model-buttons {
  display: flex;
  border-radius: 10px;
  overflow: hidden;
  border: 1px solid rgba(0, 122, 120, 0.2);
  background: rgba(0, 122, 120, 0.06); /* Light turquoise background */
}

/* Individual model button */
.model-button {
  flex: 1;
  padding: 3px 18px;
  font-size: 12px;
  font-weight: 500;
  border: none;
  background: transparent;
  color: #007a78;
  cursor: pointer;
  position: relative;
  transition: all 0.25s ease;
}

/* Vertical divider between model buttons */
.model-button:not(:last-child)::after {
  content: "";
  position: absolute;
  right: 0;
  top: 20%;
  height: 60%;
  width: 1px;
  background-color: rgba(0, 122, 120, 0.2);
}

/* Hover effect for model button */
.model-button:hover {
  background-color: rgba(0, 122, 120, 0.08);
}

/* Active model button styling */
.model-button.active {
  background-color: #007a78;
  color: #fff;
}
</style>