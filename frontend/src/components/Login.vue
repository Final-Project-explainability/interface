<template>
  <div class="login-section">
    <h1 class="login-title">ICU MediClear</h1>
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
      if (username.value && password.value) {
        const result = await login(username.value, password.value); // בדיקת התחברות
        if (result.success) {
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


<!--<style scoped>-->
<!--/* General Styling */-->
<!--.login-section {-->
<!--  text-align: center;-->
<!--  width: 100%;-->
<!--  max-width: 400px;-->
<!--  margin: 0 auto;-->
<!--  font-family: Arial, sans-serif;-->
<!--}-->

<!--.login-title {-->
<!--  font-size: 28px;-->
<!--  color: #00e676;-->
<!--  margin: 0;-->
<!--  letter-spacing: 1.5px;-->
<!--  font-weight: bold;-->
<!--  padding: 10px 20px;-->
<!--  border-radius: 12px;-->
<!--  display: inline-block;-->
<!--}-->

<!--.logo-image-container {-->
<!--  width: 150px;-->
<!--  height: 150px;-->
<!--  margin: 20px auto 0;-->
<!--  background-size: contain;-->
<!--  background-repeat: no-repeat;-->
<!--  background-position: center;-->
<!--  border-radius: 10px;-->
<!--}-->

<!--.login-background {-->
<!--  background: rgba(34, 40, 49, 0.85);-->
<!--  padding: 30px;-->
<!--  border-radius: 16px;-->
<!--  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);-->
<!--  border: 1px solid #3a3f47;-->
<!--}-->

<!--.login-form .form-group {-->
<!--  margin-bottom: 30px;-->
<!--  text-align: left;-->
<!--}-->

<!--.login-form label {-->
<!--  font-size: 18px;-->
<!--  color: #d6d6d6;-->
<!--  font-weight: 600;-->
<!--  display: block;-->
<!--  margin-bottom: 8px;-->
<!--}-->

<!--.login-form input {-->
<!--  width: 100%;-->
<!--  padding: 12px;-->
<!--  font-size: 14px;-->
<!--  border: 1px solid #555b65;-->
<!--  border-radius: 8px;-->
<!--  background: #3b3f45;-->
<!--  color: #eaeaea;-->
<!--  outline: none;-->
<!--  transition: border-color 0.3s ease, box-shadow 0.3s ease;-->
<!--}-->

<!--.login-form input:focus {-->
<!--  border-color: #00e676;-->
<!--  box-shadow: 0 0 8px rgba(0, 230, 118, 0.4);-->
<!--}-->

<!--.forgot-password {-->
<!--  text-align: center;-->
<!--  margin-bottom: 40px;-->
<!--}-->

<!--.forgot-password a {-->
<!--  color: #00e676;-->
<!--  text-decoration: none;-->
<!--  font-size: 14px;-->
<!--}-->

<!--.forgot-password a:hover {-->
<!--  text-decoration: underline;-->
<!--}-->

<!--.login-button {-->
<!--  width: 100%;-->
<!--  background: linear-gradient(to right, #00c853, #00e676);-->
<!--  color: #ffffff;-->
<!--  border: none;-->
<!--  border-radius: 8px;-->
<!--  padding: 14px;-->
<!--  font-size: 16px;-->
<!--  font-weight: bold;-->
<!--  cursor: pointer;-->
<!--  transition: background 0.3s ease, transform 0.2s ease, box-shadow 0.3s ease;-->
<!--}-->

<!--.login-button:hover {-->
<!--  transform: scale(1.05);-->
<!--  box-shadow: 0 10px 20px rgba(0, 230, 118, 0.4);-->
<!--}-->

<!--.login-button:active {-->
<!--  transform: scale(1);-->
<!--}-->

<!--.register-section {-->
<!--  margin-top: 40px;-->
<!--  font-size: 14px;-->
<!--  color: #d6d6d6;-->
<!--}-->

<!--.register-link {-->
<!--  color: #00e676;-->
<!--  font-weight: bold;-->
<!--  text-decoration: none;-->
<!--}-->

<!--.register-link:hover {-->
<!--  text-decoration: underline;-->
<!--}-->
<!--</style>-->
