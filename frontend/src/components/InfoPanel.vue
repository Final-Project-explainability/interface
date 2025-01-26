<template>
  <div class="info-panel">
    <h2>Medical AI Mortality Prediction Model</h2>
    <p>
      ICU MediClear specializes in mortality prediction for ICU patients,
      combining artificial intelligence models with explainability to help
      clinicians and enhance decision-making in critical care.
    </p>
    <div class="card-container">
      <!-- Global Data Card -->
      <Card
        title="Global Data"
        buttonText="GO Global"
        @click="navigate('/global')"
        imageClass="global-image"
        :disabled="false"
      />

      <!-- Personal Patient Data Card -->
      <Card
        title="Personal Patient Data"
        buttonText="GO Personal"
        @click="navigate('/local')"
        imageClass="local-image"
        :disabled="!isLoggedIn"
        overlayText="You need to login to get access"
      />
    </div>
  </div>
</template>

<script>
import { useRouter } from "vue-router";
import Card from "../components/Card.vue";

export default {
  name: "InfoPanel",
  props: {
    isLoggedIn: {
      type: Boolean,
      required: true,
    },
  },
  components: {
    Card,
  },
  setup() {
    const router = useRouter();

    // Navigation function
    const navigate = (path) => {
      router.push(path);
    };

    return {
      navigate,
    };
  },
};
</script>

<style scoped>
.info-panel {
  display: flex; /* שימוש ב-Flexbox */
  flex-direction: column; /* סידור אנכי של התוכן */
  justify-content: center; /* מרכז תוכן אנכית */
  align-items: stretch; /* מתיחת התוכן לרוחב */
  text-align: center; /* ממרכז טקסט */
  height: 100%; /* כיסוי מלא של הגובה */
  width: 100%; /* כיסוי מלא של הרוחב */
  padding: 0px; /* מרווח פנימי */
  box-sizing: border-box; /* כלול Padding בתוך המידות */
}

.info-panel h2 {
  font-size: 28px;
  margin-bottom: 20px;
  color: #004d4d;
}

.info-panel p {
  font-size: 16px;
  color: #555555;
  line-height: 1.6;
  margin-bottom: 30px;
}

.card-container {
  display: flex; /* שימוש ב-Flexbox */
  justify-content: center; /* מרכז כרטיסים אופקית */
  align-items: center; /* מרכז כרטיסים אנכית */
  gap: 40px; /* רווחים בין כרטיסים */
  flex-grow: 1; /* מאפשר לכרטיסים לגדול ולמלא את המרחב */
  width: 100%; /* כיסוי מלא לרוחב */
  box-sizing: border-box;
}

</style>


