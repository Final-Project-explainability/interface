<template>
  <div class="user-profile">
    <div class="user-avatar"></div>
    <div class="separator"></div>
    <div class="user-details">
      <h2>Hello, Dr. {{ user.name }}!</h2>
      <p>
        <strong>Medical License ID:</strong> {{ user.licenseId }}
      </p>
      <p>
        <strong>Medical Specialties:</strong> {{ user.specialty }}
      </p>
    </div>
    <div class="separator"></div>
    <div class="action-buttons">
      <button class="action-button" @click="navigateTo('patientList')">Patient List</button>
      <button class="action-button" @click="navigateTo('personalArea')">Personal Area</button>
      <button class="logout-button" @click="onLogout">Logout</button>
    </div>
  </div>
</template>

<script>
export default {
  name: "Dashboard",
  props: {
    user: {
      type: Object,
      required: true,
    },
    onLogout: {
      type: Function,
      required: true,
    },
  },
  methods: {
    navigateTo(section) {
      this.$emit("navigate", section);
    },
  },
};
</script>

<!--<style scoped>-->
<!--.user-profile {-->
<!--  background: linear-gradient(135deg, #f0f8ff, #e6f7f7); /* Soft gradient */-->
<!--  color: #004d66; /* Dark teal text */-->
<!--  padding: 30px;-->
<!--  border-radius: 20px;-->
<!--  position: relative;-->
<!--  width: 100%;-->
<!--  max-width: 450px; /* Max width for responsiveness */-->
<!--  font-family: "Poppins", sans-serif; /* Modern font */-->
<!--  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1); /* Light shadow for depth */-->
<!--  text-align: center;-->
<!--}-->

<!--.user-avatar {-->
<!--  width: 250px;-->
<!--  height: 250px;-->
<!--  border-radius: 50%;-->
<!--  border: 4px solid #4db6ac;-->
<!--  background-image: url("https://t4.ftcdn.net/jpg/06/32/90/79/360_F_632907942_M6CVHD1ivhUrWK1X49PkBlSH3ooNPsog.jpg"); /* Replace with the desired image URL */-->
<!--  background-size: cover;-->
<!--  background-position: center;-->
<!--  margin: 0 auto 20px;-->
<!--  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);-->
<!--}-->

<!--.separator {-->
<!--  width: 80%;-->
<!--  height: 1px;-->
<!--  background: #cfd8dc; /* Light gray for separators */-->
<!--  margin: 20px auto;-->
<!--}-->

<!--.user-details h2 {-->
<!--  font-size: 22px;-->
<!--  color: #004d66;-->
<!--  margin-bottom: 10px;-->
<!--}-->

<!--.user-details p {-->
<!--  font-size: 14px;-->
<!--  color: #00695c;-->
<!--  margin: 5px 0;-->
<!--}-->

<!--.action-buttons {-->
<!--  display: flex;-->
<!--  flex-direction: column;-->
<!--  gap: 15px; /* Adds space between buttons */-->
<!--  margin-top: 25px;-->
<!--}-->

<!--.action-button {-->
<!--  background: linear-gradient(90deg, #ffffff, #f0f8ff);-->
<!--  color: #004d66;-->
<!--  border: 2px solid #4db6ac;-->
<!--  padding: 12px;-->
<!--  font-size: 15px;-->
<!--  font-weight: bold;-->
<!--  border-radius: 8px;-->
<!--  cursor: pointer;-->
<!--  transition: transform 0.3s ease, background-color 0.3s ease;-->
<!--}-->

<!--.action-button:hover {-->
<!--  background: #4db6ac;-->
<!--  color: white;-->
<!--  transform: translateY(-5px);-->
<!--}-->

<!--.logout-button {-->
<!--  background: linear-gradient(90deg, #ff6f61, #ff867c);-->
<!--  color: white;-->
<!--  padding: 12px;-->
<!--  border-radius: 10px;-->
<!--  cursor: pointer;-->
<!--  transition: transform 0.3s ease, background-color 0.3s ease;-->
<!--}-->

<!--.logout-button:hover {-->
<!--  background: #e53935;-->
<!--  transform: scale(1.05);-->
<!--}-->
<!--</style>-->
