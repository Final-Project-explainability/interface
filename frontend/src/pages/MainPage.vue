<template>
  <div class="main-container">
    <div class="left-panel">
      <!-- Show Dashboard if logged in, otherwise show Login -->
      <Dashboard
        v-if="isLoggedIn"
        :user="userDetails"
        @logout="handleLogout" />
      <Login v-else @login="handleLogin" />
    </div>
    <div class="right-panel">
      <!-- InfoPanel for global and local navigation -->
      <InfoPanel :isLoggedIn="isLoggedIn" />
    </div>
  </div>
</template>

<script>
import Dashboard from "../components/Dashboard.vue";
import Login from "../components/Login.vue";
import InfoPanel from "../components/InfoPanel.vue";

export default {
  name: "MainPage",
  components: {
    Dashboard,
    Login,
    InfoPanel,
  },
  data() {
    return {
      isLoggedIn: false, // Track login status
      userDetails: null, // Store user details
    };
  },
  methods: {
    handleLogin(username) {
      this.userDetails = {
        name: username,
        licenseId: "123465",
        specialty: "ER Physician",
      };
      this.isLoggedIn = true;
    },
    handleLogout() {
      this.userDetails = null;
      this.isLoggedIn = false;
    },
  },
};
</script>

<!--<style scoped>-->
<!--.main-container {-->
<!--  display: flex;-->
<!--  width: 100%;-->
<!--  height: 100vh;-->
<!--}-->

<!--.left-panel {-->
<!--  flex: 6;-->
<!--  background-color: #004d4d;-->
<!--  color: #ffffff;-->
<!--  padding: 60px;-->
<!--  display: flex;-->
<!--  flex-direction: column;-->
<!--  justify-content: center;-->
<!--  align-items: center;-->
<!--}-->

<!--.right-panel {-->
<!--  flex: 3;-->
<!--  background-color: #ffffff;-->
<!--  padding: 40px;-->
<!--  display: flex;-->
<!--  flex-direction: column;-->
<!--  justify-content: center;-->
<!--  align-items: center;-->
<!--}-->
<!--</style>-->

<style>
@import "../styles.css";
</style>
