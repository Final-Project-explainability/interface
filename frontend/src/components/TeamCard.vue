<template>
  <div class="team-card">
    <img :src="img" :alt="name" />
    <h3>{{ name }}</h3>
    <p>{{ role }}</p>
  </div>
</template>

<script>
export default {
  name: "TeamCard",
  props: {
    name: String,
    role: String,
    img: {
      type: String,
      default: "https://i.pravatar.cc/100?u=team",
    },
  },
};
</script>

<style scoped>
.team-card {
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 16px;
  padding: 20px 24px;
  width: 160px;
  text-align: center;
  transition: all 0.25s ease;
  backdrop-filter: blur(4px);
  position: relative;
}

.team-card:hover {
  transform: translateY(-6px);
  border-color: #38bdf8;
  box-shadow: 0 6px 20px rgba(56, 189, 248, 0.2);
}

.team-card img {
  width: 72px;
  height: 72px;
  border-radius: 50%;
  margin-bottom: 10px;
  object-fit: cover;
  border: 2px solid #22d3ee;
  box-shadow: 0 0 8px rgba(34, 211, 238, 0.4);
}

.team-card h3 {
  font-size: 15px;
  color: #f1f5f9;
  margin: 8px 0 4px;
  font-weight: 600;
  letter-spacing: 0.3px;
}

.team-card p {
  font-size: 13px;
  color: #94a3b8;
  margin: 0;
  font-weight: 400;
}
</style>
