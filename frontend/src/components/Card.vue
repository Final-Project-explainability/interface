<template>
  <div :class="['card', { disabled }]">
    <div :class="['card-image', imageClass]"></div>
    <h3>{{ title }}</h3>
    <button @click="onClick" :disabled="disabled">
      {{ buttonText }}
    </button>
    <div v-if="disabled" class="overlay">{{ overlayText }}</div>
  </div>
</template>

<script>
export default {
  name: "Card",
  props: {
    title: {
      type: String,
      required: true,
    },
    buttonText: {
      type: String,
      required: true,
    },
    onClick: {
      type: Function,
      required: true,
    },
    imageClass: {
      type: String,
      default: "",
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    overlayText: {
      type: String,
      default: "This is disabled",
    },
  },
};
</script>

<!--<style scoped>-->
<!--.card {-->
<!--  background-color: #f9f9f9;-->
<!--  border-radius: 10px;-->
<!--  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);-->
<!--  width: 300px;-->
<!--  padding: 30px 20px;-->
<!--  text-align: center;-->
<!--  position: relative;-->
<!--  transition: transform 0.3s ease, box-shadow 0.3s ease;-->
<!--  display: flex;-->
<!--  flex-direction: column;-->
<!--  align-items: center;-->
<!--}-->

<!--.card:hover {-->
<!--  transform: translateY(-5px);-->
<!--  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);-->
<!--}-->

<!--.card-image {-->
<!--  width: 200px;-->
<!--  height: 200px;-->
<!--  background-size: contain;-->
<!--  margin-bottom: 10px;-->
<!--}-->

<!--.card h3 {-->
<!--  font-size: 24px;-->
<!--  color: #004d4d;-->
<!--  margin-bottom: 10px;-->
<!--}-->

<!--.card button {-->
<!--  padding: 12px 24px;-->
<!--  border-radius: 50px;-->
<!--  border: none;-->
<!--  font-size: 16px;-->
<!--  font-weight: bold;-->
<!--  color: #ffffff;-->
<!--  background: linear-gradient(145deg, #1c2833, #34495e);-->
<!--  box-shadow: 4px 4px 8px rgba(0, 0, 0, 0.2),-->
<!--    -4px -4px 8px rgba(255, 255, 255, 0.1);-->
<!--  cursor: pointer;-->
<!--  transition: transform 0.3s ease, box-shadow 0.3s ease;-->
<!--}-->

<!--.card button:hover {-->
<!--  transform: scale(1.05);-->
<!--  box-shadow: 6px 6px 12px rgba(0, 0, 0, 0.3),-->
<!--    -6px -6px 12px rgba(255, 255, 255, 0.1);-->
<!--}-->

<!--.card.disabled {-->
<!--  opacity: 0.6;-->
<!--  pointer-events: none;-->
<!--}-->

<!--.card.disabled .overlay {-->
<!--  position: absolute;-->
<!--  top: 50%;-->
<!--  left: 50%;-->
<!--  transform: translate(-50%, -50%);-->
<!--  width: 90%;-->
<!--  height: 90%;-->
<!--  background: rgba(255, 255, 255, 0.1);-->
<!--  backdrop-filter: blur(10px);-->
<!--  -webkit-backdrop-filter: blur(10px);-->
<!--  color: #000000;-->
<!--  display: flex;-->
<!--  justify-content: center;-->
<!--  align-items: center;-->
<!--  font-size: 24px;-->
<!--  font-family: "Poppins", sans-serif;-->
<!--  text-align: center;-->
<!--  font-weight: bold;-->
<!--  border: 2px solid rgba(255, 255, 255, 0.3);-->
<!--  border-radius: 15px;-->
<!--  opacity: 0;-->
<!--  transition: opacity 0.4s ease, transform 0.4s ease;-->
<!--}-->

<!--.card.disabled:hover .overlay {-->
<!--  opacity: 1;-->
<!--}-->
<!--</style>-->

