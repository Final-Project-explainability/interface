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

<style scoped>
/* Login Section */
.login-section {
    text-align: center; /* Centers text inside the section */
    width: 100%; /* Full width */
    max-width: 400px; /* Maximum width for smaller devices */
    position: relative; /* Allows for relative positioning of children */
}

/* Semi-transparent black box for the login form */
.login-background {
    background: rgba(34, 40, 49, 0.85); /* Semi-transparent black background */
    padding: 30px; /* Adds spacing inside the box */
    border-radius: 16px; /* Rounds the corners */
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5); /* Adds a deep shadow effect */
    border: 1px solid #3a3f47; /* Adds a border with a subtle color */
}

/* Login form elements */
.login-form .form-group {
    margin-bottom: 30px; /* Spacing below each form group */
    text-align: left; /* Aligns form labels to the left */
}


.login-form label {
    font-size: 18px; /* Medium font size */
    color: #d6d6d6; /* Light gray color */
    font-weight: 600; /* Makes the label bold */
    display: block; /* Ensures the label occupies a full line */
    margin-bottom: 8px; /* Adds spacing below the label */
}

.login-form input {
    width: 93%; /* Sets the input width */
    padding: 12px; /* Adds padding inside the input */
    font-size: 14px; /* Medium font size */
    border: 1px solid #555b65; /* Subtle border for input */
    border-radius: 8px; /* Rounds the corners of the input */
    background: #3b3f45; /* Dark gray background */
    color: #eaeaea; /* Light gray text */
    outline: none; /* Removes default outline */
    transition: border-color 0.3s ease, box-shadow 0.3s ease; /* Smooth transitions */
}

.login-form input:focus {
    border-color: #00e676; /* Green border on focus */
    box-shadow: 0 0 8px rgba(0, 230, 118, 0.4); /* Green glow on focus */
}

/* Forgot Password link */
.forgot-password {
    text-align: center; /* Centers the link text */
    margin-bottom: 40px; /* Adds spacing below the section */
}

.forgot-password a {
    color: #00e676; /* Green text color */
    text-decoration: none; /* Removes underline */
    font-size: 14px; /* Small font size */
}

.forgot-password a:hover {
    text-decoration: underline; /* Adds underline on hover */
}

/* Login Button */
.login-button {
    width: 100%; /* Full width button */
    background: linear-gradient(to right, #00c853, #00e676); /* Green gradient background */
    color: #ffffff; /* White text color */
    border: none; /* Removes border */
    border-radius: 8px; /* Rounds the button corners */
    padding: 14px; /* Adds padding inside the button */
    font-size: 16px; /* Medium font size */
    font-weight: bold; /* Makes the text bold */
    cursor: pointer; /* Changes cursor to pointer on hover */
    transition: background 0.3s ease, transform 0.2s ease, box-shadow 0.3s ease; /* Smooth transitions */
}

.login-button:hover {
    transform: scale(1.05); /* Slightly enlarges the button */
    box-shadow: 0 10px 20px rgba(0, 230, 118, 0.4); /* Adds a green glow */
}

.login-button:active {
    transform: scale(1); /* Resets scale when pressed */
}


/* Title above the black box */
.login-title {
    font-size: 28px; /* Large font size */
    color: #00e676; /* Neon green text color */
    margin: 0; /* Removes margin around the title */
    letter-spacing: 1.5px; /* Adds spacing between letters */
    font-weight: bold; /* Makes the text bold */
    padding: 10px 20px; /* Adds internal padding */
    border-radius: 12px; /* Rounds the corners of the title box */
    display: inline-block; /* Ensures the title is inline */
}
</style>

