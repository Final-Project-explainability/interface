<template>
  <div id="app">
    <router-view />

    <!-- טוסט על התחברות שפגה -->
    <transition name="fade">
      <div v-if="showExpiredToast" class="toast-error">
        🔒 Session expired. Please log in again.
      </div>
    </transition>
  </div>
</template>

<script>
import { eventBus } from "@/utils/eventBus.js";

export default {
  name: "App",
  data() {
    return {
      showExpiredToast: false,
      tokenCheckInterval: null,
    };
  },
  created() {
    this.checkTokenOnce();
    this.startTokenWatcher();
  },
  beforeUnmount() {
    clearInterval(this.tokenCheckInterval);
  },
  watch: {
    $route(to) {
      // אם חזרנו לדף הבית אחרי expiration – נסתיר את ההודעה
      if (this.showExpiredToast && to.path === "/") {
        setTimeout(() => {
          this.showExpiredToast = false;
        }, 3000);
      }
    },
  },
  methods: {
    // ✅ בדיקה חד־פעמית מה-query string (אם הגענו דרך expired=true)
    checkTokenOnce() {
      if (this.$route.query.expired === "true") {
        this.showExpiredToast = true;

        setTimeout(() => {
          this.showExpiredToast = false;
          // מנקה את query מה-URL
          this.$router.replace({ path: "/", query: {} });
        }, 3000);
      }
    },

    // ⏱️ בודק כל כמה זמן אם הטוקן פג תוקף
    startTokenWatcher() {
      this.tokenCheckInterval = setInterval(() => {
        const token = localStorage.getItem("token");
        if (!token) return;

        const payload = this.parseJwt(token);
        if (!payload || !payload.exp) return;

        const now = Math.floor(Date.now() / 1000);

        if (payload.exp < now) {
          this.triggerTokenExpired();
        }
      }, 10000); // כל 10 שניות
    },

    // מפענח JWT בצורה פשוטה
    parseJwt(token) {
      try {
        const base64Payload = token.split(".")[1];
        const jsonPayload = atob(base64Payload);
        return JSON.parse(jsonPayload);
      } catch (err) {
        return null;
      }
    },

    // ⛔ פעולה כשנגמר הטוקן
    triggerTokenExpired() {
      this.showExpiredToast = true;

      // משדר התנתקות לכל הרכיבים
      eventBus.emit("token-expired");

      // לאחר 5 שניות: נקה הכל ועבור לדף הבית עם query (שיציג הודעה)
      setTimeout(() => {
        localStorage.clear();
        this.$router.push({ path: "/", query: { expired: "true" } });
      }, 5000);
    },
  },
};
</script>

<style>
.toast-error {
  position: fixed;
  bottom: 24px;
  left: 24px;
  background-color: #f44336;
  color: #ffffff;
  padding: 14px 20px;
  border-radius: 10px;
  font-weight: bold;
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.2);
  z-index: 9999;
  font-family: 'Segoe UI', sans-serif;
  animation: slideInFade 0.3s ease;
}

@keyframes slideInFade {
  from {
    opacity: 0;
    transform: translateX(-20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
