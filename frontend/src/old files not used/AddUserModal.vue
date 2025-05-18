<template>
  <div class="modal-overlay">
    <div class="modal-container">
      <!-- Modal Header -->
      <div class="modal-header">
        <h2>Create a New User Profile</h2>
        <p class="modal-subtitle">Fill in the details below to add a new user to the system.</p>
        <button class="close-button" @click="$emit('onClose')">✖</button>
      </div>

      <!-- Modal Body -->
      <div class="modal-body">
        <form @submit.prevent="addUser">
          <!-- Personal Information Section -->
          <section>
            <h3 class="section-title">Personal Information</h3>
            <div class="form-group">
              <label for="username">Username: <span class="required">*</span></label>
              <input
                v-model="newUser.username"
                type="text"
                id="username"
                placeholder="Enter username"
                required
              />
            </div>
            <div class="form-group">
              <label for="fullName">Full Name: <span class="required">*</span></label>
              <input
                v-model="newUser.fullName"
                type="text"
                id="fullName"
                placeholder="Enter full name"
                required
              />
            </div>
            <div class="form-group">
              <label for="gender">Gender:</label>
              <select v-model="newUser.gender" id="gender">
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
          </section>

          <!-- Account Settings Section -->
          <section>
            <h3 class="section-title">Account Settings</h3>
            <div class="form-group">
              <label for="email">Email:</label>
              <input
                v-model="newUser.email"
                type="email"
                id="email"
                placeholder="Enter email (optional)"
              />
            </div>
            <div class="form-group">
              <label for="status">Account Status:</label>
              <select v-model="newUser.status" id="status" required>
                <option value="active">Active</option>
                <option value="suspended">Suspended</option>
              </select>
            </div>
            <div class="form-group">
              <label for="password">Password: <span class="required">*</span></label>
              <input
                v-model="newUser.password"
                type="password"
                id="password"
                placeholder="Enter password"
                required
              />
            </div>
          </section>

          <!-- Additional Details Section -->
          <section>
            <h3 class="section-title">Additional Details</h3>
            <div class="form-group">
              <label for="profilePictureUrl">Profile Picture URL:</label>
              <input
                v-model="newUser.profilePictureUrl"
                type="url"
                id="profilePictureUrl"
                placeholder="Enter profile picture URL"
              />
            </div>
            <div class="form-group">
              <label for="phoneNumber">Phone Number:</label>
              <input
                v-model="newUser.phoneNumber"
                type="tel"
                id="phoneNumber"
                placeholder="Enter phone number"
              />
            </div>
          </section>
        </form>
      </div>

      <!-- Modal Footer -->
      <div class="modal-footer">
        <button type="button" class="cancel-button" @click="$emit('onClose')">Cancel</button>
        <button type="submit" class="save-button" @click="addUser">Save</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "AddUserModal",
  props: ["showModal"],
  data() {
    return {
      newUser: {
        username: "",
        fullName: "",
        gender: "",
        email: "",
        status: "active",
        profilePictureUrl: "",
        phoneNumber: "",
        password: "",
      },
    };
  },
  methods: {
    async addUser() {
      // Basic validation for required fields
      if (!this.newUser.username || !this.newUser.fullName || !this.newUser.password) {
        alert("Please fill in all required fields (marked with *).");
        return;
      }

      try {
        const response = await fetch("http://localhost:3000/users", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(this.newUser),
        });

        if (!response.ok) {
          throw new Error("Failed to add user");
        }

        // Emit success events
        this.$emit("onUserAdded");
        this.$emit("onClose");
      } catch (error) {
        console.error("Error adding user:", error);
      }
    },
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
  background: #ffffff;
  width: 90%;
  max-width: 600px;
  max-height: 80vh;
  border-radius: 12px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.2);
  display: flex;
  flex-direction: column;
}

/* Modal Header */
.modal-header {
  background: linear-gradient(90deg, #2196f3, #64b5f6);
  color: white;
  padding: 15px 20px;
  display: flex;
  flex-direction: column;
}

.modal-subtitle {
  font-size: 14px;
  color: #f0f0f0;
  margin-top: 5px;
}

/* Modal Body */
.modal-body {
  padding: 20px;
  overflow-y: auto;
  flex: 1;
}

.section-title {
  margin-bottom: 10px;
  font-size: 18px;
  font-weight: bold;
  color: #333;
}

/* Form Styles */
.form-group {
  margin-bottom: 20px;
}

label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
}

.required {
  color: red;
}

input,
select {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 14px;
}

/* Modal Footer */
.modal-footer {
  display: flex;
  justify-content: flex-end;
  padding: 15px 20px;
  gap: 10px;
  background: #f9f9f9;
}

.save-button {
  background: linear-gradient(90deg, #42a5f5, #2196f3);
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.save-button:hover {
  background: #1e88e5;
}

.cancel-button {
  background: linear-gradient(90deg, #ef5350, #f44336);
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.cancel-button:hover {
  background: #d32f2f;
}
</style>
