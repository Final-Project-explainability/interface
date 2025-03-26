<template>
  <div class="main-container">
    <!-- חלק שמאלי -->
    <div class="left-panel">
      <Login v-if="!isLoggedIn" @login="handleLogin" />
      <Dashboard
        v-else
        class="dashboard-container"
        :user="userDetails"
        @logout="handleLogout"
        @navigate="changePanel"
      />
    </div>

    <!-- חלק ימני -->
    <div class="right-panel">
      <InfoPanel v-if="!isLoggedIn" />
      <div v-else>
        <InfoPanel :isLoggedIn="isLoggedIn" v-if="selectedPanel === 'Home'" />
        <PatientList v-else-if="selectedPanel === 'PatientList'" />
        <PersonalArea v-else-if="selectedPanel === 'PersonalArea'" />
        <AdminPanel v-else-if="selectedPanel === 'AdminPanel'" />
      </div>
    </div>
  </div>
</template>

<script>
import Login from "../components/Login.vue";
import Dashboard from "../components/Dashboard.vue";
import InfoPanel from "../components/InfoPanel.vue";
import PatientList from "../components/PatientList.vue";
import AdminPanel from "@/components/AdminPanel.vue";
import PersonalArea from "../components/PersonalArea.vue";
import { eventBus } from "@/utils/eventBus"; // ✅ ייבוא של האירועים

export default {
  name: "MainPage",
  components: {
    AdminPanel,
    Login,
    Dashboard,
    InfoPanel,
    PatientList,
    PersonalArea,
  },
  data() {
    return {
      isLoggedIn: false,
      userDetails: null,
      selectedPanel: "Home",
    };
  },
  created() {
    const storedUser = localStorage.getItem("userDetails");
    if (storedUser) {
      this.userDetails = JSON.parse(storedUser);
      this.isLoggedIn = true;
    }

    // ✅ האזנה לאירוע פקיעת טוקן
    eventBus.on("token-expired", this.handleLogout);
  },
  beforeUnmount() {
    eventBus.off("token-expired", this.handleLogout);
  },
  methods: {
    handleLogin(user) {
      localStorage.setItem("userDetails", JSON.stringify(user));
      this.userDetails = user;
      this.isLoggedIn = true;
      this.selectedPanel = "Home";
    },
    handleLogout() {
      localStorage.removeItem("token");
      localStorage.removeItem("userId");
      localStorage.removeItem("userDetails");

      this.userDetails = null;
      this.isLoggedIn = false;
      this.selectedPanel = "Home";

      this.$router.push("/");
    },
    changePanel(panel) {
      this.selectedPanel = panel;
    },
  },
};
</script>

<style>
@import "../styles.css";
</style>
