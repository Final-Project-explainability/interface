import { createRouter, createWebHistory } from "vue-router";
import MainPage from "../pages/MainPage.vue";
import Global from "../pages/Global.vue";
import Local from "../pages/Local.vue";
import About from "../pages/About.vue";


// Define application routes
const routes = [
  {
    path: "/",
    name: "Main",
    component: MainPage,
    // meta: { requiresAuth: true }, // Protected route (authentication required)
  },
  {
    path: "/global",
    name: "Global",
    component: Global,
    // meta: { requiresAuth: true }, // Protected route (optional)
  },
  {
    path: "/local",
    name: "Local",
    component: Local,
    meta: { requiresAuth: true }, // Protected route (requires login)
  },
  {
    path: "/about",
    name: "About",
    component: About,
  },

];

// Create the router instance with HTML5 history mode
const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Middleware: global navigation guard for protecting routes
router.beforeEach((to, from, next) => {
  // Check if user is authenticated (e.g., token exists in localStorage)
  const isAuthenticated = !!localStorage.getItem("token");

  // If the route requires auth and the user is not authenticated
  if (to.meta.requiresAuth && !isAuthenticated) {
    next({ name: "Login" }); // Redirect to login page
  } else {
    next(); // Allow navigation
  }
});

// Export the router for use in main.js
export default router;
