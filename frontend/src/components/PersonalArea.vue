<template>
  <div class="personal-area">
    <div class="profile-wrapper">
      <h2 class="main-title">
        My Profile
      </h2>

    <!-- Profile Section (default view) -->
    <div v-if="!showChangePassword">
      <div class="profile-card">

        <!-- Success Toast Message -->
        <div v-if="successMessage" class="toast">
          {{ successMessage }}
        </div>

        <!-- Edit Profile Button -->
        <button class="edit-button" @click="toggleEditMode">
          <i class="fas fa-edit"></i> {{ editMode ? "Cancel" : "Edit Profile" }}
        </button>

        <!-- Profile Header (avatar + name) -->
        <div class="profile-header">
          <!-- Profile Picture -->
          <div class="avatar-container" @click="editMode ? (showGallery = true) : null">
            <img :src="form.profilePictureUrl || defaultAvatar" alt="User Avatar" class="avatar" />
            <!-- Edit overlay with camera icon (visible only in edit mode) -->
            <div v-if="editMode" class="edit-avatar-overlay">
              <i class="fas fa-camera"></i>
            </div>
          </div>

        <!-- Avatar Selection Gallery -->
        <div v-if="showGallery" class="avatar-gallery-overlay" @click="showGallery = false">
          <div class="avatar-gallery" @click.stop>
            <h3 class="avatar-title">Choose an Avatar</h3>

            <!-- Gender Filter Tabs -->
            <div class="avatar-filter-tabs">
              <button @click="selectGender('all')" :class="{ active: selectedGenderFilter === 'all' }">All</button>
              <button @click="selectGender('male')" :class="{ active: selectedGenderFilter === 'male' }">Male</button>
              <button @click="selectGender('female')" :class="{ active: selectedGenderFilter === 'female' }">Female</button>
            </div>

            <!-- Grid of Avatars -->
            <div class="avatars">
              <img
                v-for="avatar in paginatedAvatars"
                :key="avatar.src"
                :src="avatar.src"
                :class="['avatar-option', { selected: avatar.src === form.profilePictureUrl }]"
                @click="selectAvatar(avatar.src)"
              />
            </div>

            <!-- Pagination Controls -->
            <div class="pagination-controls">
              <button class="nav-arrow" @click="changePage(-1)" :disabled="currentPage === 0">
                <i class="fas fa-chevron-left"></i>
              </button>
              <span class="page-indicator">Page {{ currentPage + 1 }} of {{ totalPages }}</span>
              <button class="nav-arrow" @click="changePage(1)" :disabled="currentPage === totalPages - 1">
                <i class="fas fa-chevron-right"></i>
              </button>
            </div>

            <!-- Close Gallery Button -->
            <button class="close-button" @click="showGallery = false">Close</button>
          </div>
        </div>

          <!-- User Name & Username -->
          <div class="user-info">
            <h2 class="name">{{ form.fullName }}</h2>
            <span class="username-badge">
              @{{ form.username }}
            </span>
          </div>
        </div>

        <!-- User Profile Fields -->
        <!-- Redesigned User Info Fields -->
        <div class="profile-info-grid">
          <!-- Full Name -->
          <div class="profile-field">
            <label><i class="fas fa-id-card"></i> Full Name</label>
            <span v-if="!editMode">{{ form.fullName }}</span>
            <input v-else v-model="form.fullName" type="text" />
          </div>

          <!-- Email -->
          <div class="profile-field">
            <label><i class="fas fa-envelope"></i> Email</label>
            <span v-if="!editMode">{{ form.email || 'N/A' }}</span>
            <input v-else v-model="form.email" type="email" />
          </div>

          <!-- Phone Number -->
          <div class="profile-field">
            <label><i class="fas fa-phone"></i> Phone</label>
            <span v-if="!editMode">{{ form.phoneNumber || 'N/A' }}</span>
            <input
              v-else
              v-model="form.phoneNumber"
              type="tel"
              inputmode="numeric"
              pattern="^05\\d{8}$"
              placeholder="05XXXXXXXX"
              class="phone-input"
              @input="validatePhoneNumber"
            />
          </div>

          <!-- Gender -->
          <div class="profile-field">
            <label><i class="fas fa-venus-mars"></i> Gender</label>
            <span v-if="!editMode">{{ form.gender }}</span>
            <select v-else v-model="form.gender">
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
          </div>

          <!-- Title (admin only) -->
          <div class="profile-field">
            <label><i class="fas fa-user-tie"></i> Title</label>
            <span v-if="!editMode">{{ formattedTitle }}</span>
            <select v-else v-model="form.title" :disabled="!isAdminUser" :class="!isAdminUser ? 'readonly-input' : ''">
              <option disabled value="">Select Title</option>
              <option v-for="option in titles" :key="option">{{ option }}</option>
            </select>
          </div>

          <!-- Specialty (admin only) -->
          <div class="profile-field">
            <label><i class="fas fa-stethoscope"></i> Specialty</label>
            <span v-if="!editMode">{{ form.specialty }}</span>
            <input
              v-else
              type="text"
              v-model="form.specialty"
              :readonly="!isAdminUser"
              :class="!isAdminUser ? 'readonly-input' : ''"
            />
          </div>

          <!-- License ID -->
          <div class="profile-field">
            <label><i class="fas fa-id-badge"></i> License ID</label>
            <span v-if="!editMode">{{ form.licenseId || 'N/A' }}</span>
            <div v-else class="input-with-message">
              <input
                type="text"
                v-model="form.licenseId"
                :readonly="!isAdminUser"
                @input="validateLicenseId"
                :class="[
                  isAdminUser
                    ? licenseIdError
                      ? 'invalid-field'
                      : licenseIdValid
                      ? 'valid-field'
                      : ''
                    : 'readonly-input'
                ]"
              />
              <p v-if="licenseIdError" class="error-message">{{ licenseIdError }}</p>
            </div>
          </div>
        </div>


        <!-- Save Profile Button (edit mode only) -->
        <button v-if="editMode" class="save-button" @click="updateProfile">
          <i class="fas fa-save"></i> Save Changes
        </button>

        <!-- Change Password Button (non-edit mode) -->
        <button v-if="!editMode" class="change-password-button" @click="showChangePassword = true">
          <i class="fas fa-key"></i> Change Password
        </button>
      </div>
    </div>

    <!-- Password Change Section -->
    <div v-if="showChangePassword" class="profile-card">
      <h2 class="name">Change Password</h2>

      <button class="back-button" @click="showChangePassword = false">
        <i class="fas fa-arrow-left"></i> Back
      </button>

      <div class="info-item">
        <i class="fas fa-lock icon"></i>
        <label>Current Password</label>
        <input type="password" v-model="passwordForm.currentPassword" />
      </div>

      <div class="info-item">
        <i class="fas fa-key icon"></i>
        <label>New Password</label>
        <input type="password" v-model="passwordForm.newPassword" />
      </div>

      <div class="info-item">
        <i class="fas fa-check icon"></i>
        <label>Confirm New Password</label>
        <input type="password" v-model="passwordForm.confirmPassword" />
      </div>

      <button class="save-button" @click="changePassword">Update Password</button>

      <p v-if="passwordMessage" class="password-message">{{ passwordMessage }}</p>
    </div>

    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from "vue";
import { updateUserProfile, getUserProfile, changeUserPassword } from "@/api/authService";
import { checkLicenseAvailability } from "@/api/authService";


export default {
  name: "PersonalArea",
  setup(props, { emit }) {
    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("token");
    const isAdminUser = ref(false);
    const titles = [ /* TODO: maybe to reduce the options? */
      "Mr.",
      "Mrs.",
      "Miss",
      "Ms.",
      "Dr.",
      "Prof.",
      "Rev.",
      "Rabbi",
      "Fr.",
      "Eng.",
      "Adv.",
      "Hon.",
      "Sir",
      "Dame",
      "None"
    ]; // Possible titles (editable for admin users only)
    const licenseIdValid = ref(null);  // Validation status of license ID
    const licenseIdError = ref("");    // Error message for license ID
    const lastCheckedLicenseId = ref(""); // Cache for last checked license ID to avoid redundant requests

    const form = ref({
      profilePictureUrl: "",
      username: "",
      fullName: "",
      email: "",
      phoneNumber: "",
      specialty: "",
      title: "",
      licenseId: "",
      gender: "",
    }); // Reactive form model for user profile

    const editMode = ref(false); // Tracks whether profile is in edit mode
    // Default avatar fallback image
    const defaultAvatar =
      "https://static.vecteezy.com/system/resources/previews/034/466/010/non_2x/cartoon-blood-character-and-medical-doctor-stethoscope-for-health-care-hospital-pulse-heartbeat-design-vector.jpg";

    const formattedTitle = computed(() => {
      const titleMap = {
            "Mr.": "Mister",
            "Mrs.": "Mistress",
            "Miss": "Miss",
            "Ms.": "Ms.",
            "Dr.": "Doctor",
            "Prof.": "Professor",
            "Rev.": "Reverend",
            "Rabbi": "Rabbi",
            "Fr.": "Father",
            "Eng.": "Engineer",
            "Adv.": "Advocate",
            "Hon.": "Honorable",
            "Sir": "Sir",
            "Dame": "Dame",
            "None": "N/A"
          };
      return titleMap[form.value.title] || "N/A";
    });

    /**
     * Loads the user's profile from API and populates form data.
     */
    const loadUserProfile = async () => {
      if (!userId || !token) return;
      try {
        const data = await getUserProfile(userId, token);
        form.value = { ...data };
        isAdminUser.value = data.isAdmin === true;
      } catch (error) {
        console.error("❌ Error fetching user profile:", error);
      }
    };

    const toggleEditMode = () => {
      editMode.value = !editMode.value;
    };

    /**
     * Updates the user's profile after validation.
     */
    const updateProfile = async () => {
      if (!userId || !token) return;

      // Reset error messages before validation
      phoneErrorMessage.value = "";
      emailErrorMessage.value = "";

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(form.value.email)) {
        emailErrorMessage.value = "Please enter a valid email address.";
        return;
      }

      // Validate phone number (Israeli format: 05XXXXXXXX)
      const phoneRegex = /^05\d{8}$/;
      if (form.value.phoneNumber && !phoneRegex.test(form.value.phoneNumber)) {
        phoneErrorMessage.value = "❌ Invalid phone number. Please enter a valid Israeli number in the format 05XXXXXXXX.";
        return;
      }


      try {
        const updatedUserData = {
          fullName: form.value.fullName,
          email: form.value.email,
          phoneNumber: form.value.phoneNumber || "",
          gender: form.value.gender,
          profilePictureUrl: form.value.profilePictureUrl,
        };

        // Include admin-specific fields if user has admin permissions
        if (isAdminUser.value) {
          updatedUserData.title = form.value.title;
          updatedUserData.specialty = form.value.specialty;
          updatedUserData.licenseId = form.value.licenseId;
        }

        const result = await updateUserProfile(userId, updatedUserData, token);

        if (result.user) {
          form.value = { ...result.user };
          editMode.value = false;

          // Show success message (auto-hide after 3 seconds)
          successMessage.value = "Profile updated successfully! 🎉";
          emit("profile-updated", result.user);

          setTimeout(() => {
            successMessage.value = "";
          }, 3000);
        }
      } catch (error) {
        console.error("❌ Error updating profile:", error);
      }
    };

    /**
     * Validates the license ID field.
     */
    const validateLicenseId = async () => {
      const license = form.value.licenseId.trim();


      if (!license) {
        licenseIdValid.value = null;
        licenseIdError.value = "";
        return;
      }

      const onlyDigitsRegex = /^\d+$/;
      if (!onlyDigitsRegex.test(license)) {
        licenseIdError.value = "License ID must contain digits only ❌";
        licenseIdValid.value = false;
        return;
      }


      if (lastCheckedLicenseId.value === license) return;
      lastCheckedLicenseId.value = license;

      try {
        const res = await checkLicenseAvailability(license, userId);
        licenseIdValid.value = res.available;
        licenseIdError.value = res.available
          ? ""
          : "This License ID already exists ❌";
      } catch (err) {
        licenseIdError.value = "Error checking license ID ❌";
        licenseIdValid.value = false;
      }
    };


    /**
     * Normalizes phone number input by removing non-digit characters.
     */
    const validatePhoneNumber = () => {
      form.value.phoneNumber = form.value.phoneNumber.replace(/\D/g, "");
    };

    const showGallery = ref(false); // Controls avatar gallery modal visibility

    // List of available avatars
    const avatarOptions = ref([
      { src: "/images/avatars/female1.webp", gender: "female" },
      { src: "/images/avatars/male1.jpg", gender: "male" },
      { src: "/images/avatars/female2.png", gender: "female" },
      { src: "/images/avatars/male2.png", gender: "male" },
      { src: "/images/avatars/female3.jpeg", gender: "female" },
      { src: "/images/avatars/male3.png", gender: "male" },
      { src: "/images/avatars/female4.png", gender: "female" },
      { src: "/images/avatars/male4.png", gender: "male" },
      { src: "/images/avatars/female5.png", gender: "female" },
      { src: "/images/avatars/male5.png", gender: "male" },
      { src: "/images/avatars/female6.jpg", gender: "female" },
      { src: "/images/avatars/male6.webp", gender: "male" },
      { src: "/images/avatars/female7.jpg", gender: "female" },
      { src: "/images/avatars/male7.png", gender: "male" },
      { src: "/images/avatars/female8.png", gender: "female" },
      { src: "/images/avatars/male8.png", gender: "male" },
      { src: "/images/avatars/female9.jpg", gender: "female" },
      { src: "/images/avatars/male9.jpeg", gender: "male" },
      { src: "/images/avatars/female10.png", gender: "female" },
      { src: "/images/avatars/male10.png", gender: "male" },
      { src: "/images/avatars/female11.jpeg", gender: "female" },
      { src: "/images/avatars/male11.webp", gender: "male" },
      { src: "/images/avatars/female12.webp", gender: "female" },
      { src: "/images/avatars/male12.png", gender: "male" },
      { src: "/images/avatars/female13.avif", gender: "female" },
      { src: "/images/avatars/male13.jpeg", gender: "male" },
      { src: "/images/avatars/female14.png", gender: "female" },
      { src: "/images/avatars/male14.jpg", gender: "male" },
      { src: "/images/avatars/female15.jpg", gender: "female" },
      { src: "/images/avatars/male15.webp", gender: "male" },
      { src: "/images/avatars/female16.avif", gender: "female" },
      { src: "/images/avatars/male16.webp", gender: "male" },
      { src: "/images/avatars/female17.webp", gender: "female" },
      { src: "/images/avatars/male17.webp", gender: "male" },
      { src: "/images/avatars/female18.webp", gender: "female" },
      { src: "/images/avatars/male18.jpg", gender: "male" },
      { src: "/images/avatars/female19.webp", gender: "female" },
      { src: "/images/avatars/male19.jpg", gender: "male" },
      { src: "/images/avatars/female20.webp", gender: "female" },
      { src: "/images/avatars/male20.avif", gender: "male" },
      { src: "/images/avatars/female21.avif", gender: "female" },
      { src: "/images/avatars/male21.avif", gender: "male" },
      { src: "/images/avatars/female22.avif", gender: "female" },
      { src: "/images/avatars/male22.avif", gender: "male" },
      { src: "/images/avatars/defaultAvatar.jpg", gender: ["male", "female"] },
      { src: "/images/avatars/unisex.jpg", gender: ["male", "female"] },
    ]);

    const selectedGenderFilter = ref("all");
    const currentPage = ref(0);
    const itemsPerPage = 12;


    const filteredAvatars = computed(() => {
      if (selectedGenderFilter.value === "all") return avatarOptions.value;

      return avatarOptions.value.filter((avatar) => {
        const gender = Array.isArray(avatar.gender)
          ? avatar.gender
          : [avatar.gender];

        return gender.includes(selectedGenderFilter.value);
      });
    });


    const totalPages = computed(() => Math.ceil(filteredAvatars.value.length / itemsPerPage));

    const paginatedAvatars = computed(() => {
      const start = currentPage.value * itemsPerPage;
      return filteredAvatars.value.slice(start, start + itemsPerPage);
    });

    const selectGender = (gender) => {
      selectedGenderFilter.value = gender;
      currentPage.value = 0;
    };

    const changePage = (direction) => {
      const next = currentPage.value + direction;
      if (next >= 0 && next < totalPages.value) {
        currentPage.value = next;
      }
    };


    const selectAvatar = (avatar) => {
      form.value.profilePictureUrl = avatar;
      showGallery.value = false;
    };

    const successMessage = ref(""); // Temporary success message
    const phoneErrorMessage = ref(""); // Phone validation error message
    const emailErrorMessage = ref(""); // Email validation error message


    const showChangePassword = ref(false); // Controls change password form visibility
    const passwordForm = ref({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
    const passwordMessage = ref(""); // Message for password change feedback

    /**
     * Validates and updates the user's password.
     */
    const changePassword = async () => {
      if (!userId || !token) return;

      if (!passwordForm.value.currentPassword || !passwordForm.value.newPassword || !passwordForm.value.confirmPassword) {
        passwordMessage.value = "⚠️ All fields are required.";
        return;
      }

      if (passwordForm.value.newPassword !== passwordForm.value.confirmPassword) {
        passwordMessage.value = "❌ Passwords do not match!";
        return;
      }

      if (passwordForm.value.newPassword.length < 6) {
        passwordMessage.value = "⚠️ Password must be at least 6 characters.";
        return;
      }

      try {
        const result = await changeUserPassword(
          userId,
          passwordForm.value.currentPassword,
          passwordForm.value.newPassword
        );

        if (result.success) {
          passwordMessage.value = "✅ Password changed successfully!";
          setTimeout(() => {
            passwordMessage.value = "";
            showChangePassword.value = false;
          }, 3000);
        } else {
          passwordMessage.value = "❌ " + (result.message || "Something went wrong.");
        }
      } catch (error) {
        passwordMessage.value = "❌ " + (error.message || "Server error");
      }
    };

    onMounted(async () => {
      await loadUserProfile(); // This will also handle the `isAdmin` property internally
    });

    return {
      form,
      editMode,
      defaultAvatar,
      formattedTitle,
      toggleEditMode,
      updateProfile,
      validatePhoneNumber,
      avatarOptions,
      selectAvatar,
      showGallery,
      successMessage,
      showChangePassword,
      passwordForm,
      passwordMessage,
      changePassword,
      selectedGenderFilter,
      currentPage,
      paginatedAvatars,
      totalPages,
      selectGender,
      changePage,
      phoneErrorMessage,
      emailErrorMessage,
      isAdminUser,
      titles,
      validateLicenseId,
      licenseIdValid,
      licenseIdError,
    };
  },
};
</script>

<style scoped>
/* General container for Personal Area screen */
.personal-area {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
}

/* Profile card styling */
.profile-card {
  background: white;
  padding: 30px;
  border-radius: 12px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  width: 500px;
  max-width: 100%;
  text-align: center;
  position: relative;
}

/* Edit button in profile card (top-right corner) */
.edit-button {
  position: absolute;
  top: 15px;
  right: 15px;
  background: #007bff;
  color: white;
  border: none;
  padding: 6px 12px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 14px;
}

.edit-button i {
  margin-right: 5px;
}

.edit-button:hover {
  background: #0056b3;
}

/* Header section: avatar + name */
.profile-header {
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 15px;
}

/* Avatar image styling */
.avatar {
  width: 90px;
  height: 90px;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid #007bff;
}

/* User info container (name + username) */
.user-info {
  text-align: left;
}

.name {
  font-size: 20px;
  font-weight: bold;
  color: black;
}

.username {
  color: black;
  font-size: 14px;
}

/* User profile details section */
.profile-info {
  text-align: left;
  margin-top: 15px;
}

/* Individual info field in the profile (row style) */
.info-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px;
  border-bottom: 1px solid #ddd;
}

/* Icon column in info item */
.info-item .icon {
  flex: 0 0 25px;
  text-align: center;
  font-size: 16px;
  color: black;
}

/* Label for profile fields */
.info-item label {
  font-weight: bold;
  color: black;
  flex: 1;
  margin-left: 10px;
}

/* Value fields: span, input, select inside info item */
.info-item span,
.info-item input,
.info-item select {
  flex: 2;
  padding: 6px;
  border: 1px solid #ccc;
  border-radius: 5px;
  text-align: right;
  color: black;
}

/* Save button styling */
.save-button {
  background: #28a745;
  color: white;
  padding: 10px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  width: 100%;
  margin-top: 15px;
}

.save-button:hover {
  background: #218838;
}

/* Read-only fields appearance in edit mode */
.readonly-input {
  background-color: #b6b6b6;
  border: 1px solid #ccc;
  padding: 6px;
  border-radius: 5px;
  color: #333;
  cursor: not-allowed;
}

/* Phone number input specific styling */
.phone-input {
  background-color: #fff;
  border: 1px solid #ccc;
  padding: 6px;
  border-radius: 5px;
  text-align: right;
}

/* Avatar container for hover edit effect */
.avatar-container {
  position: relative;
  display: inline-block;
  cursor: pointer;
}

/* Edit icon overlay on avatar (visible on hover) */
.edit-avatar-overlay {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: rgba(0, 0, 0, 0.6);
  color: white;
  padding: 10px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: opacity 0.3s ease-in-out;
  opacity: 0;
}

.avatar-container:hover .edit-avatar-overlay {
  opacity: 1;
}

.edit-avatar-overlay i {
  font-size: 18px;
}

/* Full-screen dark overlay for avatar gallery modal */
.avatar-gallery-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}

/* Main avatar gallery box */
.avatar-gallery {
  background: white;
  padding: 30px 40px;
  border-radius: 15px;
  max-width: 900px;
  width: 90%;
  color: black;
  text-align: center;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
  animation: fadeIn 0.3s ease;
  position: relative;
}

/* Grid layout for avatar selection */
.avatars {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 20px;
  justify-items: center;
  padding: 10px 0 20px;
}


/* Styling for each avatar image option */
.avatar-option {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid transparent;
  cursor: pointer;
  transition: 0.3s;
}

.avatar-option:hover {
  transform: scale(1.08);
}

.page-indicator {
  font-weight: bold;
  color: #333;
}

.avatar-option.selected {
  border-color: #007bff;
  box-shadow: 0 0 10px rgba(0, 123, 255, 0.5);
}

/* Pagination controls inside gallery */
.pagination-controls {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 20px;
  margin-top: 10px;
}

/* Close gallery button */
.close-button {
  margin-top: 20px;
  padding: 10px 20px;
  background: #dc3545;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: 0.2s;
}

.close-button:hover {
  background: #b52a36;
}

/* Toast notification message (success) */
.toast {
  position: fixed;
  top: 20px;
  right: 20px;
  background: #28a745;
  color: white;
  padding: 10px 20px;
  border-radius: 5px;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
  font-size: 16px;
  animation: fadeInOut 3s ease-in-out;
}

/* Fade in/out animation for toast */
@keyframes fadeInOut {
  0% { opacity: 0; transform: translateY(-10px); }
  10% { opacity: 1; transform: translateY(0); }
  90% { opacity: 1; }
  100% { opacity: 0; transform: translateY(-10px); }
}

/* Fade in animation for gallery */
@keyframes fadeIn {
  from { opacity: 0; transform: scale(0.95); }
  to { opacity: 1; transform: scale(1); }
}

/* Avatar gallery title */
.avatar-title {
  font-size: 24px;
  margin-bottom: 20px;
  color: #333;
}

/* Change password button styling */
.change-password-button {
  background: #ffc107;
  color: black;
  border: none;
  padding: 10px;
  border-radius: 5px;
  cursor: pointer;
  width: 100%;
  margin-top: 10px;
  font-size: 14px;
}

.change-password-button:hover {
  background: #e0a800;
}

/* Back button (in password change mode) */
.back-button {
  position: absolute;
  top: 15px;
  left: 15px;
  background: none;
  border: none;
  font-size: 22px;
  color: #333;
  cursor: pointer;
  transition: color 0.3s ease, transform 0.2s ease;
}

.back-button:hover {
  color: #007bff;
  transform: scale(1.1);
}

/* Message after password change attempt */
.password-message {
  margin-top: 10px;
  color: black;
  font-weight: bold;
}


/* Filter tabs for avatar gender selection */
.avatar-filter-tabs {
  display: flex;
  justify-content: center;
  gap: 12px;
  margin-bottom: 25px;
}

.avatar-filter-tabs button {
  padding: 8px 16px;
  border: 1px solid #ccc;
  background: #f9f9f9;
  border-radius: 20px;
  cursor: pointer;
  transition: 0.2s;
  font-weight: 500;
}

.avatar-filter-tabs .active {
  background: #007bff;
  color: white;
  border-color: #007bff;
}

/* Pagination arrow buttons in gallery */
.nav-arrow {
  font-size: 20px;
  background: none;
  border: none;
  cursor: pointer;
  color: #007bff;
  padding: 8px;
}

.nav-arrow:disabled {
  color: #ccc;
  cursor: not-allowed;
}

/* Profile wrapper layout */
.profile-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
}

/* Main page title (My Profile) */
.main-title {
  font-size: 30px;
  font-weight: bold;
  color: #01579b;
  text-align: center;
  margin-bottom: 30px;
}

.main-title i {
  margin-right: 10px;
  color: #007bff;
}

/* Error message styling (email, license ID, etc.) */
.error-message {
  background-color: #ffe6e6;
  color: #cc0000;
  font-size: 13px;
  padding: 8px 12px;
  border-radius: 6px;
  border: 1px solid #ffcccc;
  margin: 6px 0 10px;
  text-align: left;
}

/* Wrapper for input fields with error message below */
.input-with-message {
  display: flex;
  flex-direction: column;
  flex: 2;
}




.profile-info-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  margin-top: 20px;
}

.profile-field {
  display: flex;
  flex-direction: column;
  text-align: left;
}

.profile-field label {
  font-weight: 600;
  margin-bottom: 6px;
  display: flex;
  align-items: center;
  gap: 8px;
  color: #333;
}

.profile-field span {
  background: #f8f9fa;
  padding: 8px 12px;
  border-radius: 5px;
  color: #212529;
}

.profile-field input,
.profile-field select {
  padding: 8px 10px;
  border: 1px solid #ccc;
  border-radius: 6px;
  background: white;
  font-size: 14px;
}

.readonly-input {
  background: #e9ecef;
  cursor: not-allowed;
}

.valid-field {
  border-color: #28a745;
}

.invalid-field {
  border-color: #dc3545;
}

.input-with-message {
  display: flex;
  flex-direction: column;
}


.username-badge {
  display: inline-flex;
  align-items: center;
  background: #f1f3f5;
  color: #007bff;
  font-weight: 600;
  font-size: 14px;
  padding: 6px 12px;
  border-radius: 20px;
  margin-top: 6px;
  gap: 6px;
  box-shadow: 0 2px 6px rgba(0,0,0,0.05);
  transition: all 0.3s ease;
}

.username-badge i {
  font-size: 13px;
}

.username-badge:hover {
  background: #e9ecef;
}

</style>