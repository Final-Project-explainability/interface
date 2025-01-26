<template>
  <div class="user-profile">
    <!-- אווטאר ופרטי משתמש -->
    <div class="user-avatar"> </div>
    <div class="separator"></div>
    <div class="user-details">
      <h2>
        Hello, {{ user.title !== "None" ? user.title + " " : "" }}{{ user.fullName }}!
      </h2>
      <p v-if="user.licenseId">
        <strong>Medical License ID:</strong> {{ user.licenseId || "N/A" }}
      </p>
      <p v-if="user.specialty">
        <strong>Medical Specialties:</strong> {{ user.specialty || "N/A" }}
      </p>
    </div>

    <div class="separator"></div>

    <!-- כפתורי ניווט -->
    <div class="action-buttons">
      <button class="action-button" @click="navigateTo('Home')">
        Home
      </button>
      <button class="action-button" @click="navigateTo('PatientList')">
        Patient List
      </button>
      <button class="action-button" @click="navigateTo('PersonalArea')">
        Personal Area
      </button>
      <button
        v-if="user.isAdmin"
        class="action-button admin-button"
        @click="navigateTo('AdminPanel')"
      >
        <i class="fa fa-tools" aria-hidden="true"></i> Manage Users
      </button>
      <button class="logout-button" @click="onLogout">Logout</button>
    </div>

    <!-- מודל רשימת מטופלים -->
    <PatientModal
      v-if="showPatientModal"
      :showModal="showPatientModal"
      @onClose="closePatientModal"
    />

    <!-- מודל ניהול משתמשים -->
    <AdminPanelModal
      v-if="showAdminModal"
      :showModal="showAdminModal"
      @onClose="closeAdminModal"
      :currentUser="user"
    />
  </div>
</template>

<script>
import PatientModal from "../pages/PatientModal.vue";
import AdminPanelModal from "../pages/AdminPanelModal.vue";

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
  components: {
    PatientModal,
    AdminPanelModal,
  },
  data() {
    return {
      showPatientModal: false,
      showAdminModal: false,
    };
  },
  methods: {
    navigateTo(section) {
      this.$emit("navigate", section); // שליחת מצב נוכחי ל-MainPage
    },
    openPatientModal() {
      this.showPatientModal = true;
    },
    closePatientModal() {
      this.showPatientModal = false;
    },
    openAdminModal() {
      this.showAdminModal = true;
    },
    closeAdminModal() {
      this.showAdminModal = false;
    },
  },
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
</style>
