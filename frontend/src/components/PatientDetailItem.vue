<template>
  <div class="detail-item">
    <p class="detail-value">{{ value }}</p>
    <p class="detail-title">{{ title }}</p>
  </div>
</template>

<script>
export default {
  name: "PatientDetailItem",
  props: {
    title: {
      type: String,
      required: true,
    },
    value: {
      type: String,
      required: true,
    },
  },
};
</script>

<style scoped>
.detail-item {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: #ffffff;
  border-radius: 8px;
  padding: 0px;
  min-width: 120px;
  height: 80px;
  text-align: center;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1); /* צל קל */
  transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
}

.detail-item:hover {
  transform: translateY(-5px); /* הרמה קלה */
  box-shadow: 0 8px 15px rgba(0, 0, 0, 0.3); /* צל חזק יותר */
}

.detail-value {
  font-size: 16px;
  font-weight: bold;
  color: #004080; /* כחול כהה */
  margin-bottom: 2px;
}

.detail-title {
  font-size: 14px;
  font-weight: bold;
  color: #555555; /* אפור כהה */
  margin-top: 3px;
}
</style>
