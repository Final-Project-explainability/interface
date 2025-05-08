<template>
  <div class="intro-wrapper">
    <div class="text-container">
      <!-- כותרת ראשית -->
      <h1 class="headline">🩺 MediClear: Explainability in Critical Care</h1>

      <!-- פתיח על הפרויקט -->
      <p class="intro-paragraph">
        In critical care, decisions must be fast, accurate, and life-saving.
        Our project explores explainability in AI-based predictive models for ICU settings, ensuring that clinicians not only receive predictions — but understand them.
      </p>

      <p class="intro-paragraph">
        MediClear is a collaborative effort to bridge the gap between machine learning and medical practice,
        helping clinicians trust AI with transparency and confidence.
      </p>

      <!-- 👇 תוספת: About Us -->
      <h2 class="sub-title">🎓 About Us</h2>

      <p class="intro-paragraph">
        We are three undergraduate students in our final year of a dual degree in Software Systems Engineering and Data Science
        at Ben-Gurion University of the Negev.
      </p>
      <p class="intro-paragraph">
        MediClear is our capstone project, developed as part of the academic collaboration with Clalit Research Institute and the Department of Software and Information Systems Engineering.
      </p>
    </div>
  </div>
</template>

<script>
export default {
  name: "SlideIntro",
};
</script>

<style scoped>
.intro-wrapper {
  height: 100%;
  width: 100%;
  background: linear-gradient(to bottom right, #e0f2ff, #f9fbff);
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 60px 20px;
  box-sizing: border-box;
  text-align: center;
}

.text-container {
  max-width: 900px;
}

.headline {
  font-size: 2.2rem;
  font-weight: 800;
  color: #1e3a8a;
  margin-bottom: 24px;
}

.sub-title {
  font-size: 1.6rem;
  font-weight: 700;
  color: #2563eb;
  margin: 40px 0 16px;
}

.intro-paragraph {
  font-size: 1.15rem;
  line-height: 1.8;
  color: #374151;
  margin-bottom: 16px;
}
</style>
