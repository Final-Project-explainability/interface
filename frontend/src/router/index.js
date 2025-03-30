import { createRouter, createWebHistory } from "vue-router";
import MainPage from "../pages/MainPage.vue";
import Global from "../pages/Global.vue";
import Local from "../pages/Local.vue";
import About from "../pages/About.vue";



const routes = [
  {
    path: "/",
    name: "Main",
    component: MainPage,
    // meta: { requiresAuth: true }, // נתיב מוגן - דורש התחברות
  },
  {
    path: "/global",
    name: "Global",
    component: Global,
    // meta: { requiresAuth: true }, // נתיב מוגן
  },
  {
    path: "/local",
    name: "Local",
    component: Local,
    meta: { requiresAuth: true }, // נתיב מוגן
  },
  {
    path: "/about",
    name: "About",
    component: About,
  },

];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Middleware: הגנה על נתיבים
router.beforeEach((to, from, next) => {
  const isAuthenticated = !!localStorage.getItem("token"); // בדיקה אם המשתמש מחובר (קיים JWT)

  if (to.meta.requiresAuth && !isAuthenticated) {
    next({ name: "Login" }); // הפניה למסך התחברות
  } else {
    next(); // אישור מעבר לנתיב
  }
});

export default router;
