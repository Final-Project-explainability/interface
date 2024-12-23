import { createRouter, createWebHistory } from "vue-router";
import MainPage from "../pages/MainPage.vue";
import Global from "../pages/Global.vue";
import Local from "../pages/Local.vue";

const routes = [
  {
    path: "/",
    name: "Main",
    component: MainPage,
  },
  {
    path: "/global",
    name: "Global",
    component: Global,
  },
  {
    path: "/local",
    name: "Local",
    component: Local,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
