<template>
  <div class="admin-panel">
    <h2 class="header">Admin Panel - Manage Users</h2>

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
        <!-- User Card Header -->
        <div class="user-card-header" @click="toggleDetails(user)">
            <div class="user-info">
              <h3 :class="['username', user.status]">{{ user.username }}</h3>
              <span class="user-role">{{ user.role }}</span>
            </div>
          <button class="expand-button">
            <i
              class="fas"
              :class="selectedUser?._id === user._id ? 'fa-chevron-up' : 'fa-chevron-down'"
            ></i>
          </button>
        </div>

        <!-- User Details -->
        <div
          v-if="selectedUser?._id === user._id"
          class="user-details-container"
        >
          <div class="user-details">
            <div class="detail-item" v-if="user.fullName">
              <i class="fas fa-user"></i>
              <p><strong>Full Name:</strong> {{ user.fullName }}</p>
            </div>
            <div class="detail-item" v-if="user.email">
              <i class="fas fa-envelope"></i>
              <p><strong>Email:</strong> {{ user.email }}</p>
            </div>
            <div class="detail-item" v-if="user.phoneNumber">
              <i class="fas fa-phone"></i>
              <p><strong>Phone:</strong> {{ user.phoneNumber }}</p>
            </div>
            <div class="detail-item" v-if="user.gender">
              <i class="fas fa-venus-mars"></i>
              <p><strong>Gender:</strong> {{ user.gender }}</p>
            </div>
            <div class="detail-item" v-if="user.title">
              <i class="fas fa-briefcase"></i>
              <p><strong>Title:</strong> {{ user.title }}</p>
            </div>
            <div class="detail-item" v-if="user.specialty">
              <i class="fas fa-stethoscope"></i>
              <p><strong>Specialty:</strong> {{ user.specialty }}</p>
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="actions">
            <button
              class="status-button"
              :class="user.status === 'active' ? 'active' : 'inactive'"
              @click="handleToggleStatus(user._id)"
            >
              <i
                class="fas"
                :class="user.status === 'active' ? 'fa-toggle-on' : 'fa-toggle-off'"
              ></i>
              {{ user.status === "active" ? "Suspend" : "Activate" }}
            </button>
            <button class="delete-button" @click="handleDeleteUser(user._id)">
              <i class="fas fa-trash"></i> Delete
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
</template>

<script>
import { getUsers, toggleUserStatus, deleteUser } from "@/data/authService.js";

export default {
  name: "AdminPanelPage",
  data() {
    return {
      users: [],
      selectedUser: null,
      searchQuery: "",
      isLoading: false,
      errorMessage: "",
    };
  },
  computed: {
    filteredUsers() {
      return this.users.filter((user) =>
        user.username.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    },
  },
  methods: {
    toggleDetails(user) {
      this.selectedUser = this.selectedUser?._id === user._id ? null : user;
      this.$forceUpdate()
    },
    async handleDeleteUser(userId) {
      try {
        const result = await deleteUser(userId);
        if (result.success) this.fetchUsers();
        else this.errorMessage = result.message || "Failed to delete user.";
      } catch {
        this.errorMessage = "Failed to delete user. Please try again.";
      }
    },
    async handleToggleStatus(userId) {
      try {
        const result = await toggleUserStatus(userId);
        if (result.success) this.fetchUsers();
        else this.errorMessage = result.message || "Failed to toggle status.";
      } catch {
        this.errorMessage = "Failed to update user status. Please try again.";
      }
    },
    async fetchUsers() {
      this.isLoading = true;
      try {
        this.users = await getUsers();
      } catch {
        this.errorMessage = "Failed to load users. Please try again.";
      } finally {
        this.isLoading = false;
      }
    },
  },
  async created() {
    await this.fetchUsers();
  },
};
</script>

<style scoped>
/* General Layout */
.admin-panel {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  background: #f5f7f9;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);


  /* גובה קבוע וגלילה פנימית */
  height: 80vh; /* גובה קבוע (90% מגובה המסך) */
  overflow-y: auto; /* גלילה פנימית */
}

.header {
  margin-bottom: 20px;
  text-align: center;
}

.search-and-add-bar {
  display: flex;
  gap: 10px;
  justify-content: center;
  margin-top: 10px;
}

.search-input {
  flex: 1;
  padding: 10px;
  border: 1px solid #dcdcdc;
  border-radius: 4px;
}

.add-user-button {
  background: #4caf50;
  color: white;
  padding: 10px 15px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.add-user-button:hover {
  background: #45a045;
}

/* User List */
.user-list {
  margin-top: 20px;
}

.user-card {
  display: flex;
  flex-direction: column;
  margin-bottom: 15px;
  padding: 15px;
  border-radius: 8px;
  background: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  border-left: 5px solid transparent;
  transition: box-shadow 0.3s ease;
}

.user-card.active {
  border-left-color: #4caf50;
}

.user-card.inactive {
  border-left-color: #e57373;
}

.user-card:hover {
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.user-card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
}

.user-info h3 {
  margin: 0;
  font-size: 18px;
}

.expand-button {
  background: transparent;
  border: none;
  color: #4caf50;
  font-size: 18px;
  cursor: pointer;
}

/* Details Section */
.user-details-container {
  margin-top: 10px;
  border-top: 1px solid #e0e0e0;
  padding-top: 10px;
  height: 260px; /* קובע גובה קבוע לקונטיינר */
  overflow-y: hidden; /* גלילה פנימית */
}

.user-details {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.detail-item {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 14px;
}

.detail-item i {
  color: #4caf50;
  font-size: 18px;
}

/* Buttons */
.actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 20px;
}

.status-button {
  padding: 8px 15px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  color: white;
}

.status-button.active {
  background: #ffb74d;
}

.status-button.inactive {
  background: #e57373;
}

.delete-button {
  background: #ef5350;
  color: white;
  padding: 8px 15px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.delete-button:hover {
  background: #d32f2f;
}

/* שם המשתמש */
.username {
  font-size: 18px;
  font-weight: bold;
  margin: 0;
}

/* משתמש פעיל */
.username.active {
  color: #4caf50; /* ירוק */
}

/* משתמש לא פעיל */
.username.inactive {
  color: #e57373; /* אדום */
}

/* כותרת הדף */
.header {
  color: #3f51b5; /* צבע כחול לכותרת */
  font-size: 24px;
  margin-bottom: 20px;
  text-align: center;
}
</style>