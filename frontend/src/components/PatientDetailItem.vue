<template>
  <div
    class="badge-card"
    :title="`${title}: ${value}`"
    :style="{ background: backgroundColor }"
  >
    <!-- Icon circle -->
    <div class="icon">{{ icon }}</div>

    <!-- Main value text -->
    <div class="value">{{ value }}</div>

    <!-- Title label -->
    <div class="title">{{ title }}</div>

    <!-- Decorative glow effect -->
    <div
      class="glow"
      :style="{
        background: `radial-gradient(circle, ${glowColor}, transparent 70%)`,
      }"
    />
  </div>
</template>

<script>
export default {
  name: "PatientDetailItem",
  props: {
    // Label for the metric (e.g., "Heart Rate")
    title: {
      type: String,
      required: true,
    },
    // Value to display (as string)
    value: {
      type: String,
      required: true,
    },
    // Emoji or icon character (default stethoscope)
    icon: {
      type: String,
      default: "🩺",
    },
    // Color for the glow effect (light by default)
    glowColor: {
      type: String,
      default: "rgba(173, 216, 230, 0.25)",
    },
    // Background style for card container
    backgroundColor: {
      type: String,
      default: "linear-gradient(135deg, #f9fcff, #edf4fa)",
    },
  },
};
</script>

<style scoped>
/* === Main Card Container === */
.badge-card {
  border: 1px solid #e0e0e0;
  border-radius: 14px;
  padding: 28px 12px 12px;
  width: 160px;
  text-align: center;
  position: relative;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  transition: transform 0.25s ease, box-shadow 0.25s ease;
}

/* Hover effect: lift and stronger shadow */
.badge-card:hover {
  transform: translateY(-4px) scale(1.02);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.12);
  border-color: #cfe8f9;
}

/* === Icon Circle === */
.icon {
  width: 45px;
  height: 45px;
  font-size: 25px;
  background: #ffffff;
  border-radius: 50%;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 4px rgba(0, 0, 0, 0.1);
  position: absolute;
  top: -14px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 3;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

/* Icon hover animation: slight rotation and shadow */
.badge-card:hover .icon {
  transform: translateX(-50%) rotate(4deg);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

/* === Decorative Glow Effect === */
.glow {
  position: absolute;
  top: -10px;
  right: -10px;
  width: 60px;
  height: 60px;
  z-index: 1;
  pointer-events: none;
  border-radius: 50%;
}

/* === Value Text === */
.value {
  font-size: 18px;
  font-weight: 600;
  margin-top: 14px;
  color: #0077b6;
  transition: color 0.3s ease;
  position: relative;
  z-index: 2;
}

/* === Title Text === */
.title {
  font-size: 12px;
  color: #666;
  transition: color 0.3s ease;
  position: relative;
  z-index: 2;
}

/* Value & title color shift on hover */
.badge-card:hover .value {
  color: #005f8c;
}

.badge-card:hover .title {
  color: #444;
}
</style>