import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import "./styles.css";
import '@fortawesome/fontawesome-free/css/all.css';
import '@fortawesome/fontawesome-free/js/all.js';
import { createPinia } from 'pinia';



document.title = "ICU MediClear";

// createApp(App).use(router).mount("#app");


// יצירה אחת של האפליקציה
const app = createApp(App);

// הוספת router ו-pinia
app.use(router);
app.use(createPinia());

// הרכבה
app.mount("#app");
