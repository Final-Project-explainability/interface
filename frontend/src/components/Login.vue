<template>
  <div class="login-section">
    <!-- Logo Image (currently empty container, placeholder for styling) -->
    <div class="logo-image-container"></div>
    <!-- Login form background card -->
    <div class="login-background">
      <div class="form-wrapper">
        <transition name="slide-fade" mode="out-in">
          <!-- Login Form -->
          <form
            v-if="currentView === 'login'"
            key="login"
            @submit.prevent="handleSubmit"
            class="login-form"
          >
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
              <a href="#" @click.prevent="currentView = 'forgot'">Forgot password? Click here</a>
            </div>
            <button type="submit" class="login-button">Login</button>
          </form>

          <!-- Forgot Password Form -->
          <form
            v-else
            key="forgot"
            @submit.prevent="handleForgotPassword"
            class="login-form"
          >
            <button class="back-button" @click.prevent="switchToLogin">← Back</button>
            <h2 class="forgot-title">Password Recovery</h2>
            <div class="form-group">
              <label>Username</label>
              <input
                type="text"
                v-model="forgotUsername"
                placeholder="Enter your username"
              />
            </div>
            <div class="form-group">
              <label>Email</label>
              <input
                type="email"
                v-model="forgotEmail"
                placeholder="Enter your email"
              />
            </div>
            <button type="submit" class="login-button">Recover Password</button>
          </form>
        </transition>
      </div>

      <!-- Messages -->
      <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
      <p v-if="infoMessage" class="info-message">{{ infoMessage }}</p>
    </div>
  </div>
</template>

<script>
import { ref } from "vue";
import { login, recoverPassword } from "@/api/authService";

export default {
  name: "LoginTransition",
  emits: ["login"],
  setup(_, { emit }) {
    const username = ref("");
    const password = ref("");
    const forgotUsername = ref("");
    const forgotEmail = ref("");
    const currentView = ref("login");

    const errorMessage = ref("");
    const infoMessage = ref("");

    // Handle login form submission
    const handleSubmit = async () => {
      errorMessage.value = "";
      infoMessage.value = "";

      if (!username.value.trim() || !password.value) {
        errorMessage.value = "Please fill in both fields.";
        return;
      }

      const result = await login(username.value.trim(), password.value);

      if (result.success) {
        localStorage.setItem("token", result.token);
        localStorage.setItem("userId", result.user._id);
        emit("login", result.user); // Notify parent about successful login
      } else {
        errorMessage.value = result.message;
      }
    };

    const handleForgotPassword = async () => {
      errorMessage.value = "";
      infoMessage.value = "";

      const username = forgotUsername.value.trim();
      const email = forgotEmail.value.trim();

      if (!username || !email) {
        errorMessage.value = "Please provide both username and email.";
        return;
      }

      const result = await recoverPassword(username, email);

      if (result.success) {
        infoMessage.value = "A new password has been sent to your email.";
      } else if (result.reason === "no-email") {
        errorMessage.value = "This account has no associated email. Please contact the system administrator at: MediClearICU@gmail.com";
      } else {
        errorMessage.value = result.message || "Password recovery failed.";
      }
    };

    // Switch back to login view
    const switchToLogin = () => {
      errorMessage.value = "";
      infoMessage.value = "";
      currentView.value = 'login';
    };


    return {
      username,
      password,
      forgotUsername,
      forgotEmail,
      currentView,
      errorMessage,
      infoMessage,
      handleSubmit,
      handleForgotPassword,
      switchToLogin,
    };
  },
};
</script>

<style scoped>
/* Container */
.login-section {
  text-align: center;
  width: 100%;
  max-width: 400px;
  position: relative;
}

/* Card-style background */
.login-background {
  background: rgba(34, 40, 49, 0.85);
  padding: 30px;
  border-radius: 16px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
  border: 1px solid #3a3f47;
}

/* Form wrapper */
.form-wrapper {
  width: 100%;
}

/* Slide & fade transition */
.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: all 0.3s ease;
}

.slide-fade-enter-from {
  opacity: 0;
  transform: translateX(50px);
}

.slide-fade-leave-to {
  opacity: 0;
  transform: translateX(-50px);
}

/* Form styling */
.login-form .form-group {
  margin-bottom: 30px;
  text-align: left;
}

.login-form label {
  font-size: 18px;
  color: #d6d6d6;
  font-weight: 600;
  margin-bottom: 8px;
  display: block;
}

.login-form input {
  width: 93%;
  padding: 12px;
  font-size: 14px;
  border: 1px solid #555b65;
  border-radius: 8px;
  background: #3b3f45;
  color: #eaeaea;
  outline: none;
  transition: border-color 0.3s ease, box-shadow 0.3s ease;
}

.login-form input:focus {
  border-color: #00e676;
  box-shadow: 0 0 8px rgba(0, 230, 118, 0.4);
}

/* Links */
.forgot-password {
  text-align: center;
  margin-bottom: 40px;
}

.forgot-password a {
  color: #00e676;
  text-decoration: none;
  font-size: 14px;
}

.forgot-password a:hover {
  text-decoration: underline;
}

/* Button */
.login-button {
  width: 100%;
  background: linear-gradient(to right, #00c853, #00e676);
  color: #ffffff;
  border: none;
  border-radius: 8px;
  padding: 14px;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  transition: background 0.3s ease, transform 0.2s ease, box-shadow 0.3s ease;
}

.login-button:hover {
  transform: scale(1.05);
  box-shadow: 0 10px 20px rgba(0, 230, 118, 0.4);
}

.login-button:active {
  transform: scale(1);
}

/* Forgot screen elements */
.back-button {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  margin-bottom: 20px;
  background: none;
  border: none;
  color: #00e676;
  font-size: 18px;
  cursor: pointer;
  width: 100%;
  text-align: left;
  padding-left: 0;
}


.forgot-title {
  color: #d6d6d6;
  font-size: 22px;
  margin-bottom: 20px;
}

/* Messages */
.info-message {
  color: #00e676;
  margin-top: 15px;
  font-size: 14px;
}

.error-message {
  color: #ff5252;
  margin-top: 15px;
  font-size: 14px;
}
</style>
