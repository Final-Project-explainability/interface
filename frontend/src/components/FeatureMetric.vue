<template>
  <div class="feature-metric">
    <div class="toggle-container">
      <span>Agreement</span>
      <label class="switch">
        <input type="checkbox" :checked="isAgreementOn" @change="toggleAgreement" />
        <span class="slider round"></span>
      </label>
    </div>
    <h2>Feature Metric:</h2>
    <p>Placeholder for metrics or list data</p>
  </div>
</template>

<script>
import { ref } from "vue";

export default {
  name: "FeatureMetric",
  setup() {
    // Reactive state
    const isAgreementOn = ref(false);

    // Toggle function
    const toggleAgreement = () => {
      isAgreementOn.value = !isAgreementOn.value;
    };

    return {
      isAgreementOn,
      toggleAgreement,
    };
  },
};
</script>

<!--<style scoped>-->
<!--/* Feature Metric Styles */-->
<!--.feature-metric {-->
<!--  flex: 1;-->
<!--  background-color: #ffffff;-->
<!--  border: 2px solid #004d40;-->
<!--  border-radius: 10px;-->
<!--  padding: 20px;-->
<!--  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);-->
<!--}-->

<!--.feature-metric h2 {-->
<!--  font-size: 24px;-->
<!--  color: #004d40;-->
<!--  margin-bottom: 10px;-->
<!--}-->

<!--.feature-metric p {-->
<!--  font-size: 16px;-->
<!--  color: #555;-->
<!--}-->

<!--/* Toggle Container */-->
<!--.toggle-container {-->
<!--  display: flex;-->
<!--  align-items: center;-->
<!--  gap: 10px;-->
<!--  margin-bottom: 20px;-->
<!--  font-size: 16px;-->
<!--  color: #004d40;-->
<!--}-->

<!--.switch {-->
<!--  position: relative;-->
<!--  display: inline-block;-->
<!--  width: 34px;-->
<!--  height: 20px;-->
<!--}-->

<!--.switch input {-->
<!--  opacity: 0;-->
<!--  width: 0;-->
<!--  height: 0;-->
<!--}-->

<!--.slider {-->
<!--  position: absolute;-->
<!--  cursor: pointer;-->
<!--  top: 0;-->
<!--  left: 0;-->
<!--  right: 0;-->
<!--  bottom: 0;-->
<!--  background-color: #ccc;-->
<!--  transition: 0.4s;-->
<!--  border-radius: 34px;-->
<!--}-->

<!--.slider:before {-->
<!--  position: absolute;-->
<!--  content: "";-->
<!--  height: 14px;-->
<!--  width: 14px;-->
<!--  left: 3px;-->
<!--  bottom: 3px;-->
<!--  background-color: white;-->
<!--  transition: 0.4s;-->
<!--  border-radius: 50%;-->
<!--}-->

<!--input:checked + .slider {-->
<!--  background-color: #4caf50;-->
<!--}-->

<!--input:checked + .slider:before {-->
<!--  transform: translateX(14px);-->
<!--}-->
<!--</style>-->

<style>
@import "../styles/Global.css";
</style>