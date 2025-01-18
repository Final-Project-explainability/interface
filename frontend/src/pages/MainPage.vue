<template>
  <div class="main-container">
    <div class="left-panel">
      <Dashboard
        v-if="isLoggedIn"
        :user="userDetails"
        @logout="handleLogout"
      />
      <Login
        v-else
        @login="handleLogin"
      />
    </div>
    <div class="right-panel">
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
      isLoggedIn: false, // מעקב אחרי מצב התחברות
      userDetails: null, // שמירת פרטי המשתמש המחובר
    };
  },
  methods: {
    handleLogin(user) {
      this.userDetails = user; // שמירת פרטי המשתמש שהתקבלו מ-Login
      this.isLoggedIn = true;
    },
    handleLogout() {
      this.userDetails = null;
      this.isLoggedIn = false;
    },
  },
};
</script>

<style>
@import "../styles.css";
</style>
