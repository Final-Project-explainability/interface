<template>
  <div class="info-panel">
    <!-- Title with typing effect -->
    <h2 :class="['typewriter', { done: isTitleTypingDone }]">{{ typedTitle }}</h2>

    <!-- Paragraph with typing effect -->
    <p :class="['typewriter', { done: isParagraphTypingDone }]">{{ typedParagraph }}</p>

    <!-- Card buttons for navigation -->
    <div class="card-container">
      <Card
        title="Global Data"
        buttonText="GO Global"
        @click="navigate('/global')"
        imageClass="global-image"
        :disabled="false"
      />
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
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import Card from "../components/Card.vue";
import DatasetSelector from "../components/DatasetSelector.vue";


export default {
  name: "InfoPanel",
  props: {
    isLoggedIn: {
      type: Boolean, // Determines if the user is logged in (controls access to personal data)
      required: true,
    },
  },
  components: {
    Card,
    DatasetSelector,
  },
  setup() {
    const router = useRouter();

    const fullTitle = "Medical AI Mortality Prediction Model";
    const fullParagraph =
      "ICU MediClear specializes in mortality prediction for ICU patients, combining artificial intelligence models with explainability to help clinicians and enhance decision-making in critical care.";

    const typedTitle = ref(""); // Title text that is revealed progressively
    const typedParagraph = ref(""); // Paragraph text revealed progressively
    const isTitleTypingDone = ref(false); // Flag when title typing is finished
    const isParagraphTypingDone = ref(false); // Flag when paragraph typing is finished

    // Simulates typing effect by incrementally adding characters
    const typeText = (fullText, refVar, speed = 50, onComplete = null) => {
      let i = 0;
      const interval = setInterval(() => {
        if (i < fullText.length) {
          refVar.value += fullText[i];
          i++;
        } else {
          clearInterval(interval);
          if (onComplete) onComplete();
        }
      }, speed);
    };

    // Navigation method for card buttons
    const navigate = (path) => {
      router.push(path);
    };

    // When component is mounted, start typing effect
    onMounted(() => {
      typeText(fullTitle, typedTitle, 50, () => {
        isTitleTypingDone.value = true;

        // Small delay before paragraph starts typing
        setTimeout(() => {
          typeText(fullParagraph, typedParagraph, 20, () => {
            isParagraphTypingDone.value = true;
          });
        }, 300);
      });
    });

    return {
      navigate,
      typedTitle,
      typedParagraph,
      isTitleTypingDone,
      isParagraphTypingDone,
    };
  },
};
</script>

<style scoped>
/* Main container styling */
.info-panel {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: stretch;
  text-align: center;
  height: 100%;
  width: 100%;
  padding: 0px;
  box-sizing: border-box;
}

/* Typing effect base class */
.typewriter {
  white-space: nowrap;
  overflow: hidden;
}

/* Styling once typing is done (currently empty but extendable) */
.typewriter.done {

}

/* Title with typing effect */
h2.typewriter {
  font-size: 28px;
  margin-bottom: 20px;
  color: #004d4d;
  min-height: 36px; /* שמירה על גובה קבוע */
}

/* Paragraph with typing effect */
p.typewriter {
  font-size: 16px;
  color: #555555;
  line-height: 1.6;
  margin-bottom: 30px;
  white-space: normal;
  max-width: 700px;
  margin-left: auto;
  margin-right: auto;
  min-height: 64px; /* שמירה על גובה קבוע */
}

/* Container for the cards */
.card-container {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 40px;
  flex-grow: 1;
  width: 100%;
  box-sizing: border-box;
}
</style>