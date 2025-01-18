<template>
  <div class="user-profile">
    <div class="user-avatar"> </div>
<!--    <div class="user-avatar" v-if="user.profilePictureUrl">-->
<!--      <img :src="user.profilePictureUrl" alt="User Avatar" />-->
<!--    </div>-->
<!--    <div v-else class="user-avatar-placeholder">-->
<!--      <p>No Avatar</p>-->
<!--    </div>-->
    <div class="separator"></div>
    <div class="user-details">
      <h2>
        Hello, {{ user.title !== 'None' ? user.title + ' ' : '' }}{{ user.fullName }}!
      </h2>
      <p v-if="user.licenseId">
        <strong>Medical License ID:</strong> {{ user.licenseId || "N/A" }}
      </p>
      <p v-if="user.specialty">
        <strong>Medical Specialties:</strong> {{ user.specialty || "N/A" }}
      </p>
    </div>
    <div class="separator"></div>
    <div class="action-buttons">
      <button class="action-button" @click="openPatientModal">Patient List</button>
      <button class="action-button" @click="navigateTo('personalArea')">
        Personal Area
      </button>
      <button
        v-if="user.isAdmin"
        class="action-button admin-button"
        @click="openAdminModal"
      >
        <i class="fa fa-tools" aria-hidden="true"></i> Manage Users
      </button>
      <button class="logout-button" @click="onLogout">Logout</button>
    </div>

    <!-- Modal for displaying patient list -->
    <PatientModal
      v-if="showPatientModal"
      :showModal="showPatientModal"
      @onClose="closePatientModal"
    />

    <!-- Modal for Admin Panel -->
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
      this.$emit("navigate", section);
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
