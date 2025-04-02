<template>
  <div class="personal-area">
    <div class="profile-wrapper">
      <h2 class="main-title">
        My Profile
      </h2>

    <div v-if="!showChangePassword">
      <!-- תוכן הפרופיל הרגיל -->
      <div class="profile-card">
        <!-- הודעת הצלחה -->
        <div v-if="successMessage" class="toast">
          {{ successMessage }}
        </div>

        <!-- כפתור עריכה בצד ימין למעלה -->
        <button class="edit-button" @click="toggleEditMode">
          <i class="fas fa-edit"></i> {{ editMode ? "Cancel" : "Edit Profile" }}
        </button>

        <div class="profile-header">
          <!-- תמונת פרופיל -->
          <div class="avatar-container" @click="editMode ? (showGallery = true) : null">
            <img :src="form.profilePictureUrl || defaultAvatar" alt="User Avatar" class="avatar" />
            <!-- שכבת עריכה עם אייקון מצלמה (שיופיע רק בעריכה) -->
            <div v-if="editMode" class="edit-avatar-overlay">
              <i class="fas fa-camera"></i>
            </div>
          </div>

        <!-- גלריית בחירת אווטאר -->
        <div v-if="showGallery" class="avatar-gallery-overlay" @click="showGallery = false">
          <div class="avatar-gallery" @click.stop>
            <h3 class="avatar-title">Choose an Avatar</h3>

            <!-- Tabs -->
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

            <button class="close-button" @click="showGallery = false">Close</button>
          </div>
        </div>


          <!-- שם המשתמש -->
          <div class="user-info">
            <h2 class="name">{{ form.fullName }}</h2>
            <p class="username">@{{ form.username }}</p>
          </div>
        </div>

        <!-- פרטי משתמש -->
        <div class="profile-info">
          <div class="info-item">
            <i class="fas fa-id-card icon"></i>
            <label>Full Name</label>
            <span v-if="!editMode">{{ form.fullName }}</span>
            <input v-else v-model="form.fullName" type="text" />
          </div>

          <div class="info-item readonly">
            <i class="fas fa-user-tie icon"></i>
            <label>Title</label>
            <template v-if="!editMode">
              <span>{{ formattedTitle }}</span>
            </template>
            <template v-else>
              <select
                v-model="form.title"
                :disabled="!isAdminUser"
                :class="isAdminUser ? '' : 'readonly-input'"
              >
                <option disabled value="">Select Title</option>
                <option v-for="option in titles" :key="option">{{ option }}</option>
              </select>
            </template>
          </div>

          <div class="info-item readonly">
            <i class="fas fa-stethoscope icon"></i>
            <label>Specialty</label>
            <template v-if="!editMode">
              <span>{{ form.specialty }}</span>
            </template>
            <template v-else>
              <input
                type="text"
                v-model="form.specialty"
                :readonly="!isAdminUser"
                :class="isAdminUser ? '' : 'readonly-input'"
              />
            </template>
          </div>

          <div class="info-item readonly">
            <i class="fas fa-id-badge icon"></i>
            <label>License ID</label>
            <template v-if="!editMode">
              <span>{{ form.licenseId || "N/A" }}</span>
            </template>
            <template v-else>
              <div class="input-with-message">
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
            </template>
          </div>

          <div class="info-item">
            <i class="fas fa-envelope icon"></i>
            <label>Email</label>
            <span v-if="!editMode">{{ form.email || "N/A" }}</span>
            <input v-else v-model="form.email" type="email" />
          </div>

          <p v-if="emailErrorMessage" class="error-message">{{ emailErrorMessage }}</p>


          <div class="info-item">
            <i class="fas fa-phone icon"></i>
            <label>Phone Number</label>
            <span v-if="!editMode">{{ form.phoneNumber || "N/A" }}</span>
            <input
              v-else
              v-model="form.phoneNumber"
              type="tel"
              inputmode="numeric"
              pattern="^05\d{8}$"
              placeholder="05XXXXXXXX"
              class="phone-input"
              @input="validatePhoneNumber"
            />
          </div>

          <p v-if="phoneErrorMessage" class="error-message">{{ phoneErrorMessage }}</p>


          <div class="info-item">
            <i class="fas fa-venus-mars icon"></i>
            <label>Gender</label>
            <span v-if="!editMode">{{ form.gender }}</span>
            <select v-else v-model="form.gender">
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
          </div>
        </div>

        <!-- כפתור שמירה (רק במצב עריכה) -->
        <button v-if="editMode" class="save-button" @click="updateProfile">
          <i class="fas fa-save"></i> Save Changes
        </button>

        <!-- כפתור החלפת סיסמה (רק אם לא במצב עריכה) -->
        <button v-if="!editMode" class="change-password-button" @click="showChangePassword = true">
          <i class="fas fa-key"></i> Change Password
        </button>
      </div>
    </div>

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
import { updateUserProfile, getUserProfile, changeUserPassword } from "@/data/authService";
import { checkLicenseAvailability } from "@/data/authService";


export default {
  name: "PersonalArea",
  setup(props, { emit }) {
    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("token");
    const isAdminUser = ref(false);
    const titles = [
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
    ];
    const licenseIdValid = ref(null);
    const licenseIdError = ref("");
    const lastCheckedLicenseId = ref("");




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
    });

    const editMode = ref(false);
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

    const updateProfile = async () => {
      if (!userId || !token) return;

      // איפוס הודעות קודמות
      phoneErrorMessage.value = "";
      emailErrorMessage.value = "";

      // אימות אימייל
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

        // 🔓 אם המשתמש הוא אדמין – נוסיף גם שדות נוספים
        if (isAdminUser.value) {
          updatedUserData.title = form.value.title;
          updatedUserData.specialty = form.value.specialty;
          updatedUserData.licenseId = form.value.licenseId;
        }

        const result = await updateUserProfile(userId, updatedUserData, token);

        if (result.user) {
          form.value = { ...result.user };
          editMode.value = false;

          // ✅ הצגת הודעת הצלחה
          successMessage.value = "Profile updated successfully! 🎉";

          // 🔥 שולח את המשתמש החדש החוצה
          emit("profile-updated", result.user);



          // הסרת ההודעה לאחר 3 שניות
          setTimeout(() => {
            successMessage.value = "";
          }, 3000);
        }
      } catch (error) {
        console.error("❌ Error updating profile:", error);
      }
    };

    const validateLicenseId = async () => {
      const license = form.value.licenseId.trim();

      // ריק = אין שגיאה
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

      // בדיקה אם כבר נבדק
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


    const validatePhoneNumber = () => {
      form.value.phoneNumber = form.value.phoneNumber.replace(/\D/g, ""); // מסיר תווים לא מספריים
    };

    const showGallery = ref(false);

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
      { src: "https://static.vecteezy.com/system/resources/previews/027/312/349/non_2x/portrait-of-a-surgeon-isolated-essential-workers-avatar-icons-characters-for-social-media-and-networking-user-profile-website-and-app-3d-render-illustration-png.png", gender: "male" },
      { src: "/images/avatars/female6.jpg", gender: "female" },
      { src: "/images/avatars/male6.webp", gender: "male" },
      { src: "/images/avatars/female7.jpg", gender: "female" },
      { src: "https://png.pngtree.com/png-clipart/20240321/original/pngtree-avatar-job-doctor-flat-portrait-of-man-png-image_14640094.png", gender: "male" },
      { src: "/images/avatars/female8.png", gender: "female" },
      { src: "/images/avatars/male8.png", gender: "male" },
      { src: "https://static.vecteezy.com/system/resources/previews/034/466/010/non_2x/cartoon-blood-character-and-medical-doctor-stethoscope-for-health-care-hospital-pulse-heartbeat-design-vector.jpg", gender: ["male", "female"] },
      { src: "/images/avatars/female9.jpg", gender: "female" },
      { src: "/images/avatars/male9.jpeg", gender: "male" },
      // { src: "/images/avatars/female10.jpg", gender: "female" },
      { src: "/images/avatars/male10.png", gender: "male" },
      // { src: "/images/avatars/female11.jpg", gender: "female" },
      { src: "/images/avatars/male11.webp", gender: "male" },
      { src: "/images/avatars/female12.webp", gender: "female" },
      // { src: "/images/avatars/male12.png", gender: "male" },
      // { src: "/images/avatars/female13.jpg", gender: "female" },
      // { src: "/images/avatars/male13.png", gender: "male" },
      // { src: "/images/avatars/female14.jpg", gender: "female" },
      { src: "/images/avatars/male14.jpg", gender: "male" },
      // { src: "/images/avatars/female15.jpg", gender: "female" },
      { src: "/images/avatars/male15.webp", gender: "male" },
      // { src: "/images/avatars/female16.jpg", gender: "female" },
      { src: "/images/avatars/male16.webp", gender: "male" },
      { src: "/images/avatars/female17.webp", gender: "female" },
      { src: "/images/avatars/male17.webp", gender: "male" },
      { src: "/images/avatars/female18.webp", gender: "female" },
      // { src: "/images/avatars/male18.png", gender: "male" },
      { src: "/images/avatars/female19.webp", gender: "female" },
      // { src: "/images/avatars/male19.png", gender: "male" },
      { src: "/images/avatars/female20.webp", gender: "female" },
      // { src: "/images/avatars/male20.png", gender: "male" },
      // { src: "/images/avatars/female21.jpg", gender: "female" },
      // { src: "/images/avatars/male21.png", gender: "male" },

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

    const successMessage = ref(""); // משתנה להודעת הצלחה

    const phoneErrorMessage = ref("");
    const emailErrorMessage = ref("");


    const showChangePassword = ref(false); // מציג/מסתיר את טופס שינוי הסיסמה
    const passwordForm = ref({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
    const passwordMessage = ref(""); // הודעת הצלחה או שגיאה


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
      await loadUserProfile(); // זה יטפל גם ב־isAdmin בפנים
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
/* סגנון כללי */
.personal-area {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
}

/* כרטיס פרופיל */
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

/* כפתור עריכה */
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

/* אזור הכותרת */
.profile-header {
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 15px;
}

/* תמונת פרופיל */
.avatar {
  width: 90px;
  height: 90px;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid #007bff;
}

/* שם וכינוי */
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

/* פרטי משתמש */
.profile-info {
  text-align: left;
  margin-top: 15px;
}

/* פריטים בטופס */
.info-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px;
  border-bottom: 1px solid #ddd;
}

.info-item .icon {
  flex: 0 0 25px;
  text-align: center;
  font-size: 16px;
  color: black;
}

.info-item label {
  font-weight: bold;
  color: black;
  flex: 1;
  margin-left: 10px;
}

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

/* כפתור שמירה */
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

/* תיבות טקסט לקריאה בלבד במצב עריכה */
.readonly-input {
  background-color: #b6b6b6; /* רקע אפור */
  border: 1px solid #ccc;
  padding: 6px;
  border-radius: 5px;
  color: #333;
  cursor: not-allowed; /* מסמן למשתמש שהתיבה לא ניתנת לעריכה */
}

.phone-input {
  background-color: #fff;
  border: 1px solid #ccc;
  padding: 6px;
  border-radius: 5px;
  text-align: right;
}

/* שכבת עריכה עם אייקון מצלמה מעל האווטאר */
.avatar-container {
  position: relative;
  display: inline-block;
  cursor: pointer;
}

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

/* שכבת רקע לגלריה */
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

/* עיצוב גלריית האווטארים */
.avatars {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 20px;
  justify-items: center;
  padding: 10px 0 20px;
}


/* עיצוב כל תמונה בגלריה */
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

.pagination-controls {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 20px;
  margin-top: 10px;
}

/* כפתור סגירת הגלריה */
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
/* הודעת הצלחה (Toast Notification) */
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

/* אנימציה להופעה והיעלמות */
@keyframes fadeInOut {
  0% { opacity: 0; transform: translateY(-10px); }
  10% { opacity: 1; transform: translateY(0); }
  90% { opacity: 1; }
  100% { opacity: 0; transform: translateY(-10px); }
}


@keyframes fadeIn {
  from { opacity: 0; transform: scale(0.95); }
  to { opacity: 1; transform: scale(1); }
}

.avatar-title {
  font-size: 24px;
  margin-bottom: 20px;
  color: #333;
}

/* כפתור החלפת סיסמה */
.change-password-button {
  background: #ffc107;
  color: black;
  border: none;
  padding: 10px;
  border-radius: 5px;
  cursor: pointer;
  width: 100%; /* כפתור רחב כמו "Save Changes" */
  margin-top: 10px;
  font-size: 14px;
}

.change-password-button:hover {
  background: #e0a800;
}


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
  color: #007bff; /* כחול עדין כמו שאר העיצוב */
  transform: scale(1.1);
}


.password-message {
  margin-top: 10px;
  color: black; /* ← כאן אנחנו קובעים את הצבע השחור */
  font-weight: bold;
}







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


.profile-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
}


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

.input-with-message {
  display: flex;
  flex-direction: column;
  flex: 2;
}

</style>
