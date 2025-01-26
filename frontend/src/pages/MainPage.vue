<template>
  <div class="main-container">
    <!-- חלק שמאלי -->
    <div class="left-panel">
      <!-- אם המשתמש לא מחובר -->
      <Login v-if="!isLoggedIn" @login="handleLogin" />

      <!-- אם המשתמש מחובר -->
      <Dashboard
        class="dashboard-container"
        v-else
        :user="userDetails"
        @logout="handleLogout"
        @navigate="changePanel"
      />
    </div>

    <!-- חלק ימני -->
    <div class="right-panel">
      <!-- אם המשתמש לא מחובר -->
      <InfoPanel v-if="!isLoggedIn" />

      <!-- אם המשתמש מחובר, תוכן דינמי -->
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
// import PersonalArea from "../components/PersonalArea.vue";

export default {
  name: "MainPage",
  components: {
    AdminPanel,
    Login,
    Dashboard,
    InfoPanel,
    PatientList,
    // PersonalArea,
  },
  data() {
    return {
      isLoggedIn: false, // מעקב אחרי התחברות
      userDetails: null, // פרטי המשתמש
      selectedPanel: "Home", // ברירת מחדל: InfoPanel לאחר התחברות
    };
  },
  created() {
    // טעינת פרטי המשתמש מה-localStorage
    const storedUser = localStorage.getItem("userDetails");
    if (storedUser) {
      this.userDetails = JSON.parse(storedUser);
      this.isLoggedIn = true;
    }
  },
  methods: {
    handleLogin(user) {
      console.log("User details received:", user);
      localStorage.setItem("userDetails", JSON.stringify(user)); // שמירת פרטי המשתמש
      this.userDetails = user; // שמירת פרטי המשתמש ב-state
      this.isLoggedIn = true; // עדכון מצב התחברות
      this.selectedPanel = "Home"; // ברירת מחדל לאחר התחברות
    },
    handleLogout() {
      localStorage.removeItem("userDetails"); // מחיקת פרטי המשתמש מה-localStorage
      this.userDetails = null; // איפוס פרטי המשתמש ב-state
      this.isLoggedIn = false; // עדכון מצב התחברות
      this.selectedPanel = "Home"; // חזרה לברירת מחדל
    },
    changePanel(panel) {
      this.selectedPanel = panel; // שינוי התוכן הדינמי
    },
  },
};
</script>

<style>
@import "../styles.css";
</style>
