<template>
  <div class="menu-bar">
    <!-- Left Section -->
    <div class="menu-left">
      <button class="menu-icon">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          class="icon-svg"
        >
          <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
        </svg>
      </button>
    </div>

    <!-- Center Section -->
    <div v-if="isLoggedIn" class="menu-center">
      <input
        type="text"
        placeholder="Search..."
        class="search-input"
      />
    </div>

    <!-- Logo -->
    <div class="menu-center logo-center">
      <span class="logo-text">ICU MediClear</span>
    </div>
    <div class="logo-icon"></div>

    <!-- Right Section -->
    <div class="menu-right">
      <button class="user-menu" @click="toggleDropdown">
        <span>Hello, Dr. Israel</span>
        <div class="user-avatar-menu"></div>
      </button>
      <div v-if="isDropdownOpen" class="user-dropdown">
        <ul>
          <li>Profile</li>
          <li>Settings</li>
          <li>Logout</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from "vue";

export default {
  name: "MenuBar",
  props: {
    isLoggedIn: {
      type: Boolean,
      required: true,
    },
  },
  setup() {
    const isDropdownOpen = ref(false);

    const toggleDropdown = () => {
      isDropdownOpen.value = !isDropdownOpen.value;
    };

    return {
      isDropdownOpen,
      toggleDropdown,
    };
  },
};
</script>

<!--<style scoped>-->
<!--/* General Menu Bar Styles */-->
<!--.menu-bar {-->
<!--  display: flex;-->
<!--  align-items: center;-->
<!--  justify-content: space-between;-->
<!--  background-color: #f0f0f0;-->
<!--  padding: 10px 20px;-->
<!--  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);-->
<!--}-->

<!--.menu-left {-->
<!--  display: flex;-->
<!--  align-items: center;-->
<!--}-->

<!--.menu-icon {-->
<!--  background: none;-->
<!--  border: none;-->
<!--  cursor: pointer;-->
<!--}-->

<!--.icon-svg {-->
<!--  width: 24px;-->
<!--  height: 24px;-->
<!--}-->

<!--.menu-center {-->
<!--  flex: 1;-->
<!--  text-align: center;-->
<!--}-->

<!--.search-input {-->
<!--  padding: 8px 12px;-->
<!--  border: 1px solid #ccc;-->
<!--  border-radius: 20px;-->
<!--  width: 200px;-->
<!--  outline: none;-->
<!--  transition: all 0.3s ease;-->
<!--}-->

<!--.search-input:focus {-->
<!--  border-color: #00e676;-->
<!--  box-shadow: 0 0 8px rgba(0, 230, 118, 0.4);-->
<!--}-->

<!--.logo-center {-->
<!--  opacity: 0.5;-->
<!--}-->

<!--.logo-text {-->
<!--  font-size: 24px;-->
<!--  font-weight: bold;-->
<!--  color: #004d4d;-->
<!--}-->

<!--.logo-icon {-->
<!--  width: 30px;-->
<!--  height: 30px;-->
<!--  background-color: #004d4d;-->
<!--  border-radius: 50%;-->
<!--  margin-left: 10px;-->
<!--}-->

<!--.menu-right {-->
<!--  display: flex;-->
<!--  align-items: center;-->
<!--}-->

<!--.user-menu {-->
<!--  display: flex;-->
<!--  align-items: center;-->
<!--  background: none;-->
<!--  border: none;-->
<!--  cursor: pointer;-->
<!--  gap: 10px;-->
<!--}-->

<!--.user-avatar-menu {-->
<!--  width: 30px;-->
<!--  height: 30px;-->
<!--  background-color: #004d4d;-->
<!--  border-radius: 50%;-->
<!--}-->

<!--.user-dropdown {-->
<!--  position: absolute;-->
<!--  top: 60px;-->
<!--  right: 20px;-->
<!--  background: #ffffff;-->
<!--  border: 1px solid #ccc;-->
<!--  border-radius: 8px;-->
<!--  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);-->
<!--  padding: 10px;-->
<!--  z-index: 10;-->
<!--}-->

<!--.user-dropdown ul {-->
<!--  list-style: none;-->
<!--  padding: 0;-->
<!--  margin: 0;-->
<!--}-->

<!--.user-dropdown li {-->
<!--  padding: 10px;-->
<!--  cursor: pointer;-->
<!--  transition: background 0.3s ease;-->
<!--}-->

<!--.user-dropdown li:hover {-->
<!--  background-color: #f0f0f0;-->
<!--}-->
<!--</style>-->


<style>
@import "../styles/MenuBar.css";
</style>