<template>
  <div class="about-slider">
      <!-- Top menu bar -->
    <MenuBar />

    <!-- Timeline at the top (now narrower) -->
    <div class="timeline">
      <div class="timeline-path-background"></div>

      <!-- Progress indicator on the timeline -->
      <div class="timeline-path-progress" :style="{ width: progressWidth }"></div>

      <!-- Timeline steps for each slide -->
      <div
        v-for="(slide, index) in slides"
        :key="index"
        class="timeline-step"
        :ref="el => stepRefs[index] = el"
        @click="goToSlide(index)"
      >
        <!-- Step marker with active state styling -->
        <div class="step-marker" :class="{ active: index <= currentSlideIndex }">
          <span class="step-icon">{{ index + 1 }}</span>
        </div>
        <!-- Step label below the marker -->
        <span class="step-label" :class="{ active: index <= currentSlideIndex }">{{ slide.name }}</span>
      </div>
    </div>

    <!-- Active slide -->
    <div class="slide-container">
      <transition name="slide" mode="out-in">
        <component :is="currentSlide.component" :key="currentSlideIndex" />
      </transition>
    </div>

    <!-- Navigation buttons -->
    <div class="nav-buttons">
      <button @click="prevSlide" :disabled="currentSlideIndex === 0">← Previous</button>
      <button @click="nextSlide" :disabled="currentSlideIndex === slides.length - 1">Next →</button>
    </div>
  </div>
</template>

<script>
import MenuBar from "@/components/MenuBar.vue";
import SlideIntro from "./slides/SlideIntro.vue";
import SlideProblem from "./slides/SlideProblem.vue";
import SlideSolution from "./slides/SlideSolution.vue";
import SlideInterface from "./slides/SlideInterface.vue";
import SlideTeam from "./slides/SlideTeam.vue";
import SlideLinks from "./slides/SlideLinks.vue";
import AboutHero from "./slides/AboutHero.vue";

export default {
  components: {
    MenuBar,
    SlideIntro,
    SlideProblem,
    SlideSolution,
    SlideInterface,
    SlideTeam,
    SlideLinks,
    AboutHero,
  },
  data() {
    return {
      currentSlideIndex: 0, // Current slide index
      slides: [
        { name: "Introduction", component: "SlideIntro" },
        { name: "Team & Mentors", component: "AboutHero" },
        { name: "Problem", component: "SlideProblem" },
        { name: "Solution", component: "SlideSolution" },
        { name: "Interface", component: "SlideInterface" },
        { name: "Team", component: "SlideTeam" },
        { name: "Links", component: "SlideLinks" },
      ],
      stepRefs: [], // References to timeline step elements
      timelineLeftOffset: 0, // Offset for calculating progress width
    };
  },
  computed: {
    // Returns the current slide object based on currentSlideIndex
    currentSlide() {
      return this.slides[this.currentSlideIndex];
    },
    // Dynamically calculates the progress bar width based on current step position
    progressWidth() {
      const el = this.stepRefs[this.currentSlideIndex];
      if (!el || !this.timelineLeftOffset) return "0px";

      const centerX = el.getBoundingClientRect().left + el.offsetWidth / 2;
      const distance = centerX - this.timelineLeftOffset;
      return `${distance}px`;
    },
  },
  mounted() {
    this.$nextTick(() => {
      this.setTimelineOffset();
    });
    window.addEventListener("resize", this.setTimelineOffset);
  },
  beforeUnmount() {
    window.removeEventListener("resize", this.setTimelineOffset);
  },
  methods: {
    // Calculates the left offset of the timeline background (used for progress calculation)
    setTimelineOffset() {
      const timelineEl = this.$el.querySelector(".timeline-path-background");
      if (timelineEl) {
        this.timelineLeftOffset = timelineEl.getBoundingClientRect().left;
      }
    },
    // Moves to the next slide
    nextSlide() {
      if (this.currentSlideIndex < this.slides.length - 1) {
        this.currentSlideIndex++;
      }
    },
    // Moves to the previous slide
    prevSlide() {
      if (this.currentSlideIndex > 0) {
        this.currentSlideIndex--;
      }
    },
    // Direct navigation to a specific slide by index
    goToSlide(index) {
      this.currentSlideIndex = index;
    },
  },
};
</script>

<style scoped>
.about-slider {
  display: flex;
  flex-direction: column;
  width: 100vw;
  height: 100vh;
  background: #ffffff;
  overflow: hidden;
}

/* === Timeline Bar Styling === */
.timeline {
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
  padding: 0px 40px;
  background: #f8fafc;
  border-bottom: 1px solid #e2e8f0;
  z-index: 10;
  min-height: 70px;
}

/* Timeline dashed background path */
.timeline-path-background {
  position: absolute;
  top: 24px;
  left: 60px;
  right: 40px;
  height: 4px;
  background: repeating-linear-gradient(
    90deg,
    #d1d5db 0,
    #d1d5db 10px,
    transparent 10px,
    transparent 20px
  );
  border-radius: 2px;
  z-index: 0;
}

/* Timeline progress bar */
.timeline-path-progress {
  position: absolute;
  top: 24px;
  left: 60px;
  height: 4px;
  background: linear-gradient(90deg, #1e3a8a, #3b82f6);
  transition: width 0.6s ease-in-out;
  box-shadow: 0 0 8px rgba(59, 130, 246, 0.4);
  border-radius: 2px;
  z-index: 1;
}

/* Timeline step (marker & label) */
.timeline-step {
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  z-index: 2;
  cursor: pointer;
  transition: transform 0.25s ease, opacity 0.25s ease;
}

.timeline-step:hover {
  transform: scale(1.1);
}

/* Marker circle for each step */
.step-marker {
  width: 26px;
  height: 24px;
  border-radius: 50%;
  background-color: #ffffff;
  border: 2px solid #d1d5db;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: all 0.3s ease;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
}

/* Active step marker highlight */
.step-marker.active {
  border-color: #3b82f6;
  background-color: #dbeafe;
  transform: scale(1.1);
}

/* Marker icon number */
.step-icon {
  font-size: 12px;
  font-weight: bold;
  color: #6b7280;
}

.step-marker.active .step-icon {
  color: #1e3a8a;
}

/* Label under each marker */
.step-label {
  margin-top: 6px;
  font-size: 12px;
  font-weight: 600;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 0.4px;
  transition: color 0.3s ease;
}

.step-label.active {
  color: #1e3a8a;
}

/* Slide display area */
.slide-container {
  height: calc(100vh - 110px - 80px); /* Full height minus top & bottom bars */
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0;
  overflow: hidden;
}

/* Navigation buttons area */
.nav-buttons {
  display: flex;
  justify-content: space-between;
  padding: 20px 60px;
  background: #f8fafc;
  border-top: 1px solid #e2e8f0;
}

/* General button styling */
button {
  background: #3b82f6;
  color: white;
  border: none;
  padding: 12px 24px;
  font-weight: bold;
  border-radius: 10px;
  cursor: pointer;
  transition: background 0.3s ease, transform 0.2s ease;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
}

button:hover:enabled {
  background: #1e3a8a;
  transform: translateY(-2px);
}

button:disabled {
  background: #d1d5db;
  cursor: not-allowed;
}

/* Slide transition animations */
.slide-enter-active,
.slide-leave-active {
  transition: all 0.6s ease;
}

.slide-enter {
  opacity: 0;
  transform: translateX(40px);
}

.slide-leave-to {
  opacity: 0;
  transform: translateX(-40px);
}
</style>