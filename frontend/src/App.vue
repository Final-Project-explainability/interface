<template>
  <div id="app">
    <router-view />

    <!-- Toast notification for expired session -->
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
    this.checkTokenOnce();  // Check token expiration on first load
    this.startTokenWatcher(); // Start periodic token expiration check
  },
  beforeUnmount() {
    clearInterval(this.tokenCheckInterval);  // Clean up interval on component destroy
  },
  watch: {
    $route(to) {
      // If returning to home page after expiration, hide the toast after delay
      if (this.showExpiredToast && to.path === "/") {
        setTimeout(() => {
          this.showExpiredToast = false;
        }, 3000);
      }
    },
  },
  methods: {
    // ✅ One-time token expiration check from query string (if arrived with expired=true)
    checkTokenOnce() {
      if (this.$route.query.expired === "true") {
        this.showExpiredToast = true;

        setTimeout(() => {
          this.showExpiredToast = false;
          // Clear query params from URL after showing toast
          this.$router.replace({ path: "/", query: {} });
        }, 3000);
      }
    },

    // ⏱️ Starts interval to periodically check token expiration
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
      }, 10000); // Check every 10 seconds
    },

    // Simple JWT parser to decode payload
    parseJwt(token) {
      try {
        const base64Payload = token.split(".")[1];
        const jsonPayload = atob(base64Payload);
        return JSON.parse(jsonPayload);
      } catch (err) {
        return null;
      }
    },

    // ⛔ Trigger actions when token expires
    triggerTokenExpired() {
      this.showExpiredToast = true;

      // Emit token-expired event to notify other components
      eventBus.emit("token-expired");

      // After 5 seconds: clear everything and redirect to home with expired query
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
