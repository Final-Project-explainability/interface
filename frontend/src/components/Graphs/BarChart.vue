<template>
  <div class="bar-chart-container">
    <!-- כפתורי זום -->
    <div class="controls">
      <button @click="zoomIn" class="zoom-button">
        <i class="fas fa-search-plus"></i>
      </button>
      <button @click="zoomOut" class="zoom-button">
        <i class="fas fa-search-minus"></i>
      </button>
    </div>
    <!-- הגרף -->
    <div ref="chart" class="chart"></div>
  </div>
</template>

<script>
import * as echarts from "echarts";

export default {
  name: "BarChart",
  props: {
    data: Object, // הנתונים לגרף
  },
  mounted() {
    this.initChart(); // אתחול הגרף
    window.addEventListener("resize", this.resizeChart); // רספונסיביות
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.resizeChart); // הסרת מאזין
    this.destroyChart(); // ניקוי הגרף
  },
  methods: {
    initChart() {
      if (!this.data || !this.$refs.chart) return; // אם אין נתונים, אין צורך לאתחל

      // סידור נתונים
      const sortedData = this.sortDataDescending(this.data);
      const categories = Object.keys(sortedData.SHAP);
      const seriesData = {
        SHAP: Object.values(sortedData.SHAP),
        FBT: Object.values(sortedData.FBT),
        "Logistic Regression": Object.values(
          sortedData["Logistic Regression"]
        ),
        "Decision Tree": Object.values(sortedData["Decision Tree"]),
      };

      // יצירת גובה דינמי
      const chartHeight = Math.max(categories.length * 25, 400); // מינימום גובה 400px
      this.$refs.chart.style.height = `${chartHeight}px`;

      // אתחול הגרף
      this.chart = echarts.init(this.$refs.chart);

      // הגדרות הגרף
      const option = {
        tooltip: { trigger: "axis", axisPointer: { type: "shadow" } },
        legend: {
          data: ["SHAP", "FBT", "Logistic Regression", "Decision Tree"],
          top: "10px",
        },
        grid: { left: "3%", right: "4%", bottom: "3%", containLabel: true },
        xAxis: { type: "value", boundaryGap: [0, 0.01] },
        yAxis: { type: "category", data: categories },
        series: [
          { name: "SHAP", type: "bar", data: seriesData.SHAP, itemStyle: { color: "#f39c12" } },
          { name: "FBT", type: "bar", data: seriesData.FBT, itemStyle: { color: "#8e44ad" } },
          {
            name: "Logistic Regression",
            type: "bar",
            data: seriesData["Logistic Regression"],
            itemStyle: { color: "#c0392b" },
          },
          { name: "Decision Tree", type: "bar", data: seriesData["Decision Tree"], itemStyle: { color: "#3498db" } },
        ],
        dataZoom: [
          {
            type: "slider", // פס גלילה
            yAxisIndex: 0, // מפעיל את הגלילה על ציר ה-Y
            filterMode: "filter", // מצמצם את הדאטה המוצג
            start: 0, // התחלה של הגרף
            end: 3, // סוף הגרף
          },
        ],
      };

      // טעינת האופציות לגרף
      this.chart.setOption(option);
    },
    zoomIn() {
      console.log("Zoom In clicked"); // דיבאג
      if (this.chart) {
        const zoomEnd = this.chart.getOption().dataZoom[0].end;
        this.chart.dispatchAction({
          type: "dataZoom",
          start: 0,
          end: Math.max(zoomEnd - 10, 0), // מקטין את התצוגה
        });
      }
    },
    zoomOut() {
      console.log("Zoom Out clicked"); // דיבאג
      if (this.chart) {
        const zoomEnd = this.chart.getOption().dataZoom[0].end;
        this.chart.dispatchAction({
          type: "dataZoom",
          start: 0,
          end: Math.min(zoomEnd + 10, 100), // מגדיל את התצוגה
        });
      }
    },
    resizeChart() {
      if (this.chart) this.chart.resize(); // עדכון גודל הגרף
    },
    destroyChart() {
      if (this.chart) {
        this.chart.dispose(); // הסרת גרף
        this.chart = null;
      }
    },
    sortDataDescending(data) {
      const categories = Object.keys(data.SHAP).map((key) => ({
        category: key,
        shap: data.SHAP[key],
        fbt: data.FBT[key],
        lr: data["Logistic Regression"][key],
        dt: data["Decision Tree"][key],
      }));
      categories.sort((a, b) => b.shap - a.shap);
      return {
        SHAP: categories.reduce((acc, item) => {
          acc[item.category] = item.shap;
          return acc;
        }, {}),
        FBT: categories.reduce((acc, item) => {
          acc[item.category] = item.fbt;
          return acc;
        }, {}),
        "Logistic Regression": categories.reduce((acc, item) => {
          acc[item.category] = item.lr;
          return acc;
        }, {}),
        "Decision Tree": categories.reduce((acc, item) => {
          acc[item.category] = item.dt;
          return acc;
        }, {}),
      };
    },
  },
};
</script>

<style>
.bar-chart-container {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: stretch;
  height: 100%;
  position: relative;
}

/* כפתורי הזום */
.controls {
  position: absolute;
  top: 10px;
  right: 10px;
  display: flex;
  gap: 10px; /* ריווח בין הכפתורים */
  z-index: 10; /* מבטיח שהכפתורים מעל הגרף */
}

.zoom-button {
  padding: 12px; /* ריווח גדול יותר */
  border: none;
  border-radius: 12px; /* פינות מעוגלות */
  background: linear-gradient(135deg, #007a78, #00a8a6); /* צבע Gradient תכלת כהה-טורקיז כהה */
  color: #ffffff; /* צבע טקסט לבן */
  font-size: 20px; /* גודל טקסט */
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2); /* צל עדין */
  transition: all 0.3s ease; /* מעבר חלק */
}

.zoom-button i {
  font-size: 24px; /* גודל אייקון */
}

.zoom-button:hover {
  transform: scale(1.1); /* הגדלה עדינה */
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.3); /* צל מוגבר */
  background: linear-gradient(135deg, #006666, #008a88); /* הפוך את ה-Gradient לכהה יותר */
}

.zoom-button:active {
  transform: scale(0.95); /* הקטנה עדינה בזמן לחיצה */
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2); /* צל קטן יותר */
  background: linear-gradient(135deg, #005252, #006c6a); /* צבע כהה יותר בזמן לחיצה */
}


.chart {
  flex: 1;
  width: 100%;
  height: 100%;
}
</style>
