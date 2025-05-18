import { createApp } from "vue"; // Import the core Vue function to create the app
import App from "./App.vue"; // Import the root App component
import router from "./router"; // Import the router instance
import "./styles.css"; // Import global styles

// Import Font Awesome styles and script for icons
import '@fortawesome/fontawesome-free/css/all.css';
import '@fortawesome/fontawesome-free/js/all.js';
import { createPinia } from 'pinia'; // Import Pinia for state management

// Set the browser tab title
document.title = "ICU MediClear";

// createApp(App).use(router).mount("#app"); /*TODO: Remove this? */

// Create the Vue application instance
const app = createApp(App);

// Register the router and Pinia store with the app
app.use(router);
app.use(createPinia());

// Mount the app to the DOM
app.mount("#app");
