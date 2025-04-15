<template>
  <div class="about-slider">
    <MenuBar />

<<<<<<< Updated upstream
    <div class="hero-section">
      <div class="info-grid">
        <!-- צד שמאל: מידע תמציתי -->
        <div class="info-section">
          <h1 class="title">🧠 Explainability ICU</h1>
          <p class="subtitle">
            A smart ICU system for AI prediction explainability. Built to support
            clinical decision-making through local and global insights. dfhgkjldfkjg
          </p>

          <div class="quick-facts">
            <h2><i class="fas fa-microscope"></i> Highlights</h2>
            <ul>
              <li>🩺 Predict ICU mortality (24h data)</li>
              <li>🧩 Compare SHAP, LIME, PDP</li>
              <li>🌍 Local & Global views</li>
              <li>📘 Feature Dictionary</li>
              <li>👩‍⚕️ Clinician feedback</li>
            </ul>
          </div>

          <div class="quick-links">
            <h2><i class="fab fa-github"></i> GitHub</h2>
            <div class="links">
              <a href="https://github.com/Final-Project-explainability/interface" target="_blank">Frontend</a>
              <a href="https://github.com/Final-Project-explainability/main" target="_blank">Backend</a>
              <a href="https://youtu.be/xw0PxcqokEs?si=rz6yrF7nqKlz_iVM" target="_blank">🎥 Demo</a>
            </div>
          </div>
        </div>

        <!-- צד ימין: צוות -->
        <div class="team-section">
          <h2 class="team-title"><i class="fas fa-users-cog"></i> The Team</h2>
          <div class="team-grid">
            <TeamCard name="Alon Azran" role="Frontend Engineer" img="https://i.pravatar.cc/100?u=alon" />
            <TeamCard name="Ofir Tamir" role="Backend Developer" img="https://i.pravatar.cc/100?u=ofir" />
            <TeamCard name="Oded Atias" role="ML & Explainability" img="https://i.pravatar.cc/100?u=oded" />
          </div>
=======
    <!-- ציר זמן בחלק העליון -->
    <div class="timeline">
      <div class="timeline-path-background"></div>
      <div class="timeline-path-progress" :style="{ width: progressWidth + '%' }"></div>
      <div
        v-for="(slide, index) in slides"
        :key="index"
        class="timeline-step"
        @click="goToSlide(index)"
      >
        <div class="step-marker" :class="{ active: index <= currentSlideIndex }">
          <span class="step-icon">{{ index + 1 }}</span>
>>>>>>> Stashed changes
        </div>
        <span class="step-label" :class="{ active: index <= currentSlideIndex }">{{ slide.name }}</span>
      </div>
    </div>

    <!-- השקף הפעיל -->
    <div class="slide-container">
      <transition name="slide" mode="out-in">
        <component :is="currentSlide.component" :key="currentSlideIndex" />
      </transition>
    </div>

    <!-- ניווט -->
    <div class="nav-buttons">
      <button @click="prevSlide" :disabled="currentSlideIndex === 0">← קודם</button>
      <button @click="nextSlide" :disabled="currentSlideIndex === slides.length - 1">הבא →</button>
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

export default {
  components: {
    MenuBar,
    SlideIntro,
    SlideProblem,
    SlideSolution,
    SlideInterface,
    SlideTeam,
    SlideLinks,
  },
  data() {
    return {
      currentSlideIndex: 0,
      slides: [
        { name: "סקירה", component: "SlideIntro" },
        { name: "הבעיה", component: "SlideProblem" },
        { name: "הפתרון", component: "SlideSolution" },
        { name: "הממשק", component: "SlideInterface" },
        { name: "הצוות", component: "SlideTeam" },
        { name: "קישורים", component: "SlideLinks" },
      ],
    };
  },
  computed: {
    currentSlide() {
      return this.slides[this.currentSlideIndex];
    },
    progressWidth() {
      const totalSteps = this.slides.length - 1; // מספר המרווחים בין השלבים
      const stepPercentage = 94 / totalSteps; // אחוז לכל מרווח
      // מגביל את הרוחב כך שלא יחרוג מעבר למרכז העיגול האחרון
      return Math.min(stepPercentage * this.currentSlideIndex, 101 - (stepPercentage / 2));
    },
  },
  methods: {
    nextSlide() {
      if (this.currentSlideIndex < this.slides.length - 1) {
        this.currentSlideIndex++;
      }
    },
    prevSlide() {
      if (this.currentSlideIndex > 0) {
        this.currentSlideIndex--;
      }
    },
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

/* ציר זמן בחלק העליון */
.timeline {
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
  padding: 30px 60px;
  background: #f8fafc;
  border-bottom: 1px solid #e2e8f0;
  z-index: 10;
}

.timeline-path-background {
  position: absolute;
  top: calc(30px + 15px); /* מיקום במרכז ה-step-marker */
  left: 60px;
  right: 60px;
  height: 6px;
  background: repeating-linear-gradient(
    90deg,
    #d1d5db 0,
    #d1d5db 10px,
    transparent 10px,
    transparent 20px
  );
  z-index: 0;
}

.timeline-path-progress {
  position: absolute;
  top: calc(30px + 15px); /* מיקום במרכז ה-step-marker */
  left: 60px;
  height: 6px;
  background: linear-gradient(90deg, #1e3a8a, #3b82f6);
  transition: width 0.6s ease-in-out;
  box-shadow: 0 0 12px rgba(59, 130, 246, 0.5);
  z-index: 1;
}

.timeline-step {
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  z-index: 2;
  cursor: pointer;
  transition: transform 0.3s ease, opacity 0.3s ease;
}

.timeline-step:hover {
  transform: scale(1.1);
  opacity: 0.9;
}

.step-marker {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background-color: #ffffff;
  border: 3px solid #d1d5db;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: all 0.4s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.step-marker.active {
  border-color: #3b82f6;
  background-color: #dbeafe;
  transform: scale(1.15);
}

.step-icon {
  font-size: 14px;
  font-weight: bold;
  color: #6b7280;
  transition: color 0.4s ease;
}

.step-marker.active .step-icon {
  color: #1e3a8a;
}

.step-label {
  margin-top: 10px;
  font-size: 14px;
  font-weight: 600;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  transition: color 0.4s ease;
}

.step-label.active {
  color: #1e3a8a;
}

/* תוכן השקופית */
.slide-container {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 60px;
}

/* ניווט */
.nav-buttons {
  display: flex;
  justify-content: space-between;
  padding: 20px 60px;
  background: #f8fafc;
  border-top: 1px solid #e2e8f0;
}

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

/* מעבר חלק בין שקפים */
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