<template>
  <div class="local-page">
    <!-- Top Menu -->
    <MenuBar />

    <!-- Page Content -->
    <main class="local-content">
      <h1>Personal Patient Data</h1>
      <p>
        Welcome to the Personal Patient Data page. Here you can view and
        analyze patient-specific data and insights.
      </p>

      <div class="patient-data-container">
        <h2>Example Patient Details</h2>
        <ul>
          <li>
            <strong>Name:</strong> John Doe
          </li>
          <li>
            <strong>Age:</strong> 45
          </li>
          <li>
            <strong>Condition:</strong> Stable
          </li>
          <li>
            <strong>Last Visit:</strong> Dec 20, 2024
          </li>
        </ul>
      </div>
    </main>
  </div>
</template>

<script>
import MenuBar from "../components/MenuBar.vue";

export default {
  name: "LocalPage",
  components: {
    MenuBar,
  },
};
</script>

<!--<style scoped>-->
<!--/* Local Page Styles */-->
<!--.local-page {-->
<!--  display: flex;-->
<!--  flex-direction: column;-->
<!--  min-height: 100vh;-->
<!--  background-color: #f8f9fa; /* Light gray background */-->
<!--  font-family: Arial, sans-serif;-->
<!--}-->

<!--.local-content {-->
<!--  padding: 20px;-->
<!--  max-width: 800px;-->
<!--  margin: 0 auto;-->
<!--}-->

<!--.local-content h1 {-->
<!--  font-size: 28px;-->
<!--  color: #004d4d;-->
<!--  margin-bottom: 10px;-->
<!--  text-align: center;-->
<!--}-->

<!--.local-content p {-->
<!--  font-size: 16px;-->
<!--  color: #555;-->
<!--  line-height: 1.6;-->
<!--  margin-bottom: 20px;-->
<!--  text-align: center;-->
<!--}-->

<!--.patient-data-container {-->
<!--  background-color: #ffffff;-->
<!--  border: 2px solid #004d4d;-->
<!--  border-radius: 10px;-->
<!--  padding: 20px;-->
<!--  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);-->
<!--}-->

<!--.patient-data-container h2 {-->
<!--  font-size: 24px;-->
<!--  color: #004d4d;-->
<!--  margin-bottom: 15px;-->
<!--}-->

<!--.patient-data-container ul {-->
<!--  list-style: none;-->
<!--  padding: 0;-->
<!--  margin: 0;-->
<!--}-->

<!--.patient-data-container li {-->
<!--  font-size: 16px;-->
<!--  color: #333;-->
<!--  margin-bottom: 10px;-->
<!--}-->

<!--.patient-data-container strong {-->
<!--  color: #004d4d;-->
<!--}-->
<!--</style>-->


<style>
@import "../styles/Local.css";
</style>