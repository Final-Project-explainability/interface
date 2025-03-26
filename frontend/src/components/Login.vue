<template>
  <div class="login-section">
<!--    <h1 class="login-title">ICU MediClear</h1>-->
    <div class="logo-image-container"></div>
    <div class="login-background">
      <form @submit.prevent="handleSubmit" class="login-form">
        <div class="form-group">
          <label>Username</label>
          <input
            type="text"
            v-model="username"
            placeholder="Enter your username"
          />
        </div>
        <div class="form-group">
          <label>Password</label>
          <input
            type="password"
            v-model="password"
            placeholder="Enter your password"
          />
        </div>
        <div class="forgot-password">
          <a href="#">Forgot password? Click here</a>
        </div>
        <button type="submit" class="login-button">Login</button>
      </form>
      <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
    </div>
<!--    <div class="register-section">-->
<!--      <span>Don't have an account yet?</span>-->
<!--      <a href="#" class="register-link">Register</a>-->
<!--    </div>-->
  </div>
</template>

<script>
import { ref } from "vue";
import { login } from "@/data/authService"; // שירות שמנהל את בדיקת ההתחברות

export default {
  name: "Login",
  emits: ["login"], // מאפשר שליחת אירוע התחברות ל-parent
  setup(_, { emit }) {
    const username = ref("");
    const password = ref("");
    const errorMessage = ref(""); // הודעת שגיאה במקרה של כשל


  const handleSubmit = async () => {
    if (username.value.trim() && password.value) {
      const cleanedUsername = username.value.trim().toLowerCase();

      console.log("📢 Attempting login with:", cleanedUsername, password.value); // בדיקה

      const result = await login(cleanedUsername, password.value); // קריאה ל-API
      console.log("✅ Login response:", result); // בדיקה

      if (result.success) {
        console.log("📢 Saving user data:", result.user);

        localStorage.setItem("token", result.token); // ✅ שמירת הטוקן
        localStorage.setItem("userId", result.user._id); // ✅ שמירת ה-ID

        emit("login", result.user); // שולח את פרטי המשתמש ל-parent
      } else {
        errorMessage.value = result.message; // מציג הודעת שגיאה
      }
    } else {
      errorMessage.value = "Please fill in both fields.";
    }
  };


    return {
      username,
      password,
      errorMessage,
      handleSubmit,
    };
  },
};
</script>

