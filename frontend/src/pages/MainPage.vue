<template>
  <div class="main-container">
    <!-- Left panel: Login or Dashboard -->
    <div class="left-panel">
      <Login v-if="!isLoggedIn" @login="handleLogin" />
      <Dashboard
        v-else
        class="dashboard-container"
        :user="userDetails"
        @logout="handleLogout"
      />
    </div>

    <!-- Right panel: InfoPanel(HOME) / PatientList / PersonalArea / AdminPanel -->
    <div class="right-panel">
      <InfoPanel v-if="!isLoggedIn" />
      <div v-else>
        <InfoPanel v-if="panelStore.selectedPanel === 'Home'" :isLoggedIn="true" />

        <!-- PatientList panel re-renders when panel or dataset changes -->
        <PatientList
          v-else-if="panelStore.selectedPanel === 'PatientList'"
          :key="panelComponentKey"
        />

        <!-- PersonalArea panel for user profile -->
        <PersonalArea
          v-else-if="panelStore.selectedPanel === 'PersonalArea'"
          @profile-updated="handleProfileUpdate"
        />

        <!-- Admin panel (restricted area) -->
        <AdminPanel v-else-if="panelStore.selectedPanel === 'AdminPanel'" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { eventBus } from "@/utils/eventBus";
import { usePanelStore } from "@/stores/panelStore";
import { useDataSourceStore } from "@/stores/dataSourceStore";

import Login from "../components/Login.vue";
import Dashboard from "../components/Dashboard.vue";
import InfoPanel from "../components/InfoPanel.vue";
import PatientList from "../components/PatientList.vue";
import AdminPanel from "@/components/AdminPanel.vue";
import PersonalArea from "../components/PersonalArea.vue";

// Store instances
const panelStore = usePanelStore();
const dataSourceStore = useDataSourceStore();
const router = useRouter();

const isLoggedIn = ref(false); // Authentication state
const userDetails = ref(null); // Current user data

// Key for dynamically re-rendering panels based on panel/dataset selection
const panelComponentKey = computed(() => {
  return `${panelStore.selectedPanel}-${dataSourceStore.selectedDataset}`;
});

// On component mount: check localStorage for saved user details & listen to token expiration event
onMounted(() => {
  const storedUser = localStorage.getItem("userDetails");
  if (storedUser) {
    userDetails.value = JSON.parse(storedUser);
    isLoggedIn.value = true;
  }

  eventBus.on("token-expired", handleLogout);
});

// Handles successful login
const handleLogin = (user) => {
  localStorage.setItem("userDetails", JSON.stringify(user));
  userDetails.value = user;
  isLoggedIn.value = true;
  panelStore.setPanel("Home");
};

// Logs out user & clears relevant data
const handleLogout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("userId");
  localStorage.removeItem("userDetails");

  userDetails.value = null;
  isLoggedIn.value = false;
  panelStore.setPanel("Home");

  router.push("/");
};

// Updates user details after profile edit
const handleProfileUpdate = (updatedUser) => {
  userDetails.value = { ...updatedUser };
  localStorage.setItem("userDetails", JSON.stringify(updatedUser));
};
</script>

<style>
/* ===== Main Container Layout ===== */
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


/* ===== Left Panel (Login / Dashboard) ===== */
.left-panel {
  flex: 1;
  background-color: #004d4d;
  color: #ffffff;
  padding: 40px 60px 40px 60px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center; /* Vertical alignment */
  position: relative;
}


.left-panel::before {
    content: ''; /* Empty content for background */
    position: absolute; /* Positioned relative to parent */
    top: 0; /* Aligns to the top */
    left: 0; /* Aligns to the left */
    width: 100%; /* Full width */
    height: 100%; /* Full height */
    /* TODO: upload an new url to the background img for dashboard. */
    background: url('https://media2.giphy.com/media/v1.Y2lkPTc5MGI3NjExYzhzODh5bGZ2M2t1YnRpZnhyZ3JsbjByeWpsa20zMDRvNG8ydndwcSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/3bc8pP1rVdfgN1uoMV/giphy.webp') no-repeat center; /* Background image */
    background-size: cover; /* Image covers entire area */
    opacity: 0.1; /* Faint transparency */
    z-index: 0; /* Behind all content */
}

/* Left Panel Title Styling */
.left-panel h1 {
    font-size: 48px; /* Large font size */
    color: #ffffff; /* White text color */
    margin-bottom: 20px; /* Spacing below heading */
    z-index: 1; /* On top of background */
    position: relative; /* Positioned for adjustments */
    top: -50px; /* Moves title above login box */
}


/* ===== Right Panel (Main Content) ===== */
.right-panel {
    flex: 2; /* Takes 3 parts of the container */
    background-color: #ffffff; /* White background */
    padding: 40px; /* Inner spacing */
    display: flex; /* Flexbox layout */
    flex-direction: column; /* Stacks children vertically */
    justify-content: center; /* Centers content vertically */
    align-items: stretch; /* Centers content horizontally */
}

/* ===== Responsive Design for Small Screens ===== */
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

/* ===== General Body Styles ===== */
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
