<template>
  <div class="search-container">
    <!-- שדה חיפוש -->
    <input
      type="text"
      class="search-input"
      v-model="searchQuery"
      placeholder="Enter patient ID..."
    />
    <!-- כפתור חיפוש -->
    <button class="search-button" @click="onSearch">
      Search
    </button>
  </div>
</template>

<script>
export default {
  name: "PatientSearch",
  data() {
    return {
      searchQuery: "", // ערך השדה
    };
  },
  methods: {
    onSearch() {
      if (this.searchQuery.trim()) {
        this.$emit("search", this.searchQuery.trim()); // פליטת אירוע עם ID
        this.searchQuery = ""; // איפוס תיבת החיפוש
      } else {
        alert("Please enter a valid patient ID."); // הודעת שגיאה אם השדה ריק
      }
    },
  },
};
</script>

<style scoped>
/* קונטיינר ראשי */
.search-container {
  display: flex; /* שימוש בפריסת Flexbox */
  flex-wrap: nowrap; /* שמירה על אלמנטים באותה שורה */
  justify-content: flex-start; /* יישור האלמנטים בצד שמאל */
  align-items: center; /* יישור אנכי של האלמנטים */
  gap: 10px; /* מרווח בין שדה לכפתור */
  background-color: rgba(255, 255, 255, 0.8); /* רקע לבן שקוף */
  padding: 10px 20px;
  border-radius: 20px; /* פינות מעוגלות */
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); /* צל עדין */
  max-width: 100%; /* התאמה למקסימום רוחב */
  margin: 0 auto; /* יישור מרכזי */
  border: 1px solid #ddd; /* קו דק סביב */
}

/* שדה החיפוש */
.search-input {
  flex: 1; /* גמישות למלא את השורה */
  min-width: 0; /* מינימום כדי למנוע גלישה */
  padding: 12px 15px;
  border: 2px solid #ddd;
  border-radius: 10px; /* פינות מעוגלות */
  font-size: calc(6px + 0.5vw);
  transition: all 0.3s ease;
  outline: none;
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.1); /* צל פנימי */
}

.search-input:focus {
  border-color: #4caf50; /* צבע ירוק בעת פוקוס */
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2); /* צל חיצוני */
}

/* כפתור החיפוש */
.search-button {
  flex-shrink: 0; /* מניעת שינוי גודל הכפתור */
  padding: 12px 20px;
  font-size: 16px;
  font-weight: bold;
  color: white;
  background-color: #00796b; /* צבע רקע ירוק */
  border: none;
  border-radius: 10px; /* פינות מעוגלות */
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); /* צל קל */
}

.search-button:hover {
  background-color: #004d40; /* צבע ירוק כהה יותר */
  box-shadow: 0 6px 10px rgba(0, 0, 0, 0.2); /* צל חזק יותר */
}

.search-button:active {
  transform: scale(0.95); /* אפקט לחיצה */
}

/* רספונסיביות למסכים קטנים */
@media (max-width: 480px) {
  .search-container {
    flex-direction: column; /* מעבר לפריסה אנכית */
    gap: 10px; /* רווח בין השדה לכפתור */
    width: 90%; /* התאמת גודל למסכים קטנים */
    margin: 0 auto; /* יישור מרכזי */
  }

  .search-input,
  .search-button {
    width: 100%; /* הכפתור והשדה תופסים את כל הרוחב */
  }
}

</style>
