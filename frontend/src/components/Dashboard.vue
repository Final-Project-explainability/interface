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
      <button class="action-button" @click="navigateTo('Home')">Home</button>
      <button class="action-button" @click="navigateTo('PatientList')">Patient List</button>
      <button class="action-button" @click="navigateTo('PersonalArea')">Personal Area</button>

      <button
        v-if="user.isAdmin"
        class="action-button admin-button"
        @click="navigateTo('AdminPanel')"
      >
        <i class="fa fa-tools"></i> Manage Users
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
  },
  components: {
    PatientModal,
    AdminPanelModal,
  },
  data() {
    return {
      defaultAvatar: "https://static.vecteezy.com/system/resources/previews/034/466/010/non_2x/cartoon-blood-character-and-medical-doctor-stethoscope-for-health-care-hospital-pulse-heartbeat-design-vector.jpg",
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
