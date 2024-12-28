<template>
  <div class="user-profile">
    <div class="user-avatar"></div>
    <div class="separator"></div>
    <div class="user-details">
      <h2>Hello, Dr. {{ user.name }}!</h2>
      <p>
        <strong>Medical License ID:</strong> {{ user.licenseId }}
      </p>
      <p>
        <strong>Medical Specialties:</strong> {{ user.specialty }}
      </p>
    </div>
    <div class="separator"></div>
    <div class="action-buttons">
      <button class="action-button" @click="openPatientModal">Patient List</button>
      <button class="action-button" @click="navigateTo('personalArea')">Personal Area</button>
      <button class="logout-button" @click="onLogout">Logout</button>
    </div>

    <!-- Modal for displaying patient list -->
    <PatientModal
      v-if="showPatientModal"
      :showModal="showPatientModal"
      @onClose="closePatientModal"
    />
  </div>
</template>

<script>
import PatientModal from "../pages/PatientModal.vue";

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
  },
  data() {
    return {
      showPatientModal: false, // Control visibility of patient modal
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
