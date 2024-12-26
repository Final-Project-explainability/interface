<template>
  <div class="bar-chart-container">
    <!-- שורת חיפוש -->
    <div class="search-bar">
      <input
        type="text"
        v-model="searchQuery"
        @input="filterChart"
        placeholder="Search Feature..."
        class="search-input"
      />
    </div>
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
  data() {
    return {
      searchQuery: "", // ערך החיפוש
      filteredData: null, // נתונים מסוננים להצגה
    };
  },
  mounted() {
    this.filteredData = { ...this.data }; // אתחול נתונים מסוננים
    this.initChart(); // אתחול הגרף
    window.addEventListener("resize", this.resizeChart); // רספונסיביות
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.resizeChart); // הסרת מאזין
    this.destroyChart(); // ניקוי הגרף
  },
  methods: {
    initChart() {
      if (!this.filteredData || !this.$refs.chart) return;

      // קבלת קטגוריות וערכים מתוך הנתונים המסוננים
      const categories = Object.keys(this.filteredData.SHAP);
      const seriesData = {
        SHAP: Object.values(this.filteredData.SHAP),
        FBT: Object.values(this.filteredData.FBT),
        "Logistic Regression": Object.values(
          this.filteredData["Logistic Regression"]
        ),
        "Decision Tree": Object.values(this.filteredData["Decision Tree"]),
        Lime: Object.values(this.filteredData.Lime),
      };

      // יצירת גובה דינמי
      const chartHeight = Math.max(categories.length * 25, 400);
      this.$refs.chart.style.height = `${chartHeight}px`;

      // אתחול הגרף
      this.chart = echarts.init(this.$refs.chart);

      // הגדרות הגרף
      const option = {
        tooltip: { trigger: "axis", axisPointer: { type: "shadow" } },
        legend: {
          data: ["SHAP", "FBT", "Logistic Regression", "Decision Tree", "Lime"],
          top: "10px",
        },
        grid: { left: "3%", right: "4%", bottom: "3%", containLabel: true },
        xAxis: { type: "value", boundaryGap: [0, 0.01] },
        yAxis: { type: "category", data: categories },
        series: [
          {
            name: "SHAP",
            type: "bar",
            data: seriesData.SHAP,
            itemStyle: { color: "#c0392b" },
          },
          {
            name: "FBT",
            type: "bar",
            data: seriesData.FBT,
            itemStyle: { color: "#8e44ad" },
          },
          {
            name: "Logistic Regression",
            type: "bar",
            data: seriesData["Logistic Regression"],
            itemStyle: { color: "#f39c12" },
          },
          {
            name: "Decision Tree",
            type: "bar",
            data: seriesData["Decision Tree"],
            itemStyle: { color: "#3498db" },
          },
          {
            name: "Lime",
            type: "bar",
            data: seriesData.Lime,
            itemStyle: { color: "#2ecc71" },
          },
        ],
        dataZoom: [
          {
            type: "slider",
            yAxisIndex: 0,
            filterMode: "filter",
            start: 0,
            end: 5,
          },
        ],
      };

      // טעינת האופציות לגרף
      this.chart.setOption(option);
    },
    filterChart() {
      if (!this.data) return;

      // סינון קטגוריות לפי החיפוש
      const query = this.searchQuery.toLowerCase();
      const categories = Object.keys(this.data.SHAP).filter((key) =>
        key.toLowerCase().includes(query)
      );

      // סינון הנתונים בכל הסדרות
      this.filteredData = {
        SHAP: this.filterSeries(this.data.SHAP, categories),
        FBT: this.filterSeries(this.data.FBT, categories),
        "Logistic Regression": this.filterSeries(
          this.data["Logistic Regression"],
          categories
        ),
        "Decision Tree": this.filterSeries(this.data["Decision Tree"], categories),
        Lime: this.filterSeries(this.data.Lime, categories),
      };

      // עדכון הגרף עם הנתונים המסוננים
      this.initChart();
    },
    filterSeries(series, categories) {
      return categories.reduce((filtered, category) => {
        filtered[category] = series[category];
        return filtered;
      }, {});
    },
    zoomIn() {
      if (this.chart) {
        const zoomEnd = this.chart.getOption().dataZoom[0].end;
        this.chart.dispatchAction({
          type: "dataZoom",
          start: 0,
          end: Math.max(zoomEnd - 5, 0),
        });
      }
    },
    zoomOut() {
      if (this.chart) {
        const zoomEnd = this.chart.getOption().dataZoom[0].end;
        this.chart.dispatchAction({
          type: "dataZoom",
          start: 0,
          end: Math.min(zoomEnd + 5, 100),
        });
      }
    },
    resizeChart() {
      if (this.chart) this.chart.resize();
    },
    destroyChart() {
      if (this.chart) {
        this.chart.dispose();
        this.chart = null;
      }
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
  background: linear-gradient(135deg, #007a78, #00a8a6); /* צבע Gradient */
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
  background: linear-gradient(135deg, #006666, #008a88); /* Gradient כהה יותר */
}

.zoom-button:active {
  transform: scale(0.95); /* הקטנה עדינה בזמן לחיצה */
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2); /* צל קטן יותר */
  background: linear-gradient(135deg, #005252, #006c6a); /* כהה בזמן לחיצה */
}

.chart {
  flex: 1;
  width: 100%;
  height: 100%;
}

.search-bar {
  margin: 10px 0;
  display: flex;
  justify-content: flex-start;
}

.search-input {
  width: 300px;
  padding: 10px;
  border: 2px solid #ccc;
  border-radius: 8px;
  font-size: 16px;
  outline: none;
  transition: all 0.3s ease;
}

.search-input:focus {
  border-color: #007a78;
  box-shadow: 0 0 5px rgba(0, 122, 120, 0.5);
}

</style>