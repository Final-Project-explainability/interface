<template>
  <div class="detail-item" :title="`${title}: ${value}`">
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
  border-radius: 6px;
  padding: 6px; /* ריווח פנימי */
  min-width: 110px; /* רוחב מינימלי */
  height: auto; /* גובה דינמי */
  max-width: 120px; /* רוחב מקסימלי */
  text-align: center;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1); /* צל קל */
  transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
  word-wrap: break-word; /* שבירת שורות עבור מילים ארוכות */
  overflow-wrap: break-word; /* מניעת גלישת טקסט */
  position: relative; /* ליצירת Tooltip */
}

.detail-item:hover {
  transform: translateY(-3px); /* הרמה קלה */
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2); /* צל חזק יותר */
}

.detail-value {
  font-size: 14px; /* הקטנת גודל הטקסט */
  font-weight: bold;
  color: #004080; /* כחול כהה */
  margin-bottom: 2px;
  text-overflow: ellipsis; /* חיתוך אם הטקסט ארוך מדי */
  overflow: hidden; /* מניעת גלישת טקסט */
  white-space: nowrap; /* מניעת שבירת שורה */
  max-width: 100%; /* הגבלת הרוחב */
}

.detail-title {
  font-size: 12px; /* הקטנת גודל הכותרת */
  font-weight: bold;
  color: #555555; /* אפור כהה */
  margin-top: 2px;
  line-height: 1.2; /* גובה שורה קטן יותר */
  text-overflow: ellipsis; /* חיתוך אם הכותרת ארוכה מדי */
  overflow: hidden; /* מניעת גלישת טקסט */
  white-space: nowrap; /* מניעת שבירת שורה */
  max-width: 100%; /* הגבלת הרוחב */
}
</style>