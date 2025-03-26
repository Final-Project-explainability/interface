<template>
  <div class="feature-container" :title="feature">
    <!-- עיגול דינמי עם רקע צבעוני -->
    <div class="circle-container" :style="circleBackgroundStyle">
      <svg class="progress-ring" width="80" height="80">
        <!-- רקע העיגול -->
        <circle
          class="progress-ring__background"
          r="35"
          cx="40"
          cy="40"
        />
        <!-- עיגול ההתקדמות -->
        <circle
          class="progress-ring__progress"
          r="35"
          cx="40"
          cy="40"
          :style="progressStyle"
        />
      </svg>
      <!-- אחוזים במרכז -->
      <div class="circle-text">{{ Math.abs(value).toFixed(1) }}%</div>
    </div>
    <!-- שם המאפיין -->
    <div class="feature-name" :title="feature">
      {{ formatFeature(feature) }}
    </div>
  </div>
</template>

<script>
export default {
  name: "FeatureCircle",
  props: {
    feature: {
      type: String,
      required: true,
    },
    value: {
      type: Number,
      required: true,
    },
  },
  computed: {
    // סגנון עבור עיגול ההתקדמות
    progressStyle() {
      const radius = 35; // רדיוס העיגול
      const circumference = 2 * Math.PI * radius; // היקף המעגל
      const absoluteValue = Math.abs(this.value); // ערך מוחלט
      const offset = circumference - (absoluteValue / 100) * circumference; // חישוב התקדמות
      const color = this.getColor(this.value); // צבע דינמי לפי אחוזים

      return {
        strokeDasharray: `${circumference} ${circumference}`, // היקף המעגל
        strokeDashoffset: offset, // קיזוז לפי האחוזים
        stroke: color, // צבע דינמי
        transition: "stroke-dashoffset 0.8s ease, stroke 0.8s ease", // אנימציה חלקה
      };
    },
    // סגנון עבור הרקע של העיגול
    circleBackgroundStyle() {
      const color = this.getColor(this.value, true); // צבע הרקע של העיגול
      return {
        backgroundColor: color, // צבע רקע
        borderRadius: "50%", // עיגול
        width: "80px",
        height: "80px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        transition: "background-color 0.8s ease", // מעבר חלק של צבע הרקע
      };
    },
  },
  methods: {
    formatFeature(feature) {
      // בדיקה האם feature הוא מחרוזת
      if (!feature || typeof feature !== "string") {
        return ""; // אם הערך אינו מחרוזת או ריק, נחזיר מחרוזת ריקה
      }
      return feature
        .replace(/_/g, " ") // החלפת "_" ברווח
        .replace(/\b[a-z]/g, (char) => char.toUpperCase()); // אות ראשונה גדולה בכל מילה
    },
    getColor(value, faded = false) {
      // פונקציה להחזרת צבע בהתאם לחיובי/שלילי
      let baseColor;
      if (value < 0) {
        // שלילי = ירוק כהה יותר ככל שיותר שלילי
        const greenStrength = Math.min(100, Math.abs(value) * 5); // מגבלת מקסימום 100
        baseColor = `hsl(120, ${greenStrength}%, 50%)`; // ירוק בגוון משתנה
      } else {
        // חיובי = אדום כהה יותר ככל שיותר חיובי
        const redStrength = Math.min(100, value * 5); // מגבלת מקסימום 100
        baseColor = `hsl(0, ${redStrength}%, 50%)`; // אדום בגוון משתנה
      }

      // אם זה צבע רקע, נוסיף גוון בהיר יותר
      if (faded) {
        return baseColor.replace("hsl", "hsla").replace(")", ", 0.2)"); // שקיפות 20%
      }
      return baseColor;
    },
  },
};
</script>

<style scoped>
/* הקונטיינר הראשי */
.feature-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  width: 100px; /* גודל הקונטיינר */
  font-family: Arial, sans-serif;
  gap: 10px; /* רווחים */
  padding: 10px; /* ריווח פנימי */
  background-color: #f1f1f1; /* רקע אפור בהיר */
  border-radius: 8px; /* פינות מעוגלות */
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); /* צל עדין */
  overflow: hidden; /* למנוע גלישת תוכן */
  position: relative; /* עבור Tooltip */
}

.feature-container:hover {
  box-shadow: 0 6px 8px rgba(0, 0, 0, 0.2); /* הצללה חזקה יותר */
}

/* עיגול */
.circle-container {
  position: relative;
  width: 80px;
  height: 80px;
}

/* רקע המעגל */
.progress-ring__background {
  stroke: #ffffff;
  stroke-width: 8; /* עובי */
  fill: none;
}

/* עיגול ההתקדמות */
.progress-ring__progress {
  stroke-width: 8; /* עובי */
  fill: none;
  stroke-linecap: round; /* קצוות מעוגלים */
  transform: rotate(-90deg); /* להתחיל מהחלק העליון */
  transform-origin: center;
}

/* טקסט במרכז העיגול */
.circle-text {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 14px; /* גודל הפונט */
  font-weight: bold;
  color: #000000; /* טקסט שחור */
}

/* שם המאפיין */
.feature-name {
  font-size: 12px; /* גודל הפונט */
  font-weight: bold;
  color: #333;
  white-space: nowrap; /* מניעת שבירת שורה */
  overflow: hidden; /* מניעת גלישת טקסט */
  text-overflow: ellipsis; /* הצגת "..." במקרה של גלישה */
  max-width: 100%; /* הגבלת רוחב */
  cursor: help; /* שינוי הסמן */
}
</style>



