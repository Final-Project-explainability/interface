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
<!--        <PersonalArea v-else-if="selectedPanel === 'PersonalArea'" />-->
        <PersonalArea
          v-else-if="selectedPanel === 'PersonalArea'"
          @profile-updated="handleProfileUpdate"
        />
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
    handleProfileUpdate(updatedUser) {
      this.userDetails = { ...updatedUser };
      localStorage.setItem("userDetails", JSON.stringify(updatedUser));
    },
  },
};
</script>

<style>
/* Main container */
.main-container {
    display: flex; /* Flexbox layout */
    width: 90%; /* Container width */
    max-width: 1800px; /* Maximum width */
    height: 90%; /* Container height */
    background-color: #ffffff; /* White background */
    border-radius: 20px; /* Rounded corners */
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15); /* Subtle shadow */
    overflow: hidden; /* Hides overflow content */
    position: absolute; /* Positioned relative to the viewport */
    top: 50%; /* Centers vertically */
    left: 50%; /* Centers horizontally */
    transform: translate(-50%, -50%); /* Adjusts to perfect center */
}


/* Left panel */
.left-panel {
    flex: 1; /* Takes 6 parts of the container */
    background-color: #004d4d; /* Teal background */
    color: #ffffff; /* White text */
    padding: 60px; /* Inner spacing */
    display: flex; /* Flexbox layout */
    flex-direction: column; /* Stacks children vertically */
    justify-content: flex-start; /* Aligns children to the top */
    align-items: center; /* Centers content horizontally */
    position: relative; /* Sets for child positioning */
}

.left-panel::before {
    content: ''; /* Empty content for background */
    position: absolute; /* Positioned relative to parent */
    top: 0; /* Aligns to the top */
    left: 0; /* Aligns to the left */
    width: 100%; /* Full width */
    height: 100%; /* Full height */
    /*background: url('https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSuzNz0Eig7IyLzsbdyVq4zdCscquiwh5tgLw&s') no-repeat center;*/
    /*background: url('https://media0.giphy.com/media/v1.Y2lkPTc5MGI3NjExc2s1cnZ0ajN0emgzZXg2eXp0MnMwYmFoc2YxbDJ5ZDM0MnVmdGhuZyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/TTWnfO964s245vzY4e/giphy.webp') no-repeat center;*/
    background: url('https://media2.giphy.com/media/v1.Y2lkPTc5MGI3NjExYzhzODh5bGZ2M2t1YnRpZnhyZ3JsbjByeWpsa20zMDRvNG8ydndwcSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/3bc8pP1rVdfgN1uoMV/giphy.webp') no-repeat center; /* Background image */
    background-size: cover; /* Image covers entire area */
    opacity: 0.1; /* Faint transparency */
    z-index: 0; /* Behind all content */
}

.left-panel h1 {
    font-size: 48px; /* Large font size */
    color: #ffffff; /* White text color */
    margin-bottom: 20px; /* Spacing below heading */
    z-index: 1; /* On top of background */
    position: relative; /* Positioned for adjustments */
    top: -50px; /* Moves title above login box */
}


/*!* Right panel *!*/
.right-panel {
    flex: 2; /* Takes 3 parts of the container */
    background-color: #ffffff; /* White background */
    padding: 40px; /* Inner spacing */
    display: flex; /* Flexbox layout */
    flex-direction: column; /* Stacks children vertically */
    justify-content: center; /* Centers content vertically */
    align-items: stretch; /* Centers content horizontally */
}

/* Responsive design */
@media (max-width: 768px) {
    .main-container {
        flex-direction: column; /* Stacks sections vertically */
        height: auto; /* Adjusts to content height */
    }

    .left-panel,
    .right-panel {
        flex: none; /* Resets flex property */
        padding: 20px; /* Reduced padding */
    }
}

/* General Styling */
body {
    margin: 0; /* Removes default margin */
    font-family: 'Roboto', sans-serif; /* Sets the font style */
    background: linear-gradient(to right, #1f1f2e, #212e4a); /* Dark gradient background */
    display: flex; /* Flexbox layout */
    justify-content: center; /* Centers content horizontally */
    align-items: center; /* Centers content vertically */
    min-height: 100vh; /* Minimum height to cover full viewport */
    color: #eaeaea; /* Light gray text color */
}
</style>
