<!-- components/TeamCard.vue -->
<template>
  <div class="card">
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
    img: String,
  },
};
</script>

<style scoped>
.card {
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 16px;
  width: 180px;
  text-align: center;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.05);
  transition: transform 0.2s ease;
}

.card:hover {
  transform: scale(1.04);
}

.card img {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  object-fit: cover;
  margin-bottom: 12px;
}

.card h3 {
  font-size: 16px;
  margin: 4px 0;
  color: #0f172a;
}

.card p {
  font-size: 14px;
  color: #475569;
}
</style>
