import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import "./styles.css";


document.title = "ICU MediClear";

createApp(App).use(router).mount("#app");
