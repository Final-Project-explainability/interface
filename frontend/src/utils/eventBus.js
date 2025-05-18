// utils/eventBus.js
import mitt from 'mitt'; // Import the mitt library for a lightweight event emitter

// Create and export a global event bus instance
export const eventBus = mitt();
