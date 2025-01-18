<template>
  <div class="admin-panel">
    <h2>Admin Panel</h2>

    <!-- הצגת רשימת המשתמשים -->
    <div class="user-list">
      <h3>Users</h3>
      <ul>
        <li v-for="user in users" :key="user.id">
          {{ user.username }} ({{ user.role }}) - {{ user.status }}
          <button @click="toggleStatus(user.username)">
            {{ user.status === "active" ? "Deactivate" : "Activate" }}
          </button>
        </li>
      </ul>
    </div>

    <!-- כפתור לפתיחת ה-Modal להוספת משתמשים -->
    <button @click="openAddUserModal" class="open-modal-button">
      Add User
    </button>

    <!-- Modal להוספת משתמשים -->
    <div v-if="showAddUserModal" class="modal-overlay">
      <div class="modal-content">
        <h3>Add New User</h3>
        <form @submit.prevent="handleAddUser">
          <input
            v-model="newUser.username"
            placeholder="Username"
            required
          />
          <input
            v-model="newUser.password"
            type="password"
            placeholder="Password"
            required
          />
          <select v-model="newUser.role" required>
            <option value="doctor">Doctor</option>
          </select>
          <div class="modal-actions">
            <button type="submit" class="save-button">Save</button>
            <button type="button" class="cancel-button" @click="closeAddUserModal">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import {getUsers, addUser, toggleUserStatus} from "@/data/authService";

export default {
  props: ["currentUser"], // המנהל הנוכחי
  data() {
    return {
      users: [], // רשימת המשתמשים
      newUser: {
        username: "",
        password: "",
        role: "doctor",
      },
      showAddUserModal: false, // שליטה על הצגת ה-Modal
    };
  },
  async created() {
    this.users = await getUsers(); // טוען את המשתמשים בעת יצירת הרכיב
  },
  methods: {
    async handleAddUser() {
      const result = await addUser(this.currentUser, this.newUser);
      if (result.success) {
        this.users = result.users;
        alert("User added successfully");
        this.closeAddUserModal();
      } else {
        alert(result.message);
      }
    },
    async toggleStatus(username) {
      const result = await toggleUserStatus(this.currentUser, username);
      if (result.success) {
        this.users = result.users;
        alert("User status updated");
      } else {
        alert(result.message);
      }
    },
    openAddUserModal() {
      this.showAddUserModal = true;
    },
    closeAddUserModal() {
      this.showAddUserModal = false;
    },
  },
};
</script>

<style scoped>
/* עיצוב ל-Modal */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.6); /* שכבה כהה על המסך */
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  padding: 20px;
  border-radius: 8px;
  width: 400px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  text-align: center;
}

.modal-actions {
  margin-top: 20px;
  display: flex;
  justify-content: space-around;
}

.save-button {
  background: #4caf50;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background 0.3s ease;
}

.save-button:hover {
  background: #388e3c;
}

.cancel-button {
  background: #f44336;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background 0.3s ease;
}

.cancel-button:hover {
  background: #d32f2f;
}

.open-modal-button {
  background: #2196f3;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  margin-top: 20px;
  cursor: pointer;
  transition: background 0.3s ease;
}

.open-modal-button:hover {
  background: #1976d2;
}

/* עיצוב רשימת המשתמשים */
.user-list ul {
  list-style-type: none;
  padding: 0;
  margin: 20px 0;
}

.user-list li {
  margin: 10px 0;
  display: flex;
  justify-content: space-between;
}

.user-list button {
  background: #ff9800;
  color: white;
  border: none;
  padding: 5px 10px;
  border-radius: 5px;
  cursor: pointer;
  transition: background 0.3s ease;
}

.user-list button:hover {
  background: #e65100;
}
</style>
