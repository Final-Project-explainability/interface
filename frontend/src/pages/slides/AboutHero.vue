<template>
  <div class="hero-wrapper">
    <!-- Mentors Section -->
    <div class="mentors-section">
      <h2 class="mentors-title">🧑‍🏫 Project Mentors</h2>
      <div class="mentors-grid">
        <div
          v-for="mentor in mentors"
          :key="mentor.name"
          class="mentor-card"
        >
          <h3 class="mentor-name">{{ mentor.name }}</h3>
          <p class="mentor-role">{{ mentor.role }}</p>
        </div>
      </div>
    </div>

    <!-- Team Section -->
    <div class="team-section">
      <h2 class="section-title">👨‍💻 Meet the Team</h2>
      <div class="team-grid">
        <TeamCard
          name="Alon Azran"
          img="https://media.licdn.com/dms/image/v2/D4E35AQHJak4ufQx34Q/profile-framedphoto-shrink_400_400/B4EZX9ShCgHMAg-/0/1743711244763?e=1745496000&v=beta&t=22G60lKQvaN0N_jryM9ScNQckSzcV6kl0kmwft8f-Io"
          github="https://github.com/alonazran"
          linkedin="https://www.linkedin.com/in/alonazran/"
        />
        <TeamCard
          name="Ofir Tamir"
          img="https://media.licdn.com/dms/image/v2/D4D03AQF45e-DqyAK7Q/profile-displayphoto-shrink_400_400/profile-displayphoto-shrink_400_400/0/1721248465048?e=1750291200&v=beta&t=0llIcIza1nekMMcQAIW1p7V_9J_AoE1E8eQoekZTqR8"
          github="https://github.com/alonazran"
          linkedin="https://www.linkedin.com/in/ofir-tamir/"
        />
        <TeamCard
          name="Oded Atias"
          img="https://media.licdn.com/dms/image/v2/C4D03AQFYmgayN6_G9w/profile-displayphoto-shrink_400_400/profile-displayphoto-shrink_400_400/0/1664228380340?e=1750291200&v=beta&t=BksYcAfEhcpnTdTa-w4sJobrFyNTezxIuPfTvrNBcKE"
          github="https://github.com/alonazran"
          linkedin="https://www.linkedin.com/in/oded-atias-836b77251/"
        />
      </div>
    </div>
  </div>
</template>


<script>
import TeamCard from "@/components/TeamCard.vue";

export default {
  name: "AboutHero",
  components: {
    TeamCard,
  },
  data() {
    return {
      mentors: [
        { name: "Professor Noa Dagan", role: "Academic Supervisor" },
        { name: "Professor Noam Barda", role: "Academic Supervisor" },
        { name: "Mrs. Noga Stern", role: "Academic Supervisor" }
      ],
    };
  },
};
</script>



<style scoped>
.hero-wrapper {
  height: 100%;
  width: 100%;
  background: linear-gradient(to bottom right, #e0f2ff, #f9fbff);
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  box-sizing: border-box;
  padding: 40px 20px;
}

/* Mentors Section */
.mentors-section {
  text-align: center;
  margin-bottom: 0px;
  width: 100%;
}

.mentors-title {
  font-size: 2rem;
  font-weight: 700;
  color: #1e3a8a;
  margin-bottom: 24px;
  margin-top: 0px;
}

.mentors-grid {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 24px;
  padding: 0 20px;
}

.mentor-card {
  background: #ffffff;
  border: 2px solid #bfdbfe;
  border-radius: 12px;
  padding: 16px 20px;
  min-width: 220px;
  max-width: 280px;
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.05);
  transition: transform 0.3s ease;
}

.mentor-card:hover {
  transform: translateY(-4px);
}

.mentor-name {
  font-size: 1.1rem;
  font-weight: 700;
  color: #1e3a8a;
  margin-bottom: 4px;
}

.mentor-role {
  font-size: 0.95rem;
  color: #374151;
  font-style: italic;
}

/* Team Section */
.team-section {
  text-align: center;
  padding-bottom: 60px;
  width: 100%;
  box-sizing: border-box;
}

.section-title {
  font-size: 1.6rem;
  font-weight: 700;
  color: #2563eb;
  margin-bottom: 24px;
}

.team-grid {
  display: flex;
  justify-content: center;
  align-items: flex-start;
  gap: 32px;
  flex-wrap: wrap;
}
</style>

