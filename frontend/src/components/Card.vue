<template>
  <!-- Main Card Container -->
  <div :class="['card', { disabled }]">

    <!-- Card Title -->
    <h3>{{ title }}</h3>

    <!-- Image Area with dynamic class -->
    <div :class="['card-image', imageClass]"></div>

    <!-- Action Button -->
    <button @click="onClick" :disabled="disabled">
      {{ buttonText }}
    </button>

    <!-- Disabled Overlay Message -->
    <div v-if="disabled" class="overlay">{{ overlayText }}</div>
  </div>
</template>

<script>
export default {
  name: "Card",

  // Props passed from parent component
  props: {
    title: {
      type: String,
      required: true, // Title is mandatory
    },
    buttonText: {
      type: String,
      required: true, // Button text is mandatory
    },
    onClick: {
      type: Function,
      required: true, // Function to handle button click
    },
    imageClass: {
      type: String,
      default: "",  // Optional CSS class for image section
    },
    disabled: {
      type: Boolean,
      default: false,  // Whether the card is disabled
    },
    overlayText: {
      type: String,
      default: "This is disabled",  // Text to display when disabled
    },
  },
};
</script>

<style scoped>
/* === Card Container Styling === */
.card {
    background-color: #f9f9f9; /* Light gray background */
    border-radius: 10px; /* Rounded corners */
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1); /* Subtle shadow */
    width: 300px; /* Fixed width */
    padding: 30px 20px; /* Inner spacing */
    text-align: center; /* Centers text */
    position: relative; /* For child positioning */
    transition: transform 0.3s ease, box-shadow 0.3s ease; /* Smooth animation */
    display: flex; /* Flexbox layout */
    flex-direction: column; /* Stacks children vertically */
    align-items: center; /* Centers children horizontally */
}

/* Hover effect for card */
.card:hover {
    transform: translateY(-5px); /* Moves card upward */
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2); /* Larger shadow on hover */
}

/* Disabled card appearance */
.card.disabled {
    opacity: 0.6; /* Faint appearance to indicate the card is disabled */
    pointer-events: auto; /* Allows interactions (like hover effects) on the card */
}

.card.disabled .overlay {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%) scale(0.8); /* Centers and scales down initially */
    width: 90%;
    height: 90%;
    background: rgba(255, 255, 255, 0.1); /* Semi-transparent white overlay */
    backdrop-filter: blur(10px); /* Blurs the background */
    -webkit-backdrop-filter: blur(10px); /* Safari support */
    color: #000000; /* Dark gray text */
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 24px; /* Large text size */
    font-family: 'Poppins', sans-serif; /* Modern and clean font */
    text-align: center; /* Centers text horizontally */
    font-weight: bold; /* Makes the text bold */
    border: 2px solid rgba(255, 255, 255, 0.3); /* Semi-transparent border */
    border-radius: 15px; /* Smooth rounded corners */
    opacity: 0; /* Hidden by default */
    transition: opacity 0.4s ease, transform 0.4s ease; /* Smooth transitions */
}

.card.disabled:hover .overlay {
    opacity: 1; /* Fully visible */
    transform: translate(-50%, -50%) scale(1); /* Scales to full size */
    animation: hoverFloat 2s ease-in-out infinite; /* Adds floating effect */
}

/* Card title */
.card h3 {
    font-size: 24px; /* Medium font size */
    color: #004d4d; /* Teal color */
    margin-bottom: 10px; /* Spacing below title */
}

/* Card button */
.card button {
    padding: 12px 24px; /* Inner spacing: 12px top & bottom, 24px left & right */
    border-radius: 50px; /* Rounded corners for a pill-shaped button */
    border: none; /* No border */
    font-size: 16px; /* Medium font size */
    font-weight: bold; /* Bold text for emphasis */
    color: #ffffff; /* White text color */
    background: linear-gradient(145deg, #1C2833, #34495E); /* Gradient background with a lighting effect */
    box-shadow: 4px 4px 8px rgba(0, 0, 0, 0.2), /* Subtle shadow on the bottom-right for depth */
                -4px -4px 8px rgba(255, 255, 255, 0.1); /* Soft highlight on the top-left for a 3D look */
    cursor: pointer; /* Changes cursor to a pointer to indicate a clickable element */
    transition: transform 0.3s ease, box-shadow 0.3s ease; /* Smooth animation for scaling and shadow changes */
}

.card button:hover {
    transform: scale(1.05); /* Slightly enlarges the button on hover for emphasis */
    box-shadow: 6px 6px 12px rgba(0, 0, 0, 0.3), /* Darker and more pronounced shadow on hover */
                -6px -6px 12px rgba(255, 255, 255, 0.1); /* Stronger highlight on the top-left */
}

.card.disabled {
    opacity: 0.6; /* Faint appearance to indicate the card is disabled */
    pointer-events: auto; /* Allows interactions (like hover effects) on the card */
}

.card.disabled button {
    pointer-events: none; /* Prevents any clicks or interactions with buttons inside the card */
}

.card.disabled .overlay {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%) scale(0.8); /* Centers and scales down initially */
    width: 90%;
    height: 90%;
    background: rgba(255, 255, 255, 0.1); /* Semi-transparent white overlay */
    backdrop-filter: blur(10px); /* Blurs the background */
    -webkit-backdrop-filter: blur(10px); /* Safari support */
    color: #000000; /* Dark gray text */
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 24px; /* Large text size */
    font-family: 'Poppins', sans-serif; /* Modern and clean font */
    text-align: center; /* Centers text horizontally */
    font-weight: bold; /* Makes the text bold */
    border: 2px solid rgba(255, 255, 255, 0.3); /* Semi-transparent border */
    border-radius: 15px; /* Smooth rounded corners */
    opacity: 0; /* Hidden by default */
    transition: opacity 0.4s ease, transform 0.4s ease; /* Smooth transitions */
}

.card.disabled:hover .overlay {
    opacity: 1; /* Fully visible */
    transform: translate(-50%, -50%) scale(1); /* Scales to full size */
    animation: hoverFloat 2s ease-in-out infinite; /* Adds floating effect */
}

@keyframes hoverFloat {
    0% { transform: translate(-50%, -50%) scale(1) translateY(-5px); }
    50% { transform: translate(-50%, -50%) scale(1) translateY(5px); }
    100% { transform: translate(-50%, -50%) scale(1) translateY(-5px); }
}

/* Responsive design */
@media (max-width: 768px) {
    .card-container {
        flex-direction: column; /* Stacks cards vertically */
        gap: 20px; /* Spacing between cards */
    }
}
</style>

