<template>
  <div>
    <!-- Modal 1: Manage Users -->
    <div v-if="!showAddUserModal" class="modal-overlay">
      <div class="modal-container">
        <div class="modal-header">
          <h2>Admin Panel - Manage Users</h2>
          <button class="close-button" @click="$emit('onClose')">✖</button>
        </div>

        <div class="modal-body">
          <!-- Search and Add Bar -->
          <div class="search-and-add-bar">
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Search user by username"
              class="search-input"
            />
            <button class="add-user-button" @click="openAddUserModal">
              + Add User
            </button>
          </div>

          <!-- Error Message -->
          <div v-if="errorMessage" class="error-message">
            {{ errorMessage }}
          </div>

          <!-- Loading Indicator -->
          <div v-if="isLoading" class="loading-indicator">
            Loading users...
          </div>

          <!-- User List -->
          <div v-if="!isLoading && filteredUsers.length" class="user-list">
            <div
              v-for="user in filteredUsers"
              :key="user._id"
              :class="['user-card', user.status]"
            >
              <div class="user-card-header" @click="toggleDetails(user)">
                <div class="user-info">
                  <h3>{{ user.username }}</h3>
                  <span class="user-role">{{ user.role }}</span>
                </div>
                <button class="expand-button">
                  <span v-if="selectedUser?._id === user._id">▲</span>
                  <span v-else>▼</span>
                </button>
              </div>

              <!-- User Details -->
              <div v-if="selectedUser?._id === user._id" class="user-details">
                <div class="detail-item" v-if="user.fullName">
                  <p>
                    <strong>Full Name:</strong> {{ user.fullName }}
                  </p>
                </div>
                <div class="detail-item" v-if="user.email">
                  <p>
                    <strong>Email:</strong> {{ user.email }}
                  </p>
                </div>
                <div class="detail-item" v-if="user.phoneNumber">
                  <p>
                    <strong>Phone:</strong> {{ user.phoneNumber }}
                  </p>
                </div>
                <div class="detail-item" v-if="user.gender">
                  <p>
                    <strong>Gender:</strong> {{ user.gender }}
                  </p>
                </div>
                <div class="detail-item" v-if="user.title">
                  <p>
                    <strong>Title:</strong> {{ user.title }}
                  </p>
                </div>
                <div class="detail-item" v-if="user.specialty">
                  <p>
                    <strong>Specialty:</strong> {{ user.specialty }}
                  </p>
                </div>

                <!-- Action Buttons -->
                <div class="actions">
                  <button
                    class="status-button"
                    @click="handleToggleStatus(user._id)"
                  >
                    {{ user.status === "active" ? "Suspend" : "Activate" }}
                  </button>
                  <button
                    class="delete-button"
                    @click="handleDeleteUser(user._id)"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- No Users Found -->
          <div v-if="!isLoading && !filteredUsers.length" class="no-users">
            No users found.
          </div>
        </div>
      </div>
    </div>

    <!-- Modal 2: Add User -->
    <AddUserModal
      v-if="showAddUserModal"
      @onClose="closeAddUserModal"
      @onUserAdded="refreshUsers"
    />
  </div>
</template>

<script>
import AddUserModal from "./AddUserModal.vue";
import { getUsers, toggleUserStatus, deleteUser } from "@/data/authService.js"; // Import API methods

export default {
  name: "ManageUsersModal",
  props: ["showModal"],
  components: {
    AddUserModal,
  },
  data() {
    return {
      users: [], // List of all users
      selectedUser: null, // Currently selected user
      searchQuery: "", // Search bar input
      showAddUserModal: false, // Whether the AddUserModal is shown
      isLoading: false, // Loading state
      errorMessage: "", // Error message
    };
  },
  computed: {
    filteredUsers() {
      if (!Array.isArray(this.users)) return [];
      return this.users.filter(
        (user) =>
          user.username.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
          (user.email &&
            user.email.toLowerCase().includes(this.searchQuery.toLowerCase())) ||
          (user.phoneNumber &&
            user.phoneNumber.includes(this.searchQuery))
      );
    },
  },
  methods: {
    toggleDetails(user) {
      this.selectedUser = this.selectedUser?._id === user._id ? null : user;
    },
    async handleDeleteUser(userId) {
      try {
        const result = await deleteUser(userId); // Use the deleteUser function from api.js
        if (result.success) {
          this.refreshUsers(); // Refresh user list
        } else {
          this.errorMessage = result.message || "Failed to delete user.";
        }
      } catch (error) {
        console.error("Error deleting user:", error);
        this.errorMessage = "Failed to delete user. Please try again.";
      }
    },
    async handleToggleStatus(userId) {
      try {
        const result = await toggleUserStatus(userId); // Use the toggleUserStatus function from api.js
        if (result.success) {
          this.refreshUsers(); // Refresh user list
        } else {
          this.errorMessage = result.message || "Failed to toggle user status.";
        }
      } catch (error) {
        console.error("Error toggling user status:", error);
        this.errorMessage = "Failed to update user status. Please try again.";
      }
    },
    async fetchUsers() {
      this.isLoading = true;
      this.errorMessage = ""; // Clear any existing error messages
      try {
        const data = await getUsers(); // Use the getUsers function from api.js
        this.users = data;
      } catch (error) {
        console.error("Failed to fetch users:", error);
        this.errorMessage = "Failed to load users. Please try again.";
        this.users = [];
      } finally {
        this.isLoading = false;
      }
    },
    openAddUserModal() {
      this.showAddUserModal = true;
    },
    closeAddUserModal() {
      this.showAddUserModal = false;
    },
    refreshUsers() {
      this.fetchUsers();
    },
  },
  async created() {
    await this.fetchUsers();
  },
};
</script>


<style scoped>
/* Modal Overlay */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

/* Modal Container */
.modal-container {
  background: #f9fafb;
  color: #333;
  width: 90%;
  max-width: 800px;
  border-radius: 15px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.2);
  overflow: hidden;
  animation: fadeIn 0.3s ease;
}

/* Modal Header */
.modal-header {
  background: #4caf50;
  color: white;
  padding: 15px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 20px;
  font-weight: bold;
  border-bottom: 3px solid #388e3c;
}

.close-button {
  background: transparent;
  border: none;
  color: white;
  font-size: 24px;
  cursor: pointer;
  transition: transform 0.2s ease;
}

.close-button:hover {
  transform: scale(1.2);
}

/* Search and Add Bar */
.search-and-add-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  background: #e8f5e9;
  border-bottom: 1px solid #c8e6c9;
}

.search-input {
  flex: 1;
  margin-right: 15px;
  padding: 10px 15px;
  font-size: 16px;
  border: 1px solid #c8e6c9;
  border-radius: 5px;
  outline: none;
  transition: border-color 0.3s ease;
}

.search-input:focus {
  border-color: #4caf50;
}

.add-user-button {
  background: #4caf50;
  color: white;
  border: none;
  padding: 10px 15px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
  font-weight: bold;
  transition: background-color 0.3s ease, transform 0.2s ease;
}

.add-user-button:hover {
  background: #388e3c;
  transform: scale(1.05);
}

/* User List */
.user-list {
  padding: 20px;
  max-height: 400px;
  overflow-y: auto;
}

.user-card {
  background: white;
  padding: 15px 20px;
  border-radius: 10px;
  margin-bottom: 15px;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  border-left: 5px solid transparent;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.user-card.active {
  border-left: 5px solid #4caf50;
}

.user-card.inactive {
  border-left: 5px solid #e57373;
}

.user-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
}

.user-card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
}

.user-info h3 {
  font-size: 18px;
  margin: 0;
}

.user-info .user-role {
  font-size: 14px;
  color: #777;
}

.expand-button {
  background: transparent;
  color: #4caf50;
  border: none;
  font-size: 16px;
  cursor: pointer;
  transition: transform 0.2s ease;
}

.expand-button:hover {
  transform: scale(1.1);
}

/* User Details */
.user-details {
  margin-top: 10px;
  padding: 10px;
  background: #f1f8e9;
  border-radius: 8px;
  border: 1px solid #c8e6c9;
}

.detail-item {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}

.status-indicator {
  font-weight: bold;
  text-transform: capitalize;
}

.status-indicator.active {
  color: #4caf50;
}

.status-indicator.inactive {
  color: #e57373;
}

.actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

.status-button {
  background: #ffb74d;
  color: white;
  padding: 8px 15px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.3s ease;
}

.status-button:hover {
  background: #ff9800;
}

.delete-button {
  background: #ef5350;
  color: white;
  padding: 8px 15px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.3s ease;
}

.delete-button:hover {
  background: #e53935;
}

/* Add User Form */
.add-user-form {
  padding: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
  margin-bottom: 15px;
}

.form-group label {
  font-weight: bold;
  margin-bottom: 5px;
  font-size: 14px;
  color: #333;
}

.form-group input,
.form-group select {
  width: 100%;
  padding: 10px;
  font-size: 14px;
  border: 1px solid #c8e6c9;
  border-radius: 5px;
  outline: none;
  transition: border-color 0.3s ease;
}

.form-group input:focus,
.form-group select:focus {
  border-color: #4caf50;
}

.form-actions {
  text-align: right;
  margin-top: 20px;
}

.save-button {
  background: #4caf50;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 14px;
  font-weight: bold;
  transition: background-color 0.3s ease;
}

.save-button:hover {
  background: #388e3c;
}

.cancel-button {
  background: #ef5350;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 14px;
  font-weight: bold;
  margin-left: 10px;
  transition: background-color 0.3s ease;
}

.cancel-button:hover {
  background: #e53935;
}

/* Animations */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: scale(0.9);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.smooth-slide-enter-active,
.smooth-slide-leave-active {
  transition: all 0.5s cubic-bezier(0.25, 1, 0.5, 1);
}

.smooth-slide-enter-from,
.smooth-slide-leave-to {
  transform: translateX(100%);
  opacity: 0;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>


