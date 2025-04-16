<template>
  <div class="user-profile">
    <!-- אווטאר ופרטי משתמש -->
    <div
      class="user-avatar"
      :style="{ backgroundImage: `url(${user.profilePictureUrl || defaultAvatar})` }"
    ></div>

    <div class="separator"></div>

    <div class="user-details">
      <h2>
        Hello, {{ user.title !== "None" ? user.title + " " : "" }}{{ user.fullName }}!
      </h2>
      <p v-if="user.licenseId">
        <strong>Medical License ID:</strong> {{ user.licenseId }}
      </p>
      <p v-if="user.specialty">
        <strong>Medical Specialties:</strong> {{ user.specialty }}
      </p>
    </div>

    <div class="separator"></div>

    <!-- כפתורי ניווט -->
    <div class="action-buttons">
      <button class="action-button" @click="navigateTo('Home')">
        <i class="fas fa-home"></i> Home
      </button>

      <button class="action-button" @click="navigateTo('PatientList')">
        <i class="fas fa-clipboard-list"></i> Patient List
      </button>

      <button class="action-button" @click="navigateTo('PersonalArea')">
        <i class="fas fa-user-circle"></i> My Profile
      </button>


      <button
        v-if="user.isAdmin"
        class="action-button admin-button"
        @click="navigateTo('AdminPanel')"
      >
        <i class="fa fa-tools"></i> User Management
      </button>

      <!-- ✔️ עכשיו זה באמת מנתק -->
      <button class="logout-button" @click="$emit('logout')">Logout</button>
    </div>

    <!-- מודלים -->
    <PatientModal
      v-if="showPatientModal"
      :showModal="showPatientModal"
      @onClose="closePatientModal"
    />

    <AdminPanelModal
      v-if="showAdminModal"
      :showModal="showAdminModal"
      @onClose="closeAdminModal"
      :currentUser="user"
    />
  </div>
</template>

<script setup>
import PatientModal from "../pages/PatientModal.vue";
import AdminPanelModal from "../pages/AdminPanelModal.vue";
import { usePanelStore } from "@/stores/panelStore";
import { ref } from "vue";

const props = defineProps({
  user: {
    type: Object,
    required: true,
  },
});

const defaultAvatar = "https://static.vecteezy.com/system/resources/previews/034/466/010/non_2x/cartoon-blood-character-and-medical-doctor-stethoscope-for-health-care-hospital-pulse-heartbeat-design-vector.jpg";

const showPatientModal = ref(false);
const showAdminModal = ref(false);

// ⬇️ שימוש ב־store של הפאנלים
const panelStore = usePanelStore();

const navigateTo = (panelName) => {
  panelStore.setPanel(panelName); // 🔥 משנה את הפאנל דרך Pinia
};

const openPatientModal = () => {
  showPatientModal.value = true;
};

const closePatientModal = () => {
  showPatientModal.value = false;
};

const openAdminModal = () => {
  showAdminModal.value = true;
};

const closeAdminModal = () => {
  showAdminModal.value = false;
};
</script>


<style>
.open-modal-button {
  background-color: #008cba;
  color: white;
  padding: 10px 20px;
  margin-top: 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
}
.open-modal-button:hover {
  background-color: #005f5f;
}

.action-button i {
  margin-right: 8px;
  font-size: 16px;
}


.user-profile {
    background: linear-gradient(135deg, #f0f8ff, #e6f7f7); /* Soft gradient for a calming medical look */
    color: #004d66; /* Dark teal text for a professional and clean look */
    padding: 30px;
    border-radius: 20px; /* Rounded corners for a softer feel */
    position: relative;
    width: 100%;
    max-width: 450px; /* Maximum width for better responsiveness */
    font-family: 'Poppins', sans-serif; /* Modern and clean font */
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1); /* Light shadow for a floating card effect */
    text-align: center; /* Center-aligns all child elements */
}

.user-profile::before {
    content: ''; /* Decorative blur background */
    position: absolute;
    top: -50px; /* Positioned outside the main container */
    right: -50px;
    width: 200px;
    height: 200px;
    background: linear-gradient(45deg, #99d9ea, #c2f0f0); /* Subtle blue gradient */
    filter: blur(100px); /* Softens the gradient */
    z-index: 0; /* Ensures it's behind all other elements */
}

.user-avatar {
    width: 180px;
    height: 180px;
    border-radius: 50%; /* Ensures the image is circular */
    border: 4px solid #4db6ac; /* Soft green border for highlighting */
    background-image: url('https://t4.ftcdn.net/jpg/06/32/90/79/360_F_632907942_M6CVHD1ivhUrWK1X49PkBlSH3ooNPsog.jpg'); /* URL for profile image */
    background-size: cover; /* Ensures the image fills the circle */
    background-position: center; /* Centers the image within the container */
    margin: 0 auto 20px; /* Centers the image and adds space below */
    position: relative; /* Maintains relative positioning */
    z-index: 1; /* Ensures it's above the blurred background */
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2); /* Adds subtle depth */
}


.action-buttons {
    display: flex;
    flex-direction: column; /* Stacks buttons vertically */
    gap: 15px; /* Adds space between the buttons */
    margin-top: 25px; /* Adds separation from the details above */
    z-index: 1; /* Ensures it's above the blurred background */
    width: 100%; /* Ensures buttons fill the container width */
}

.action-button {
    background: linear-gradient(90deg, #ffffff, #f0f8ff); /* Light gradient for a clean look */
    color: #004d66; /* Dark teal for text */
    border: 2px solid #4db6ac; /* Green border for consistency */
    padding: 12px; /* Comfortable padding for the button */
    font-size: 15px; /* Slightly larger for emphasis */
    font-weight: bold; /* Makes the button text stand out */
    border-radius: 8px; /* Rounded corners for a friendly look */
    cursor: pointer; /* Changes the cursor to a pointer on hover */
    transition: transform 0.3s ease, background-color 0.3s ease; /* Smooth transition effects */
}

.action-button:hover {
    background: #4db6ac; /* Bright green for hover effect */
    color: white; /* Changes text color to white for contrast */
    transform: translateY(-5px); /* Subtle movement for interactivity */
}

/* כפתור "Manage Users" */
.admin-button {
    background: linear-gradient(90deg, #ffd700, #ffef9f); /* זהב עד צהוב בהיר */
    color: #004d66;
    border: 2px solid #e3b800; /* מסגרת זהובה כהה */
    font-size: 16px;
    font-weight: bold;
    padding: 12px;
    border-radius: 8px;
    cursor: pointer;
    transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.admin-button:hover {
    background: linear-gradient(90deg, #e3b800, #ffca28); /* זהב כהה יותר */
    transform: scale(1.05);
    box-shadow: 0 5px 15px rgba(227, 184, 0, 0.3); /* צל זהוב */
}

.logout-button {
    background: linear-gradient(90deg, #ff6f61, #ff867c); /* Soft gradient in red tones */
    color: white; /* White text for good contrast */
    padding: 12px; /* Comfortable padding for the button */
    border: none; /* Removes default border */
    border-radius: 10px; /* Rounded corners for a friendly feel */
    cursor: pointer; /* Pointer cursor on hover */
    transition: background-color 0.3s ease, transform 0.3s ease; /* Smooth hover effect */
}

.logout-button:hover {
    background: #e53935; /* Darker red for hover effect */
    transform: scale(1.05); /* Slight enlargement for interactivity */
}


.user-details h2 {
    font-size: 22px; /* Slightly larger for prominence */
    color: #004d66; /* Consistent with the teal color scheme */
    margin-bottom: 10px;
    text-transform: capitalize; /* Capitalizes only the first letter of each word */
    letter-spacing: 1px; /* Adds spacing for better readability */
    z-index: 1;
}

.user-details p {
    font-size: 14px; /* Standard size for body text */
    color: #00695c; /* A darker green for contrast */
    margin: 5px 0; /* Adds space between paragraphs */
    z-index: 1;
}
</style>
