<template>
  <div class="admin-panel">
    <h2 class="header">
      {{ currentView === 'addUser' ? 'Admin Panel - Add User to System' : 'Admin Panel - User Management' }}
    </h2>

    <div v-if="currentView === 'addUser'" class="add-user-form">
      <!-- כפתור חזור -->
      <button class="back-button" @click="toggleAddUserForm">
        <i class="fas fa-arrow-left"></i> Back
      </button>

      <!-- אווטאר במרכז -->
      <div class="avatar-container">
        <img :src="newUser.profilePictureUrl || defaultAvatar" class="avatar-img" />
      </div>

      <!-- שדות המשתמש -->
      <div class="form-fields">
        <div class="input-group">
          <input
            v-model="newUser.fullName"
            type="text"
            placeholder="Full Name"
            required
            @input="validateFullName"
            :class="{ 'invalid-field': fullNameInvalid }"
          />
          <p v-if="fullNameInvalid" class="error-message">
            Full name must contain English letters only
          </p>
        </div>
        <p></p>



        <div class="input-group">
          <input
            v-model="newUser.username"
            type="text"
            placeholder="Username"
            required
            @input="validateUsername"
          />
          <p v-if="usernameHasSpaces" class="error-message">Username cannot contain spaces</p>
          <p v-if="usernameInvalid" class="error-message">Username can only contain English letters and numbers</p>
          <p v-if="!usernameHasSpaces && !usernameInvalid && usernameAvailable === false" class="error-message">Username is already taken</p>
          <p v-if="usernameAvailable && !usernameHasSpaces && !usernameInvalid" class="success-message">Username is available</p>
        </div>


        <div class="password-row">
          <div class="input-wrapper password-input-wrapper">
            <input
              :type="passwordVisible ? 'text' : 'password'"
              v-model="newUser.password"
              placeholder="Password"
              required
              @input="validatePassword"
              :class="{ 'invalid-field': passwordInvalid, 'valid-field': !passwordInvalid && newUser.password }"
            />
            <!-- כפתור עין -->
            <span class="toggle-password" @click="togglePassword">
              <i :class="passwordVisible ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
            </span>
          </div>

          <!-- הודעת שגיאה / הצלחה -->
          <p v-if="passwordInvalid" class="error-message">
            Password must be at least 6 characters and include only English letters, numbers or symbols
          </p>

          <!-- כפתור ג'נרציה מימין -->
          <button class="generate-button" @click.prevent="generatePassword">
            Generate a random password
          </button>
          <p></p>
        </div>




        <!-- טייטל -->
        <select v-model="newUser.title">
          <option disabled value="">Select Title</option>
          <option v-for="option in titles" :key="option">{{ option }}</option>
        </select>
        <p></p>


        <!-- מס רישיון והתמחות -->
        <div class="input-group">
          <input
            v-model="newUser.licenseId"
            type="text"
            placeholder="License ID"
            required
            @input="validateLicenseId"
            :class="{ 'invalid-field': licenseIdInvalid, 'valid-field': licenseIdValid }"
          />

          <!-- הודעה אם יש תווים לא חוקיים -->
          <p v-if="licenseIdNotNumeric" class="error-message">
            License ID must contain digits only ❌
          </p>

          <p v-if="licenseIdInvalid" class="error-message">This Medical License ID is already belong to some user in the system ❌</p>
        </div>



        <div class="input-group">
          <input
            v-model="newUser.specialty"
            type="text"
            placeholder="Specialty"
            @input="validateSpecialty"
            :class="{ 'invalid-field': specialtyInvalid }"
          />
          <p v-if="specialtyInvalid" class="error-message">Specialty must contain English letters only</p>
        </div>



        <!-- Email -->
        <div class="input-group">
          <input
            v-model="newUser.email"
            type="email"
            placeholder="Email"
            @input="emailInvalid = newUser.email ? !isValidEmail(newUser.email) : false"
          />
          <p v-if="emailInvalid" class="error-message">Invalid email format</p>
        </div>


        <!-- Phone -->
        <div class="input-group">
          <input
            v-model="newUser.phoneNumber"
            type="tel"
            placeholder="Phone Number"
            @input="phoneInvalid = newUser.phoneNumber ? !isValidIsraeliPhone(newUser.phoneNumber) : false"
          />
          <p v-if="phoneInvalid" class="error-message">
            Phone must start with 05 and be 10 digits
          </p>
        </div>







        <div class="toggle-row">
          <!-- Gender Toggle -->
          <div class="toggle-group">
            <span class="toggle-label">Gender:</span>
            <button
              :class="['toggle-button', { selected: newUser.gender === 'male' }]"
              @click="newUser.gender = 'male'"
            >
              Male
            </button>
            <button
              :class="['toggle-button', { selected: newUser.gender === 'female' }]"
              @click="newUser.gender = 'female'"
            >
              Female
            </button>
          </div>

          <!-- Role Toggle -->
          <div class="toggle-group">
            <span class="toggle-label">Admin Permission?</span>
            <button
              :class="['toggle-button', { selected: newUser.role === 'user' }]"
              @click="newUser.role = 'user'"
            >
              No
            </button>
            <button
              :class="['toggle-button', { selected: newUser.role === 'admin' }]"
              @click="newUser.role = 'admin'"
            >
              Yes
            </button>
          </div>
        </div>


      </div>

      <!-- כפתור יצירה -->
      <button
        type="submit"
        class="save-button"
        @click="handleAddUser"
        :disabled="!canSubmit"
      >
        Create New User
      </button>


      <!-- הודעת שגיאה -->
      <div v-if="errorMessage" class="error-message">
        {{ errorMessage }}
      </div>
    </div>



    <div v-if="currentView === 'list'">
        <!-- Search and Add Bar -->
        <div class="search-and-add-bar">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search by username, full name or medical license ID"
            class="search-input"
          />
          <button class="add-user-button" @click="toggleAddUserForm">
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
            :class="['user-card', user.status, { admin: user.isAdmin}]"
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
                  :class="user.isAdmin ? 'fa-crown' : (selectedUser?._id === user._id ? 'fa-chevron-up' : 'fa-chevron-down')"
                ></i>
              </button>
            </div>

            <!-- User Details -->
            <div v-if="selectedUser?._id === user._id" class="user-details-container">
            <div class="user-card-layout">
              <!-- פרטי משתמש בצד שמאל -->
              <div class="user-info">
                <div class="detail-item" v-if="user.fullName">
                  <i class="fas fa-user"></i>
                  <p><strong>Full Name:</strong> {{ user.fullName }}</p>
                </div>
                <div class="detail-item" v-if="user.email">
                  <i class="fas fa-envelope"></i>
                  <p><strong>Email:</strong> {{ user.email }}</p>
                </div>
                <!-- טלפון -->
                <div class="detail-item" v-if="user.phoneNumber">
                  <i class="fas fa-phone"></i>
                  <p><strong>Phone:</strong> {{ user.phoneNumber }}</p>
                </div>

                <!-- מספר רישיון -->
                <div class="detail-item" v-if="user.licenseId">
                  <i class="fas fa-id-card"></i>
                  <p><strong>License ID:</strong> {{ user.licenseId }}</p>
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

              <!-- תמונת אווטאר + כפתורים בצד ימין -->
              <div class="user-avatar-section">
                <!-- שם המשתמש -->
                <div class="username-badge">
                  <i class="fas fa-at"></i> {{ user.username }}
                </div>


                <div
                  class="avatar-circle"
                  :style="{ backgroundImage: `url(${user.profilePictureUrl || defaultAvatar})` }"
                ></div>

                <!-- כפתורי פעולה מתחת לתמונה -->
                <div class="actions"  v-if="!user.isAdmin">
                  <button class="edit-button" @click="startEditing(user)">
                    <i class="fas fa-edit"></i> Edit
                  </button>

                  <button
                    class="status-button"
                    :class="user.status === 'active' ? 'active' : 'inactive'"
                    @click="handleToggleStatus(user._id)"
                  >
                    <i class="fas" :class="user.status === 'active' ? 'fa-toggle-on' : 'fa-toggle-off'"></i>
                    {{ user.status === "active" ? "Suspend" : "Activate" }}
                  </button>
                  <button class="delete-button" @click="handleDeleteUser(user._id)">
                    <i class="fas fa-trash"></i> Delete
                  </button>
                </div>
              </div>
            </div>
          </div>



          <div v-if="editUser && editUser._id === user._id" class="edit-form">
            <div class="input-group">
              <label>Full Name</label>
              <input
                v-model="editUser.fullName"
                type="text"
                :class="{ 'invalid-field': editSubmitted && editValidation.fullName }"
                @input="handleEditInput('fullName')"
              />
              <p v-if="editSubmitted && editValidation.fullName" class="error-message">
                Full name must contain English letters only
              </p>
            </div>

            <div class="input-group">
              <label><i class="fas fa-lock"></i> Username (read-only)</label>
              <input
                v-model="editUser.username"
                type="text"
                readonly
                class="readonly-field"
              />
            </div>

            <div class="input-group">
              <label>Email</label>
              <input
                v-model="editUser.email"
                type="email"
                :class="{ 'invalid-field': editSubmitted && editValidation.email }"
                @input="handleEditInput('email')"
              />
              <p v-if="editSubmitted && editValidation.email" class="error-message">
                Invalid email format
              </p>
            </div>

            <div class="input-group">
              <label>Phone Number</label>
              <input
                v-model="editUser.phoneNumber"
                type="tel"
                :class="{ 'invalid-field': editSubmitted && editValidation.phone }"
                @input="handleEditInput('phone')"
              />
              <p v-if="editSubmitted && editValidation.phone" class="error-message">
                Phone must start with 05 and be 10 digits
              </p>
            </div>

            <div class="input-group">
              <label>Medical License ID</label>
              <input
                v-model="editUser.licenseId"
                type="text"
                :class="{ 'invalid-field': editSubmitted && editValidation.licenseId }"
                @input="handleEditInput('licenseId')"
              />
              <p v-if="editSubmitted && editValidation.licenseId" class="error-message">
                License ID must be unique and contain digits only
              </p>
            </div>

            <div class="input-group">
              <label>Title</label>
              <select v-model="editUser.title">
                <option disabled value="">Select Title</option>
                <option v-for="option in titles" :key="option">{{ option }}</option>
              </select>
            </div>


            <div class="input-group">
              <label>Specialty</label>
              <input
                v-model="editUser.specialty"
                type="text"
                :class="{ 'invalid-field': editSubmitted && editValidation.specialty }"
                @input="handleEditInput('specialty')"
              />
              <p v-if="editSubmitted && editValidation.specialty" class="error-message">
                Specialty must contain English letters only
              </p>
            </div>

            <!-- Gender & Role Toggles -->
            <div class="toggle-row">
              <div class="toggle-group">
                <span class="toggle-label">Gender:</span>
                <button
                  :class="['toggle-button', { selected: editUser.gender === 'male' }]"
                  @click="editUser.gender = 'male'"
                  type="button"
                >
                  Male
                </button>
                <button
                  :class="['toggle-button', { selected: editUser.gender === 'female' }]"
                  @click="editUser.gender = 'female'"
                  type="button"
                >
                  Female
                </button>
              </div>

              <div class="toggle-group">
                <span class="toggle-label">Is Admin?</span>
                <button
                  :class="['toggle-button', { selected: !editUser.isAdmin }]"
                  @click="editUser.role = 'user'; editUser.isAdmin = false"
                  type="button"
                >
                  No
                </button>
                <button
                  :class="['toggle-button', { selected: editUser.isAdmin }]"
                  @click="editUser.role = 'admin'; editUser.isAdmin = true"
                  type="button"
                >
                  Yes
                </button>
              </div>
            </div>

            <div class="actions">
              <button class="save-button" @click="saveUserEdits">Save Changes</button>
              <button class="cancel-button" @click="cancelEdit">Cancel</button>
            </div>

            <p></p>
            <div class="reset-password-section">
              <label class="section-title">
                <i class="fas fa-exclamation-triangle warning-icon"></i>
                Reset Password
              </label>

            <!-- מצב רגיל / הצלחה / אישור -->
            <div v-if="!showResetConfirmation">
              <!-- טופס שינוי סיסמה רגיל -->
              <div v-if="!showSuccessToast">
                <div class="input-group">
                  <input
                    v-model="resetPassword"
                    type="text"
                    placeholder="Enter new password or generate"
                    :class="{ 'invalid-field': passwordInvalidReset, 'valid-field': !passwordInvalidReset && resetPassword }"
                    @input="validateResetPassword"
                  />
                </div>

                <p v-if="passwordInvalidReset" class="error-message">
                  Password must be at least 6 characters with valid symbols
                </p>

                <div class="button-group center-buttons">
                  <button class="generate-btn" @click="generateResetPassword">
                    <i class="fas fa-random"></i> Generate New Password
                  </button>
                  <button class="save-btn" @click="showResetConfirmation = true">
                    <i class="fas fa-save"></i> Save New Password
                  </button>
                </div>
              </div>

              <!-- הודעת הצלחה במקום טופס -->
              <div v-else class="confirmation-success">
                ✅ Password was reset successfully!
              </div>
            </div>

            <!-- תצוגת אישור -->
            <div v-else class="confirmation-text">
              <p class="confirmation-text">
                ❗ Are you sure you want to reset the password?
              </p>
              <div class="center-buttons">
                <button class="confirm-btn" @click="confirmResetPassword(selectedUser._id)">Yes, Reset</button>
                <button class="cancel-btn" @click="showResetConfirmation = false">Cancel</button>
              </div>
            </div>




            </div>





          </div>


          </div>
        </div>

        <!-- No Users Found -->
        <div v-if="!isLoading && !filteredUsers.length" class="no-users">
          <i class="fas fa-user-slash"></i>
          <p>No matching users found.</p>
          <small>Try checking the username or clearing your search.</small>
        </div>

      </div>
    </div>
</template>

<script>
import {
  getUsers,
  addUser,
  toggleUserStatus,
  deleteUser,
  checkUsernameAvailability,
  checkLicenseAvailability, resetUserPassword, updateUser,
} from "@/data/authService.js";

export default {
  name: "AdminPanelPage",
  data() {
    return {
      users: [],
      selectedUser: null,
      searchQuery: "",
      isLoading: false,
      errorMessage: "",
      currentView: "list", // <- זה קובע מה מוצג
      showAddUserForm: false,
      titles: ["Mr.", "Mrs.", "Miss", "Ms.", "Dr.", "Prof.", "Rev.", "Rabbi", "Fr.", "Eng.", "Adv.", "Hon.", "Sir", "Dame", "None"],
      newUser: {
        username: "",
        fullName: "",
        email: "",
        phoneNumber: "",
        gender: "male",
        role: "user",
        password: "",
        profilePictureUrl: "", // ניתן להוסיף תמונה כברירת מחדל כאן
      },
      defaultAvatar:
          "https://static.vecteezy.com/system/resources/previews/034/466/010/non_2x/cartoon-blood-character-and-medical-doctor-stethoscope-for-health-care-hospital-pulse-heartbeat-design-vector.jpg",
      usernameAvailable: null, // true / false / null
      usernameMessage: "",
      email: "",
      phoneNumber: "",
      emailInvalid: false,
      phoneInvalid: false,
      password: "",
      passwordInvalid: false,
      passwordVisible: false,
      // משתנים לווידוא מספר רישיון
      licenseIdValid: null,   // האם מספר הרישיון זמין
      licenseIdInvalid: false, // האם מספר הרישיון כבר קיים
      lastCheckedLicenseId: "", // משתנה למניעת קריאות מיותרות
      licenseIdNotNumeric: false,
      fullNameInvalid: false,
      specialtyInvalid: false,
      editUser: null, // משתמש שנערך כעת
      editValidation: {
        fullName: false,
        email: false,
        phone: false,
        licenseId: false,
        specialty: false
      },
      editSubmitted: false,
      resetPassword: "",
      passwordInvalidReset: false,
      showResetConfirmation: false,
      showSuccessToast: false,

    };
  },
  computed: {
    filteredUsers() {
      const query = this.searchQuery.toLowerCase().trim();
      if (!query) return this.users;

      return this.users.filter((user) => {
        return (
          (user.username && user.username.toLowerCase().includes(query)) ||
          (user.fullName && user.fullName.toLowerCase().includes(query)) ||
          (user.licenseId && user.licenseId.toLowerCase().includes(query))
        );
      });
    },
    canSubmit() {
      const { fullName, username, password, specialty, title, licenseId } = this.newUser;

      return (
        fullName &&
        !this.fullNameInvalid &&

        username &&
        !this.usernameHasSpaces &&
        !this.usernameInvalid &&
        this.usernameAvailable === true &&

        password &&
        !this.passwordInvalid &&

        specialty &&
        !this.specialtyInvalid &&

        licenseId &&
        !this.licenseIdInvalid &&
        !this.licenseIdNotNumeric &&

        title && title !== ""
      );
    },
  },
  methods: {
    toggleDetails(user) {
      if (this.selectedUser?._id === user._id) {
        this.selectedUser = null;
        this.editUser = null;
        this.editSubmitted = false;
        this.editValidation = {
          fullName: false,
          email: false,
          phone: false,
          licenseId: false,
          specialty: false
        };
      } else {
        this.selectedUser = user;
      }
    },
    toggleAddUserForm() {
      this.currentView = this.currentView === "addUser" ? "list" : "addUser";
    },
    async handleAddUser() {
      // סיסמה: לפחות 6 תווים, רק אותיות באנגלית, מספרים ותווים מיוחדים
      const passwordRegex = /^[A-Za-z0-9!@#$%^&*()_+[\]{};':"\\|,.<>/?`~\-]{6,}$/;
      this.passwordInvalid = !passwordRegex.test(this.newUser.password);

      // בדיקת אימייל תקין
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      this.emailInvalid = !emailRegex.test(this.newUser.email);

      // בדיקת מספר טלפון ישראלי (מתחיל ב-05 ומכיל 10 ספרות)
      const phoneRegex = /^05\d{8}$/;
      this.phoneInvalid = this.newUser.phoneNumber && !phoneRegex.test(this.newUser.phoneNumber);

      // עצור אם יש שגיאות
      if (this.emailInvalid || this.phoneInvalid || this.passwordInvalid) {
        this.errorMessage = "Please correct the highlighted errors.";
        return;
      }

      const userToSend = {
        ...this.newUser,
        isAdmin: this.newUser.role === 'admin' // ⬅️ הוספה חשובה
      };

      try {
        const result = await addUser(userToSend);
        if (result.success) {
          this.fetchUsers();
          this.currentView = 'list';
          this.newUser = {
            username: "",
            fullName: "",
            email: "",
            phoneNumber: "",
            gender: "male",
            role: "user",
            password: "",
            profilePictureUrl: "",
            title: "",
            licenseId: "",
            specialty: ""
          };
          this.emailInvalid = false;
          this.phoneInvalid = false;
          this.usernameAvailable = null;
          this.errorMessage = "";
        } else {
          this.errorMessage = result.message || "Failed to add user.";
        }
      } catch {
        this.errorMessage = "Failed to add user. Please try again.";
      }
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
    async validateUsername() {
      if (!this.newUser.username) {
        this.usernameAvailable = null;
        this.usernameMessage = "";
        this.usernameHasSpaces = false;
        this.usernameInvalid = false;
        return;
      }

      // בדיקה אם יש רווחים
      if (/\s/.test(this.newUser.username)) {
        this.usernameHasSpaces = true;
        this.usernameAvailable = false;
        this.usernameMessage = "Username cannot contain spaces";
        return;
      } else {
        this.usernameHasSpaces = false;
      }

      // בדיקה אם שם המשתמש מכיל **רק** אותיות באנגלית ומספרים
      if (!/^[a-zA-Z0-9]+$/.test(this.newUser.username)) {
        this.usernameInvalid = true;
        this.usernameAvailable = false;
        this.usernameMessage = "Username can only contain English letters and numbers";
        return;
      } else {
        this.usernameInvalid = false;
      }

      // המרה לאותיות קטנות כדי למנוע בעיות רישיות
      const usernameLower = this.newUser.username.toLowerCase();

      // בדיקה האם שם המשתמש תפוס
      const { available, message } = await checkUsernameAvailability(usernameLower);
      this.usernameAvailable = available;
      this.usernameMessage = message;
    },
    isValidEmail(email) {
      const invalidCharRegex = /[^\x00-\x7F]/; // תווים לא לטיניים
      if (invalidCharRegex.test(email)) return false;

      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailPattern.test(email);
    },
    isValidIsraeliPhone(phone) {
      const phonePattern = /^05\d{8}$/;
      return phonePattern.test(phone);
    },
    generatePassword() {
      const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()";
      let password = "";
      for (let i = 0; i < 10; i++) {
        password += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      this.newUser.password = password;
      this.validatePassword();
    },
    validatePassword() {
      const value = this.newUser.password;
      if (!value) {
        this.passwordInvalid = false;
        return;
      }
      const passwordRegex = /^[A-Za-z0-9!@#$%^&*()_+[\]{};':"\\|,.<>/?`~\-]{6,}$/;
      this.passwordInvalid = !passwordRegex.test(value);
    },
    async validateLicenseId() {
      const license = this.newUser.licenseId.trim();

      // בדיקה אם ריק
      if (!license) {
        this.licenseIdValid = null;
        this.licenseIdInvalid = false;
        this.licenseIdNotNumeric = false;
        return;
      }

      // בדיקה אם כולל רק ספרות
      const onlyDigitsRegex = /^\d+$/;
      if (!onlyDigitsRegex.test(license)) {
        this.licenseIdValid = null;
        this.licenseIdInvalid = false;
        this.licenseIdNotNumeric = true; // מוסיף שגיאה
        return;
      } else {
        this.licenseIdNotNumeric = false;
      }

      // בדיקה אם כבר נבדק
      if (this.lastCheckedLicenseId === license) return;
      this.lastCheckedLicenseId = license;

      try {
        const response = await checkLicenseAvailability(license);
        this.licenseIdValid = response.available;
        this.licenseIdInvalid = !response.available;
      } catch (error) {
        console.error("Error checking license ID:", error);
        this.licenseIdValid = null;
        this.licenseIdInvalid = false;
      }
    },
    validateFullName() {
      const fullName = this.newUser.fullName.trim();

      // אם השדה ריק – אין שגיאה
      if (!fullName) {
        this.fullNameInvalid = false;
        return;
      }

      // בדיקה אם כולל רק אותיות באנגלית ורווחים
      const fullNameRegex = /^[A-Za-z\s]+$/;
      this.fullNameInvalid = !fullNameRegex.test(fullName);
    },
    validateSpecialty() {
      const specialtyRegex = /^[A-Za-z\s]+$/;
      this.specialtyInvalid = this.newUser.specialty && !specialtyRegex.test(this.newUser.specialty.trim());
    },
    togglePassword() {
      this.passwordVisible = !this.passwordVisible;
      console.log("passwordVisible:", this.passwordVisible);
    },
    startEditing(user) {
      // יצירת עותק כדי לא לערוך ישירות ברשימת המשתמשים
      this.editUser = JSON.parse(JSON.stringify(user));
      },
    async saveUserEdits() {
      this.editSubmitted = true;

      this.handleEditInput('fullName');
      this.handleEditInput('email');
      this.handleEditInput('phone');
      this.handleEditInput('specialty');

      // בדיקה מחודשת למס רישיון
      const licenseRes = await checkLicenseAvailability(this.editUser.licenseId, this.editUser._id);
      this.editValidation.licenseId = !licenseRes.available;

      const hasErrors = Object.values(this.editValidation).some(v => v);
      if (hasErrors) return;

      const userDataToSend = { ...this.editUser };
      delete userDataToSend.password;

      try {
        const result = await updateUser(this.editUser._id, userDataToSend);
        if (result.success) {
          this.editUser = null;
          this.editSubmitted = false;
          await this.fetchUsers();
        } else {
          this.errorMessage = result.message || "Failed to update user.";
        }
      } catch (err) {
        this.errorMessage = "Error updating user.";
        console.error(err);
      }
    },
    isValidEmailValue(value) {
      if (!value) return true;
      const invalidCharRegex = /[^\x00-\x7F]/;
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return !invalidCharRegex.test(value) && emailPattern.test(value);
    },
    generateResetPassword() {
      const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()";
      let password = "";
      for (let i = 0; i < 10; i++) {
        password += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      this.resetPassword = password;
      this.validateResetPassword();
    },
    validateResetPassword() {
      const passwordRegex = /^[A-Za-z0-9!@#$%^&*()_+[\]{};':"\\|,.<>/?`~\-]{6,}$/;
      this.passwordInvalidReset = !passwordRegex.test(this.resetPassword);
    },
    async resetUserPassword(userId) {
      this.validateResetPassword();
      if (this.passwordInvalidReset) {
        return;
      }

      try {
        const result = await resetUserPassword(userId, this.resetPassword);
        if (result.success) {
          this.resetPassword = "";
          this.passwordInvalidReset = false;
          this.errorMessage = "";
          alert("Password reset successfully!");
        } else {
          this.errorMessage = result.message || "Failed to reset password.";
        }
      } catch (err) {
        this.errorMessage = "Error while resetting password.";
        console.error(err);
      }
    },
    async handleEditInput(field) {
      if (!this.editUser) return;

      const value = (this.editUser[field] || "").trim();

      switch (field) {
        case 'fullName':
          this.editValidation.fullName = !/^[A-Za-z\s]+$/.test(value);
          break;
        case 'email':
          this.editValidation.email = !this.isValidEmailValue(value);
          break;
        case 'phone':
          this.editValidation.phone = !/^05\d{8}$/.test(this.editUser.phoneNumber.trim());
          break;
        case 'specialty':
          this.editValidation.specialty = !/^[A-Za-z\s]+$/.test(value);
          break;
        case 'licenseId':
          this.editValidation.licenseId = !/^\d+$/.test(value);
          if (!this.editValidation.licenseId && value) {
            const res = await checkLicenseAvailability(value, this.editUser._id);
            this.editValidation.licenseId = !res.available;
          }
          break;
      }
    },
    cancelEdit() {
      this.editUser = null;
      this.editSubmitted = false;
      this.editValidation = {
        fullName: false,
        email: false,
        phone: false,
        licenseId: false,
        specialty: false
      };
    },
    async confirmResetPassword(userId) {
      this.validateResetPassword();
      if (this.passwordInvalidReset) {
        this.showResetConfirmation = false;
        return;
      }

      try {
        const result = await resetUserPassword(userId, this.resetPassword);
        if (result.success) {
          this.resetPassword = "";
          this.passwordInvalidReset = false;
          this.errorMessage = "";
          this.showResetConfirmation = false;

          // ⬇️ מציגים הודעת הצלחה במקום הודעת אישור
          this.showSuccessToast = true;

          // ⬇️ אחרי 3 שניות מחזיר למסך הרגיל
          setTimeout(() => {
            this.showSuccessToast = false;
            this.showResetConfirmation = false;
            this.resetPassword = "";
            this.passwordInvalidReset = false;
          }, 3000);
        } else {
          this.errorMessage = result.message || "Failed to reset password.";
          this.showResetConfirmation = false;
        }
      } catch (err) {
        console.error(err);
        this.errorMessage = "Error while resetting password.";
        this.showResetConfirmation = false;
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


/* עיצוב המבנה הכללי */
.user-details-container {
  margin-top: 10px;
  border-top: 1px solid #e0e0e0;
  padding-top: 10px;
  height: auto;
  overflow-y: hidden;
}

/* מחלק את הכרטיס לשני צדדים */
.user-card-layout {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
  color: #000000;
}

/* אווטאר וכפתורים - צד ימין */
.user-avatar-section {
  display: flex;
  flex-direction: column;
  align-items: center; /* ממרכז את התמונה והכפתורים */
  gap: 15px;
}

/* עיצוב תמונת האווטאר */
.avatar-circle {
  width: 140px;
  height: 140px;
  border-radius: 50%;
  background-size: cover;
  background-position: center;
  border: 2px solid #4db6ac;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}








.add-user-form {
  background: #ffffff;
  padding: 25px;
  border-radius: 12px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  width: 600px;
  margin: 40px auto;
  text-align: center;
}

.back-button {
  background: none;
  border: none;
  color: #4caf50;
  font-size: 18px;
  cursor: pointer;
  text-align: left;
  display: flex;
  align-items: center;
}

.back-button i {
  margin-right: 8px;
}

.avatar-container {
  display: flex;
  justify-content: center;
  margin-bottom: 15px;
}

.avatar-img {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  border: 3px solid #4caf50;
}

.form-fields input,
.form-fields select {
  width: 98%;
  padding: 10px;
  margin-bottom: 10px;
  border: 1px solid #ddd;
  border-radius: 8px;
}

.save-button {
  width: 100%;
  background: linear-gradient(to right, #4caf50, #45a045);
  color: white;
  padding: 12px;
  border-radius: 8px;
  font-size: 16px;
  transition: all 0.3s ease;
}

.save-button:hover {
  transform: scale(0.97);
}

.save-button:disabled {
  background: #ccc;
  cursor: not-allowed;
  opacity: 0.6;
}





/* מסדר את שני הטוגלים באותה שורה */
.toggle-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 30px; /* רווח בין שני הטוגלים */
  margin-bottom: 15px;
}

/* כל טוגל יהיה מסודר בקבוצה */
.toggle-group {
  display: flex;
  align-items: center;
  gap: 10px; /* רווח בין הכפתורים */
}

/* עיצוב לכיתובים */
.toggle-label {
  font-weight: bold;
  font-size: 16px;
  color: #333;
}

/* עיצוב כללי לכפתור טוגל */
.toggle-button {
  padding: 8px 18px;
  border: 2px solid #ddd;
  background-color: #fff;
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 14px;
  font-weight: 500;
}

/* עיצוב בעת ריחוף */
.toggle-button:hover {
  background-color: #f5f5f5;
}

/* כפתור שנבחר */
.toggle-button.selected {
  background-color: #4caf50;
  color: white;
  border-color: #4caf50;
}


/* עיצוב הקבוצה של השדה */
.input-group {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  margin-bottom: 15px;
}

/* עטיפת שדה קלט */
.input-wrapper {
  position: relative;
  width: 100%;
  display: flex;
  align-items: center;
}

/* שדה הקלט */
.input-wrapper input {
  width: 100%;
  padding: 10px;
  padding-right: 35px; /* מקום לאייקון */
  border: 2px solid #ccc;
  border-radius: 8px;
  transition: border 0.3s ease-in-out, box-shadow 0.3s ease-in-out;
}

/* מצב של שם משתמש תפוס */
.input-wrapper.taken input {
  border-color: red;
  box-shadow: 0 0 5px rgba(255, 0, 0, 0.5);
}

/* מצב של שם משתמש פנוי */
.input-wrapper.available input {
  border-color: green;
  box-shadow: 0 0 5px rgba(0, 255, 0, 0.5);
}

/* אייקון מצב */
.status-icon {
  position: absolute;
  right: 10px;
  font-size: 18px;
}

/* אייקון ירוק */
.available .status-icon i {
  color: green;
}

/* אייקון אדום */
.taken .status-icon i {
  color: red;
}





.input-group {
  position: relative;
  display: flex;
  flex-direction: column;
}

.error-message, .success-message {
  font-size: 14px;
  margin-top: 5px;
  font-weight: bold;
}

.error-message {
  color: red;
}

.success-message {
  color: green;
}





.password-group {
  position: relative;
}

.input-wrapper {
  position: relative;
  width: 100%;
}

.toggle-password {
  position: absolute;
  right: 12px;
  top: 40%;
  transform: translateY(-50%);
  cursor: pointer;
  color: #888;
  font-size: 20px;
}

.generate-button {
  margin-top: 8px;
  background: #2196f3;
  color: white;
  padding: 8px 15px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  transition: background 0.3s ease;
}

.generate-button:hover {
  background: #1976d2;
}







.valid-field {
  border: 2px solid green;
  box-shadow: 0 0 5px rgba(0, 255, 0, 0.3);
}

.invalid-field {
  border: 2px solid red;
  box-shadow: 0 0 5px rgba(255, 0, 0, 0.3);
}

.error-message {
  color: red;
  font-size: 14px;
  font-weight: bold;
  margin-top: 5px;
}

.success-message {
  color: green;
  font-size: 14px;
  font-weight: bold;
  margin-top: 5px;
}

::v-deep(.user-card.admin) {
  background-color: #fffde7;
  border-left: 5px solid #fbc02d;
  box-shadow: 0 0 10px rgba(251, 192, 45, 0.3);
}

::v-deep(.user-card.admin .username) {
  color: #fbc02d; /* זהב */
}

::v-deep(.user-card.admin .user-role) {
  color: #fbc02d;
  font-weight: bold;
}


::v-deep(.user-card.admin .expand-button) {
  color: #fbc02d !important; /* תשפיע גם על האייקון */
}

::v-deep(.user-card.admin .expand-button i) {
  color: #fbc02d !important;
}






.no-users {
  text-align: center;
  margin-top: 60px;
  color: #757575;
  font-size: 18px;
  animation: fadeIn 0.5s ease-in-out;
}

.no-users i {
  font-size: 40px;
  color: #ccc;
  margin-bottom: 10px;
}

.no-users p {
  margin: 10px 0 5px;
  font-weight: bold;
  color: #333;
}

.no-users small {
  color: #888;
  font-size: 14px;
}

/* אנימציה נעימה */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}



.username-badge {
  background-color: #e0f7fa;
  color: #00796b;
  font-weight: bold;
  font-size: 15px;
  padding: 6px 12px;
  border-radius: 20px;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  box-shadow: 0 2px 5px rgba(0,0,0,0.1);
}








.edit-form {
  margin-top: 20px;
  background: #f9f9f9;
  padding: 15px;
  border-radius: 8px;
  border: 1px solid #ddd;
}

.edit-form .input-group input,
.edit-form .input-group select {
  width: 98%;
  padding: 8px;
  margin-bottom: 10px;
  border-radius: 6px;
  border: 1px solid #ccc;
}

.edit-form .actions {
  display: flex;
  gap: 10px;
}

.edit-form .save-button {
  background: #4caf50;
  color: white;
  padding: 8px 12px;
  border-radius: 6px;
  border: none;
  cursor: pointer;
}

.edit-form .cancel-button {
  background: #ccc;
  padding: 8px 12px;
  border-radius: 6px;
  border: none;
  cursor: pointer;
}


.edit-button {
  background-color: #2196f3; /* כחול */
  color: white;
  padding: 8px 15px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 6px;
  transition: background 0.3s ease;
}

.edit-button i {
  font-size: 16px;
}

.edit-button:hover {
  background-color: #1976d2;
}


.readonly-field {
  background-color: #f0f0f0; /* אפור בהיר */
  color: #000000; /* שחור */
  cursor: not-allowed;
  font-weight: bold;
}

.input-group label {
  display: block;
  font-weight: bold;
  margin-bottom: 4px;
  color: #000; /* צבע שחור */
}




.reset-password-section {
  margin-top: 30px;
  padding: 25px;
  border-radius: 12px;
  background-color: #fff0f0;
  border: 1px solid #f44336;
  box-shadow: 0 0 10px rgba(244, 67, 54, 0.2);
}

.section-title {
  font-weight: bold;
  font-size: 18px;
  color: #000;
  margin-bottom: 10px;
  display: flex;
  align-items: center;
}

.warning-icon {
  color: #f44336;
  margin-right: 6px;
}

.center-buttons {
  display: flex;
  justify-content: center;
  gap: 15px;
  margin-top: 15px;
}

.generate-btn {
  background-color: #2196f3;
  color: white;
  padding: 10px 18px;
  border: none;
  border-radius: 6px;
  font-weight: bold;
  cursor: pointer;
  transition: background 0.3s ease;
}

.generate-btn:hover {
  background-color: #1976d2;
}

.save-btn {
  background-color: #f44336;
  color: white;
  padding: 10px 18px;
  border: none;
  border-radius: 6px;
  font-weight: bold;
  cursor: pointer;
  transition: background 0.3s ease;
}

.save-btn:hover {
  background-color: #d32f2f;
}

.toast-success {
  background-color: #4caf50;
  color: white;
  padding: 10px 20px;
  margin-top: 20px;
  border-radius: 6px;
  text-align: center;
  font-weight: bold;
  animation: fadeInOut 3s ease-in-out forwards;
}

@keyframes fadeInOut {
  0% { opacity: 0; transform: translateY(10px); }
  10% { opacity: 1; transform: translateY(0); }
  90% { opacity: 1; }
  100% { opacity: 0; }
}



.confirmation-text {
  background-color: #fff8e1;
  border: 2px solid #ffb300;
  padding: 20px;
  border-radius: 12px;
  text-align: center;
  margin-top: 15px;
  animation: fadeIn 0.3s ease-in-out;
  box-shadow: 0 2px 8px rgba(255, 179, 0, 0.2);
  font-size: 16px;
  font-weight: 500;
  color: #333;
}

.confirmation-text p {
  margin-bottom: 15px;
  font-size: 18px;
  font-weight: bold;
  color: #d84315;
}

.confirm-btn {
  background-color: #f44336;
  color: white;
  padding: 10px 16px;
  border: none;
  border-radius: 6px;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.confirm-btn:hover {
  background-color: #d32f2f;
}

.cancel-btn {
  background-color: #ccc;
  color: #333;
  padding: 10px 16px;
  border: none;
  border-radius: 6px;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.cancel-btn:hover {
  background-color: #bbb;
}



.confirmation-success {
  background-color: #e8f5e9;
  border: 2px solid #4caf50;
  padding: 20px;
  border-radius: 12px;
  text-align: center;
  margin-top: 15px;
  color: #2e7d32;
  font-size: 18px;
  font-weight: bold;
  box-shadow: 0 2px 8px rgba(76, 175, 80, 0.2);
  animation: fadeInOut 3s ease-in-out forwards;
}

</style>