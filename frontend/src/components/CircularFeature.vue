<template>
  <div class="feature-container" :title="feature">
    <!-- Dynamic circle with colored background -->
    <div class="circle-container" :style="circleBackgroundStyle">
      <svg class="progress-ring" width="80" height="80">
        <!-- Circle background (grey stroke) -->
        <circle
          class="progress-ring__background"
          r="35"
          cx="40"
          cy="40"
        />
        <!-- Progress circle (color fills based on value) -->
        <circle
          class="progress-ring__progress"
          r="35"
          cx="40"
          cy="40"
          :style="progressStyle"
        />
      </svg>
      <!-- Percentage text in center -->
      <div class="circle-text">{{ Math.abs(value).toFixed(1) }}%</div>
    </div>
    <!-- Feature name below the circle -->
    <div class="feature-name" :title="feature">
      {{ formatFeature(feature) }}
    </div>
  </div>
</template>

<script>
export default {
  name: "FeatureCircle",
  props: {
    feature: {
      type: String,
      required: true, // Feature name (e.g., accuracy, precision)
    },
    value: {
      type: Number,
      required: true, // Percentage value (-100 to 100)
    },
  },
  computed: {
    // Styling for the progress circle stroke
    progressStyle() {
      const radius = 35; // Circle radius in pixels
      const circumference = 2 * Math.PI * radius; // Full circumference of the circle (used for stroke calculations)
      const absoluteValue = Math.abs(this.value); // Absolute value of the percentage (ensures positive values)
      const offset = circumference - (absoluteValue / 100) * circumference;
      // Offset determines how much of the stroke is hidden to visualize progress (0% = full hidden, 100% = full visible)
      const color = this.getColor(this.value); // Dynamically computed color based on positive/negative percentage

      return {
        strokeDasharray: `${circumference} ${circumference}`, // Defines the dash pattern of the stroke
        strokeDashoffset: offset,  // Controls visible progress by offsetting stroke
        stroke: color, // Stroke color based on feature value
        transition: "stroke-dashoffset 0.8s ease, stroke 0.8s ease", // Smooth animation on value changes
      };
    },
    // Styling for the circle background color
    circleBackgroundStyle() {
      const color = this.getColor(this.value, true); // Faded version
      return {
        backgroundColor: color,  // Soft background color reflecting the feature value
        borderRadius: "50%", // Ensures perfect circle
        width: "80px",
        height: "80px",
        display: "flex", // Centering text inside
        justifyContent: "center",
        alignItems: "center",
        transition: "background-color 0.8s ease", // Smooth background color transitions
      };
    },
  },
  methods: {
    // Formats feature name: replaces underscores, capitalizes words
    formatFeature(feature) {
      if (!feature || typeof feature !== "string") {
        return "";
      }
      return feature
        .replace(/_/g, " ") // Replace underscores with spaces
        .replace(/\b[a-z]/g, (char) => char.toUpperCase()); // Capitalize first letter of each word
    },
    // Returns dynamic color based on value (positive = red, negative = green)
    getColor(value, faded = false) {
      let baseColor;
      if (value < 0) {
        // Negative values map to shades of green (stronger green for larger negative values)
        const greenStrength = Math.min(100, Math.abs(value) * 5); // Cap at 100% saturation
        baseColor = `hsl(120, ${greenStrength}%, 50%)`; // green
      } else {
        // Positive values map to shades of red (stronger red for larger positive values)
        const redStrength = Math.min(100, value * 5); // Cap at 100% saturation
        baseColor = `hsl(0, ${redStrength}%, 50%)`; // red
      }

      if (faded) {
        // Convert to HSLA with alpha transparency for background usage
        return baseColor.replace("hsl", "hsla").replace(")", ", 0.2)");
      }
      return baseColor; // Return solid color for stroke
    },
  },
};
</script>

<style scoped>
/* Main container for the feature item */
.feature-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  width: 100px;
  font-family: Arial, sans-serif;
  gap: 10px;
  padding: 10px;
  background-color: #f1f1f1;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  position: relative;
}

/* Hover effect to slightly elevate the container with a stronger shadow */
.feature-container:hover {
  box-shadow: 0 6px 8px rgba(0, 0, 0, 0.2);
}

/* Container for the circular progress element */
.circle-container {
  position: relative;
  width: 80px;
  height: 80px;
}

/* Background ring of the SVG progress circle */
.progress-ring__background {
  stroke: #ffffff;
  stroke-width: 8;
  fill: none;
}

/* Foreground progress ring representing dynamic value */
.progress-ring__progress {
  stroke-width: 8;
  fill: none;
  stroke-linecap: round;
  transform: rotate(-90deg);
  transform-origin: center;
}

/* Percentage value displayed in the center of the circle */
.circle-text {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 14px;
  font-weight: bold;
  color: #000000;
}

/* Feature label under the circle */
.feature-name {
  font-size: 12px;
  font-weight: bold;
  color: #333;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 100%;
  cursor: help;
}
</style>



