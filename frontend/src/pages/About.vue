<template>
  <div class="about-page">
    <MenuBar />

    <div class="hero-section">
      <div class="info-grid">
        <!-- צד שמאל: מידע תמציתי -->
        <div class="info-section">
          <h1 class="title">🧠 Explainability ICU</h1>
          <p class="subtitle">
            A smart ICU system for AI prediction explainability. Built to support
            clinical decision-making through local and global insights.
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
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import MenuBar from "@/components/MenuBar.vue";
import TeamCard from "@/components/TeamCard.vue";

export default {
  name: "About",
  components: {
    MenuBar,
    TeamCard,
  },
};
</script>

<style scoped>
@import url("https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css");

html,
body {
  overflow: hidden;
  height: 100%;
  margin: 0;
  padding: 0;
}

.about-page {
  font-family: "Segoe UI", sans-serif;
  background: linear-gradient(to bottom right, #0f172a, #1e293b);
  color: #fff;
  height: 100vh;
  width: 100vw;
  overflow: hidden;
}

.hero-section {
  display: flex;
  align-items: center;
  justify-content: center;
  height: calc(100vh - 60px);
  padding: 0 40px;
}

.info-grid {
  display: flex;
  flex-direction: row;
  gap: 60px;
  justify-content: space-between;
  align-items: center;
  max-width: 1400px;
  width: 100%;
}

.info-section {
  flex: 1;
  max-width: 700px;
}

.title {
  font-size: 32px;
  color: #38bdf8;
  margin-bottom: 12px;
}

.subtitle {
  font-size: 18px;
  color: #cbd5e1;
  margin-bottom: 24px;
  line-height: 1.5;
}

.quick-facts h2,
.quick-links h2 {
  font-size: 20px;
  color: #facc15;
  margin-bottom: 8px;
}

.quick-facts ul {
  list-style: none;
  padding: 0;
  color: #e2e8f0;
}

.quick-facts li {
  margin-bottom: 6px;
}

.quick-links .links {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.quick-links a {
  color: #60a5fa;
  text-decoration: none;
  transition: 0.2s;
}

.quick-links a:hover {
  text-decoration: underline;
}

.team-section {
  flex: 1;
  max-width: 500px;
  text-align: center;
}

.team-title {
  color: #f87171;
  font-size: 22px;
  margin-bottom: 16px;
}

.team-grid {
  display: flex;
  justify-content: center;
  gap: 20px;
  flex-wrap: wrap;
}
</style>
