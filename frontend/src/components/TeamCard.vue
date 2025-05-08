<template>
  <div class="card">
    <img v-if="img" :src="img" alt="team member" class="avatar" />
    <h3 class="name">{{ name }}</h3>
    <div class="links">
      <a
        v-if="github"
        :href="github"
        target="_blank"
        class="outlined-button"
      >
        <svg class="icon" viewBox="0 0 24 24" fill="currentColor">
          <!-- GitHub icon -->
          <path
            d="M12 0.5C5.37 0.5 0 5.87 0 12.5C0 17.8 3.438 22.23 8.205 23.73C8.805 23.84 9.025 23.48 9.025 23.17C9.025 22.89 9.015 22.19 9.01 21.25C5.672 21.91 4.968 19.63 4.968 19.63C4.422 18.21 3.633 17.82 3.633 17.82C2.545 17.07 3.717 17.09 3.717 17.09C4.922 17.17 5.555 18.33 5.555 18.33C6.635 20.16 8.388 19.63 9.048 19.32C9.155 18.54 9.465 17.99 9.81 17.67C7.145 17.35 4.343 16.3 4.343 11.63C4.343 10.29 4.805 9.21 5.573 8.37C5.445 8.05 5.04 6.8 5.685 5.1C5.685 5.1 6.703 4.75 9.01 6.34C9.975 6.07 11.025 5.93 12.075 5.93C13.125 5.93 14.175 6.07 15.14 6.34C17.447 4.75 18.465 5.1 18.465 5.1C19.11 6.8 18.705 8.05 18.577 8.37C19.345 9.21 19.807 10.29 19.807 11.63C19.807 16.31 17.005 17.34 14.335 17.66C14.76 18.04 15.145 18.81 15.145 20.02C15.145 21.74 15.13 22.89 15.13 23.17C15.13 23.48 15.35 23.85 15.955 23.73C20.725 22.23 24.16 17.8 24.16 12.5C24.16 5.87 18.79 0.5 12.16 0.5H12z"
          />
        </svg>
        GitHub
      </a>

<a
  v-if="linkedin"
  :href="linkedin"
  target="_blank"
  class="outlined-button"
>
  <svg class="icon linkedin-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" fill="currentColor">
    <path
      d="M100.28 448H7.4V148.9h92.88zM53.79 108.1C24.09 108.1 0 83.52 0 53.79
      0 24.07 24.09 0 53.79 0s53.79 24.07 53.79 53.79c0
      29.73-24.08 54.31-53.79 54.31zM447.9 448h-92.68V302.4c0-34.7-12.47-58.4-43.61-58.4-23.8
      0-38 16-44.3 31.4-2.3 5.6-2.8 13.4-2.8 21.2V448h-92.78s1.2-267.4
      0-295h92.68v41.8c12.3-19 34.3-46.1 83.4-46.1
      60.9 0 106.7 39.8 106.7 125.4V448z"
    />
  </svg>
  LinkedIn
</a>

    </div>
  </div>
</template>






<script>
export default {
  name: "TeamCard",
  props: {
    name: String,
    img: String,
    github: String,
    linkedin: String,
  },
};
</script>

<style scoped>
.card {
  background: white;
  border-radius: 20px;
  padding: 24px;
  box-shadow: 0 12px 28px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
  text-align: center;
  width: 100%;
  max-width: 280px;
  flex: 1 1 240px;
}

.card:hover {
  transform: translateY(-4px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.12);
}

.avatar {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  object-fit: cover;
  margin-bottom: 16px;
  border: 4px solid #bfdbfe;
}

.name {
  font-size: 1.15rem;
  font-weight: 700;
  color: #1e3a8a;
  margin-bottom: 16px;
}

.links {
  display: flex;
  justify-content: center;
  gap: 12px;
  margin-top: 12px;
  flex-wrap: wrap;
}

.outlined-button {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  font-size: 0.9rem;
  font-weight: 600;
  color: #1e3a8a;
  background-color: #f1f5f9;
  border: 1.5px solid #cbd5e1;
  border-radius: 8px;
  text-decoration: none;
  transition: all 0.2s ease-in-out;
  box-shadow: 0 2px 4px rgba(30, 58, 138, 0.04);
}

.outlined-button:hover {
  background-color: #e0e7ff;
  border-color: #3b82f6;
  color: #1e3a8a;
  transform: translateY(-1px);
}



.icon {
  width: 18px;
  height: 18px;
  fill: currentColor;
  vertical-align: middle;
}

.linkedin-icon {
  width: 18px;
  height: 18px;
  margin-bottom: 3px;
}


</style>

