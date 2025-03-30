<template>
  <div>
    <!-- סיידבר -->
    <transition name="slide">
      <aside v-if="isSidebarOpen" class="sidebar-overlay" @click.self="isSidebarOpen = false">
        <div class="sidebar">
          <nav class="sidebar-nav">
            <a href="/" class="sidebar-item" @click="isSidebarOpen = false">
              <i class="material-icons">home</i> Home
            </a>
            <a href="/about" class="sidebar-item" @click="isSidebarOpen = false">
              <i class="material-icons">info</i> About
            </a>
            <a href="/help" class="sidebar-item" @click="isSidebarOpen = false">
              <i class="material-icons">help_outline</i> Help
            </a>
            <a href="/contact" class="sidebar-item" @click="isSidebarOpen = false">
              <i class="material-icons">mail_outline</i> Contact
            </a>
          </nav>
        </div>
      </aside>
    </transition>

    <!-- בר עליון -->
    <header class="menu-bar">
      <!-- כפתור תפריט -->
      <button class="hamburger" @click="isSidebarOpen = !isSidebarOpen">
        <i class="material-icons">menu</i>
      </button>



      <!-- חיפוש (רק אם מחובר) -->
      <div class="search-bar-wrapper" v-if="user">
        <div class="search-input-wrapper">
          <i class="material-icons search-icon">search</i>
          <input
            v-model="searchText"
            type="text"
            placeholder="Search patient ID..."
            @keyup.enter="submitSearch"
          />
        </div>
        <button class="search-btn" @click="submitSearch">
          Go
        </button>
      </div>


      <!-- לוגו -->
      <div class="logo-wrapper">
        <span class="logo-text">ICU MediClear</span>
      </div>


      <!-- תפריט משתמש -->
      <div class="user-menu-wrapper">
        <button class="user-menu" @click="toggleUserDropdown">
          <img
            class="avatar-thumb"
            :src="user?.profilePictureUrl || defaultAvatar"
            alt="avatar"
          />
          <span class="greeting">
            Hello, {{ user?.fullName || 'Guest' }}
<!--            <small class="role-label">{{ user?.isAdmin ? 'Admin' : 'User' }}</small>-->
          </span>
            <i v-if="user" class="material-icons arrow-icon">
              {{ isUserDropdownOpen ? 'expand_less' : 'expand_more' }}
            </i>
        </button>

        <transition name="fade">
          <ul v-if="isUserDropdownOpen && user" class="user-dropdown">
            <li><i class="material-icons">account_circle</i> Profile</li>
            <li v-if="user?.isAdmin"><i class="material-icons">admin_panel_settings</i> Admin Panel</li>
            <li><i class="material-icons">settings</i> Settings</li>
            <li @click="handleLogout">
              <i class="material-icons">logout</i> Logout
            </li>
          </ul>
        </transition>
      </div>
    </header>
  </div>
</template>

<script>
import { ref, onMounted } from "vue";
import { getUserProfile } from "@/data/authService";
import {useRouter} from "vue-router"; // שנה אם צריך
import { eventBus } from "@/utils/eventBus";

export default {
  name: "MenuBar",
  emits: ["search"],
  setup(_, { emit }) {
    const searchText = ref("");
    const isSidebarOpen = ref(false);
    const isUserDropdownOpen = ref(false);
    const user = ref(null);
    const defaultAvatar = "https://cdn-icons-png.flaticon.com/512/6073/6073873.png";
    const router = useRouter();

    const toggleUserDropdown = () => {
      isUserDropdownOpen.value = !isUserDropdownOpen.value;
    };

    const submitSearch = () => {
      const query = searchText.value.trim();
      if (query) {
        emit("search", query);
        searchText.value = "";
        // מעביר ל-local אם לא בדף local כבר
        if (router.currentRoute.value.path !== "/local") {
          router.push({ path: "/local", query: { patientId: query } });
        }
      }
    };

    const loadUser = async () => {
      const userId = localStorage.getItem("userId");
      const token = localStorage.getItem("token");
      if (!userId || !token) return;
      try {
        const profile = await getUserProfile(userId, token);
        user.value = profile;
      } catch (err) {
        console.error("❌ Failed to load user:", err);
      }
    };


    const handleLogout = () => {
      eventBus.emit("token-expired");
    };


    onMounted(loadUser);

    return {
      user,
      defaultAvatar,
      searchText,
      submitSearch,
      toggleUserDropdown,
      isUserDropdownOpen,
      isSidebarOpen,
      handleLogout,
    };
  },
};
</script>

<style scoped>
@import url("https://fonts.googleapis.com/icon?family=Material+Icons");

.menu-bar {
  position: relative; /* חשוב כדי שה-logo-wrapper שמבוסס על absolute יתייחס אליה */
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #fff;
  padding: 14px 24px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  top: 0;
  z-index: 1001;
  gap: 20px;
}


.hamburger {
  background: none;
  border: none;
  font-size: 28px;
  cursor: pointer;
  color: #007bff;
}

.logo-wrapper {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  flex-shrink: 0;
}


.logo-text {
  font-size: 20px;
  font-weight: bold;
  color: #007bff;
}

/* חיפוש */
.search-bar-wrapper {
  display: flex;
  align-items: center;
  gap: 8px;
  max-width: 350px;
  flex: 1;
}

.search-input-wrapper {
  flex: 1;
  display: flex;
  align-items: center;
  background: #f1f5f9;
  border: 1px solid #ccc;
  border-radius: 8px;
  padding: 6px 10px;
  transition: border 0.3s ease;
}
.search-input-wrapper:focus-within {
  border-color: #007bff;
}
.search-input-wrapper input {
  flex: 1;
  border: none;
  background: transparent;
  font-size: 14px;
  outline: none;
  padding-left: 8px;
}
.search-icon {
  font-size: 20px;
  color: #888;
}
.search-btn {
  background-color: #00796b;
  color: white;
  border: none;
  padding: 8px 14px;
  border-radius: 8px;
  cursor: pointer;
  font-weight: bold;
  transition: background-color 0.3s ease;
}
.search-btn:hover {
  background-color: #004d40;
}

/* תפריט משתמש */
.user-menu-wrapper {
  position: relative;
  display: flex;
  align-items: center;
  margin-left: auto;
}
.user-menu {
  display: flex;
  align-items: center;
  background: none;
  border: none;
  cursor: pointer;
  gap: 10px;
  color: #333;
}
.greeting {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  font-size: 14px;
}
.role-label {
  font-size: 12px;
  color: #888;
}
.avatar-thumb {
  width: 34px;
  height: 34px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #007bff;
}
.arrow-icon {
  font-size: 20px;
  color: #007bff;
}
.user-dropdown {
  position: absolute;
  top: 60px;
  right: 0;
  background: white;
  border: 1px solid #ddd;
  border-radius: 8px;
  list-style: none;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.08);
  padding: 10px 0;
  min-width: 170px;
  z-index: 1002;
}
.user-dropdown li {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 20px;
  cursor: pointer;
  transition: background 0.2s ease;
  font-size: 15px;
  color: #333;
}
.user-dropdown li i {
  font-size: 20px;
  color: #007bff;
}
.user-dropdown li:hover {
  background-color: #f1f1f1;
}

/* סיידבר */
.slide-enter-active,
.slide-leave-active {
  transition: transform 0.3s ease;
}
.slide-enter-from,
.slide-leave-to {
  transform: translateX(-100%);
}
.sidebar-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.3);
  z-index: 999;
  display: flex;
  margin-top: 60px;
}
.sidebar {
  width: 260px;
  background-color: #fff;
  height: 100%;
  padding: 20px;
  box-shadow: 4px 0 10px rgba(0, 0, 0, 0.1);
}
.sidebar-nav {
  display: flex;
  flex-direction: column;
  gap: 20px;
}
.sidebar-item {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 16px;
  font-weight: 500;
  text-decoration: none;
  color: #333;
  transition: background 0.2s;
  padding: 8px 12px;
  border-radius: 8px;
}
.sidebar-item:hover {
  background-color: #f0f0f0;
  color: #007bff;
}
.sidebar-item i {
  color: #007bff;
  font-size: 22px;
}

/* אנימציה Dropdown */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
