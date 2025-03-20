<template>
  <div class="personal-area">
    <div class="profile-card">
      <!-- כפתור עריכה בצד ימין למעלה -->
      <button class="edit-button" @click="toggleEditMode">
        <i class="fas fa-edit"></i> {{ editMode ? "Cancel" : "Edit Profile" }}
      </button>

      <div class="profile-header">
        <!-- תמונת פרופיל -->
        <div class="avatar-container">
          <img :src="defaultAvatar || form.profilePictureUrl" alt="User Avatar" class="avatar" />
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
          <span v-if="!editMode">{{ formattedTitle }}</span>
          <input v-else type="text" v-model="form.title" readonly class="readonly-input" />
        </div>

        <div class="info-item readonly">
          <i class="fas fa-stethoscope icon"></i>
          <label>Specialty</label>
          <span v-if="!editMode">{{ form.specialty }}</span>
          <input v-else type="text" v-model="form.specialty" readonly class="readonly-input" />
        </div>

        <div class="info-item readonly">
          <i class="fas fa-id-badge icon"></i>
          <label>License ID</label>
          <span v-if="!editMode">{{ form.licenseId || "N/A" }}</span>
          <input v-else type="text" v-model="form.licenseId" readonly class="readonly-input" />
        </div>

        <div class="info-item">
          <i class="fas fa-envelope icon"></i>
          <label>Email</label>
          <span v-if="!editMode">{{ form.email }}</span>
          <input v-else v-model="form.email" type="email" />
        </div>

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
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from "vue";
import { updateUserProfile, getUserProfile } from "@/data/authService";

export default {
  name: "PersonalArea",
  setup() {
    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("token");

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
      "https://thumbs.dreamstime.com/b/cheerful-young-doctor-avatar-bright-background-stethoscope-generative-ai-friendly-young-doctor-avatar-big-343828185.jpg";

    const formattedTitle = computed(() => {
      const titleMap = { "Dr.": "Doctor", "Prof.": "Professor", "None": "N/A" };
      return titleMap[form.value.title] || "N/A";
    });

    const loadUserProfile = async () => {
      if (!userId || !token) return;
      try {
        const data = await getUserProfile(userId, token);
        form.value = { ...data };
      } catch (error) {
        console.error("❌ Error fetching user profile:", error);
      }
    };

    const toggleEditMode = () => {
      editMode.value = !editMode.value;
    };

    const updateProfile = async () => {
      if (!userId || !token) return;

      // Validate phone number (Israeli format: 05XXXXXXXX)
      const phoneRegex = /^05\d{8}$/;
      if (!phoneRegex.test(form.value.phoneNumber)) {
        alert("❌ Invalid phone number. Please enter a valid Israeli number in the format 05XXXXXXXX.");
        return;
      }

      try {
        // Create a copy of the form data for updating
        const updatedUser = { ...form.value };

        // Send the updated profile data to the server
        const result = await updateUserProfile(userId, updatedUser, token);

        // If the update is successful, exit edit mode
        if (result.success) {
          editMode.value = false;
        }
      } catch (error) {
        console.error("❌ Error updating profile:", error);
      }
    };


    const validatePhoneNumber = () => {
      form.value.phoneNumber = form.value.phoneNumber.replace(/\D/g, ""); // מסיר תווים לא מספריים
    };


    onMounted(loadUserProfile);

    return {
      form,
      editMode,
      defaultAvatar,
      formattedTitle,
      toggleEditMode,
      updateProfile,
      validatePhoneNumber,
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

</style>
