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

<!--<style scoped>-->
<!--.info-panel {-->
<!--  text-align: center;-->
<!--  max-width: 700px;-->
<!--  margin: 0 auto;-->
<!--}-->

<!--.info-panel h2 {-->
<!--  font-size: 28px;-->
<!--  margin-bottom: 20px;-->
<!--  color: #004d4d;-->
<!--}-->

<!--.info-panel p {-->
<!--  font-size: 16px;-->
<!--  color: #555555;-->
<!--  line-height: 1.6;-->
<!--  margin-bottom: 30px;-->
<!--}-->

<!--.card-container {-->
<!--  display: flex;-->
<!--  justify-content: center;-->
<!--  gap: 40px;-->
<!--  margin-top: 20px;-->
<!--}-->
<!--</style>-->


