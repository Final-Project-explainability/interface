<template>
  <div>
    <!-- Sidebar Navigation -->
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

    <!-- Top Menu Bar -->
    <header class="menu-bar">
      <!-- Hamburger Menu Button -->
      <button class="hamburger" @click="isSidebarOpen = !isSidebarOpen">
        <i class="material-icons">menu</i>
      </button>


      <!-- Search Bar and Dataset Switch (Only when user is logged in) -->
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
        <button class="search-btn" @click="submitSearch">Go</button>

        <!-- Current Dataset Display -->
        <div class="dataset-indicator">
          <i class="material-icons">storage</i>
          <span>{{ dataSourceStore.selectedDataset }}</span>
        </div>

        <!-- Dataset Toggle Button -->
        <button class="dataset-toggle-btn" @click="toggleDataset" title="Switch dataset">
          <i class="material-icons">autorenew</i>
        </button>
      </div>


      <!-- Always show dataset when user is not logged in -->
      <div class="dataset-indicator-wrapper"  v-if="!user">
        <div class="dataset-indicator">
          <i class="material-icons">storage</i>
          <span>{{ dataSourceStore.selectedDataset }}</span>
        </div>
        <button class="dataset-toggle-btn" @click="toggleDataset" title="Switch dataset">
          <i class="material-icons">autorenew</i>
        </button>
      </div>


      <!-- Application Logo in Center -->
      <div class="logo-wrapper">
        <span class="logo-text">ICU MediClear</span>
      </div>


      <!-- User Menu Dropdown -->
      <div class="user-menu-wrapper">
        <button class="user-menu" @click="toggleUserDropdown">
          <img
            class="avatar-thumb"
            :src="user?.profilePictureUrl || defaultAvatar"
            alt="avatar"
          />
          <span class="greeting">
            Hello, {{ user?.fullName || 'Guest' }}
          </span>
            <i v-if="user" class="material-icons arrow-icon">
              {{ isUserDropdownOpen ? 'expand_less' : 'expand_more' }}
            </i>
        </button>

        <!-- User Dropdown Menu -->
        <transition name="fade">
          <ul v-if="isUserDropdownOpen && user" class="user-dropdown">
            <li @click="navigateTo('Home')">
              <i class="material-icons">home</i> Home
            </li>

            <li @click="navigateTo('PersonalArea')">
              <i class="material-icons">account_circle</i> My Profile
            </li>

            <li @click="navigateTo('PatientList')">
              <i class="material-icons">assignment</i> Patient List
            </li>

            <!-- Admin Panel Entry (Only for admins) -->
            <li class="admin-entry" v-if="user?.isAdmin" @click="navigateTo('AdminPanel')">
              <i class="material-icons">admin_panel_settings</i> Admin Panel
            </li>

            <!-- Logout Entry -->
            <li class="logout-entry" @click="handleLogout">
              <i class="material-icons">logout</i> Logout
            </li>
          </ul>
        </transition>
      </div>
    </header>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { getUserProfile } from "@/api/authService";
import { useRouter } from "vue-router";
import { eventBus } from "@/utils/eventBus";
import { usePanelStore } from "@/stores/panelStore";
import { useDataSourceStore } from "@/stores/dataSourceStore";


// States
const searchText = ref("");
const isSidebarOpen = ref(false);
const isUserDropdownOpen = ref(false);
const user = ref(null);
const defaultAvatar = "/images/no-user-icon.png";

// Stores
const panelStore = usePanelStore();
const dataSourceStore = useDataSourceStore();

// Router
const router = useRouter();

// Emit search event
const emit = defineEmits(["search"]);

// Toggle user dropdown menu
const toggleUserDropdown = () => {
  isUserDropdownOpen.value = !isUserDropdownOpen.value;
};

// Toggle between datasets
const toggleDataset = () => {
  const current = dataSourceStore.selectedDataset;
  const next = current === "DataSet 1" ? "DataSet 2" : "DataSet 1";
  dataSourceStore.selectedDataset = next;
  localStorage.setItem("selectedDataset", next);
};


// Handle search submission
const submitSearch = () => {
  const query = searchText.value.trim();
  if (query) {
    emit("search", query);
    searchText.value = "";
    if (router.currentRoute.value.path !== "/local") {
      router.push({ path: "/local", query: { patientId: query } });
    } else {
      // Update query params if already on /local
      router.replace({ path: "/local", query: { patientId: query } });
    }
  }
};


// Load user profile from local storage and API
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

// Handle logout by emitting token expiration
const handleLogout = () => {
  eventBus.emit("token-expired");
};

// Navigate to a specific panel and close dropdowns
const navigateTo = (panelName) => {
  isUserDropdownOpen.value = false;
  isSidebarOpen.value = false;
  panelStore.setPanel(panelName);
  if (router.currentRoute.value.path !== "/") {
    router.push("/");
  }
};

// Load user profile on component mount
onMounted(loadUser);
</script>

<style scoped>
/* Import Material Icons */
@import url("https://fonts.googleapis.com/icon?family=Material+Icons");

/* ===== Top Menu Bar ===== */
.menu-bar {
  position: relative;
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

/* ===== Hamburger Button ===== */
.hamburger {
  background: none;
  border: none;
  font-size: 28px;
  cursor: pointer;
  color: #007bff;
}

/* ===== Logo ===== */
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

/* ===== Search Bar Section ===== */
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

/* ===== User Menu Section ===== */
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

/* ===== User Dropdown Menu ===== */
.user-dropdown {
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: 12px;
  background: white;
  border: 1px solid #ddd;
  border-radius: 8px;
  list-style: none;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.08);
  padding: 10px 0;
  min-width: 180px;
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

/* ===== Sidebar ===== */
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

/* ===== Animations ===== */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* ===== Logout Button in Dropdown ===== */
.user-dropdown li.logout-entry {
  border-top: 1px solid #eee;
  color: #d32f2f;
  font-weight: bold;
  margin-top: 8px;
}

.user-dropdown li.logout-entry i {
  color: #d32f2f;
}

.user-dropdown li.logout-entry:hover {
  background-color: #fdecea;
  color: #b71c1c;
}

.user-dropdown li.logout-entry:hover i {
  color: #b71c1c;
}

/* ===== Admin Panel Entry in Dropdown (Gold Style) ===== */
.user-dropdown li.admin-entry {
  background: linear-gradient(to right, #fff8dc, #fceabb);
  font-weight: bold;
  color: #d4af37;
  border-top: 1px solid #ecd9a3;
  margin-top: 8px;
}

.user-dropdown li.admin-entry i {
  color: #d4af37;
}

.user-dropdown li.admin-entry:hover {
  background: linear-gradient(to right, #f5d76e, #f0c14b);
  color: #8c6f1e;
}

.user-dropdown li.admin-entry:hover i {
  color: #8c6f1e;
}

/* ===== Dataset Indicator Capsule ===== */
.dataset-indicator {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 14px;
  background: linear-gradient(to right, #e3f2fd, #bbdefb);
  color: #0d47a1;
  font-weight: 600;
  font-size: 13.5px;
  border-radius: 999px;
  box-shadow: 0 1px 3px rgba(33, 150, 243, 0.2);
  margin-left: 14px;
  white-space: nowrap;
  user-select: none;
  transition: all 0.3s ease;
}

.dataset-indicator i {
  font-size: 18px;
  color: #1976d2;
}

.dataset-indicator:hover {
  background: linear-gradient(to right, #bbdefb, #90caf9);
  box-shadow: 0 2px 5px rgba(33, 150, 243, 0.3);
}

/* ===== Dataset Toggle Button ===== */
.dataset-toggle-btn {
  background: #e3f2fd;
  border: 1px solid #90caf9;
  color: #1976d2;
  border-radius: 50%;
  padding: 6px;
  margin-left: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.dataset-toggle-btn:hover {
  background: #bbdefb;
  color: #0d47a1;
}

.dataset-toggle-btn i {
  font-size: 20px;
}

/* Wrapper for dataset indicator when user is not logged in */
.dataset-indicator-wrapper {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-left: 14px;
}

.dataset-toggle-btn {
  border: none;
  cursor: pointer;
  padding: 6px;
  margin-left: 6px;
  color: #1976d2;
  transition: transform 0.3s ease;
  border-radius: 50%;
}

/* Rotate effect on hover for dataset toggle */
.dataset-toggle-btn:hover {
  transform: rotate(180deg);
  background-color: rgba(25, 118, 210, 0.1);
}
</style>