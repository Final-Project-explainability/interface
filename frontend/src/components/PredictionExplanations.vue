<template>
  <div class="prediction-explanations-container">
    <!-- Horizontal Slider Wrapper -->
    <div class="horizontal-slider-wrapper">
      <!-- Scroll Left Button -->
<!--      <button class="slider-button left" @click="scrollLeft">←</button>-->

      <!-- Scrollable Vertical Container -->
      <div class="vertical-scroll-container">
        <!-- Scrollable Horizontal Container -->
        <div class="scrollable-container">
          <div class="models-wrapper">
            <ModelExplainableSection
              v-for="(modelData, modelName) in predictionData"
              :key="modelName"
              :model-name="modelName"
              :model-data="modelData"
            />
          </div>
        </div>
      </div>

      <!-- Scroll Right Button -->
<!--      <button class="slider-button right" @click="scrollRight">→</button>-->
    </div>
  </div>
</template>

<script>
import { MockGetPatientExplanaition } from "../local_functions_mock";
import ModelExplainableSection from "./ModelExplainableSection.vue";

export default {
  name: "PredictionExplanations",
  components: {
    ModelExplainableSection,
  },
  data() {
    return {
      predictionData: {}, // נתוני התחזיות מה-JSON
    };
  },
  methods: {
    loadPredictionData() {
      // טעינת נתונים מהפונקציה המוק
      this.predictionData = MockGetPatientExplanaition();
    },
    scrollLeft() {
      const container = this.$el.querySelector(".scrollable-container");
      container.scrollBy({
        left: -300,
        behavior: "smooth",
      });
    },
    scrollRight() {
      const container = this.$el.querySelector(".scrollable-container");
      container.scrollBy({
        left: 300,
        behavior: "smooth",
      });
    },
  },
  mounted() {
    this.loadPredictionData(); // טעינת נתונים ברגע טעינת הקומפוננטה
  },
};
</script>

<style scoped>
/* Reset CSS */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html, body {
  height: 100%; /* הגדרה של גובה מלא למסמך */
  font-family: Arial, sans-serif;
  overflow: hidden; /* מניעת גלילה בלתי רצויה */
}

#app {
  height: 100%; /* גובה מלא עבור אפליקציית Vue */
  display: flex;
  flex-direction: column;
}

/* Main Container */
.prediction-explanations-container {
  border-radius: 10px;
  padding: 10px;
  height: 100%; /* הקומפוננטה תמלא את כל גובה ההורה */
  display: flex;
  flex-direction: column;
  overflow: hidden; /* מניעת גלישה */
}

/* Wrapper with Buttons */
.horizontal-slider-wrapper {
  display: flex;
  align-items: center;
  position: relative;
  overflow: hidden; /* מניעת גלישה חיצונית */
  height: calc(100% - 50px); /* גובה דינמי עבור האלמנטים הפנימיים */
  flex: 1;
}

/* Scrollable Vertical Container */
.vertical-scroll-container {
  overflow-y: auto; /* גלילה אנכית פנימית */
  height: 100%; /* גובה מלא */
  width: 100%; /* רוחב מלא */
  display: flex;
  flex-direction: column;
}

/* Scrollable Horizontal Container */
.scrollable-container {
  display: flex;
  flex-direction: row;
  overflow-x: auto; /* גלילה אופקית */
  height: 100%; /* גובה מלא */
  scroll-behavior: smooth; /* גלילה חלקה */
  white-space: nowrap; /* מניעת שבירת שורות */
}

/* Main Wrapper for the Models */
.models-wrapper {
  display: flex;
  flex-direction: row; /* מבנה אופקי */
  flex-wrap: wrap; /* תומך במעבר לשורות חדשות */
  gap: 20px; /* מרווחים בין האלמנטים */
  justify-content: center; /* יישור למרכז */
  height: 100%; /* גובה מלא */
}

/* Buttons for Scrolling */
.slider-button {
  background-color: rgba(0, 0, 0, 0.5); /* צבע עם שקיפות */
  color: white;
  border: none;
  border-radius: 10px; /* פינות מעוגלות */
  width: 40px; /* כפתור קטן */
  height: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
  position: absolute;
  z-index: 10;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.2);
  top: 55%; /* ממקם את הכפתור בגובה 79% מההורה */
  transform: translateY(-50%); /* מרכז אנכית את הכפתור */
}

/* Left Button */
.slider-button.left {
  left: 10px;
}

/* Right Button */
.slider-button.right {
  right: 10px;
}

/* Hover Effect */
.slider-button:hover {
  background-color: rgba(0, 121, 107, 0.9);
  transform: scale(1.1); /* הגדלה קלה */
}

/* Media Queries */

/* מסכים קטנים (טלפונים - עד 768px רוחב) */
@media (max-width: 768px) {
  .models-wrapper {
    flex-direction: column; /* מעבר למבנה אנכי */
    gap: 15px; /* מרווחים קטנים יותר */
  }

  .slider-button {
    width: 35px;
    height: 35px;
    font-size: 14px;
  }
}

/* מסכים בינוניים (טאבלטים - 768px עד 1024px) */
@media (min-width: 768px) and (max-width: 1024px) {
  .models-wrapper {
    flex-direction: row; /* מבנה אופקי */
    flex-wrap: wrap; /* מאפשר גלישה לשורות */
    gap: 20px;
    justify-content: center; /* מרכז תוכן */
  }
}

/* מסכים גדולים (מחשבים ומעלה - מעל 1024px) */
@media (min-width: 1024px) {
  .models-wrapper {
    flex-direction: row;
    justify-content: space-evenly; /* פיזור שווה */
    gap: 25px; /* מרווחים רחבים יותר */
  }
}

</style>
