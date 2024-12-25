<template>
  <div class="lime-chart-container">
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
  name: "LimeChart",
  props: {
    data: Object, // נתוני JSON ממווצעים ל-1500 מטופלים
  },
  mounted() {
    this.initChart();
    window.addEventListener("resize", this.resizeChart); // רספונסיביות
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.resizeChart); // הסרת מאזינים
    this.destroyChart();
  },
  methods: {
    initChart() {
      if (!this.data || !this.$refs.chart) return;

      // סידור הנתונים מהגבוה לנמוך
      const sortedData = Object.entries(this.data)
        .sort(([, a], [, b]) => b - a);

      const categories = sortedData.map(([key]) => key); // שמות הפיצ'רים
      const values = sortedData.map(([, value]) => value); // הערכים שלהם

      this.chart = echarts.init(this.$refs.chart);

      const option = {
        tooltip: {
          trigger: "axis",
          axisPointer: { type: "shadow" },
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true,
        },
        xAxis: {
          type: "value",
          name: "השפעה ממוצעת (LIME)",
          nameLocation: "middle",
          nameGap: 25,
        },
        yAxis: {
          type: "category",
          data: categories,
          name: "משתנים",
          inverse: true, // הופך את הסדר כך שהגדולים ביותר יופיעו למעלה
        },
        series: [
          {
            type: "bar",
            data: values,
            label: {
              show: true,
              position: "right", // הערך יוצג מימין לכל עמודה
              formatter: "{c}", // מציג את הערך
            },
            itemStyle: {
              color: "#3498db", // צבע ברירת מחדל
            },
          },
        ],
        dataZoom: [
          {
            type: "slider", // פס גלילה אנכי
            yAxisIndex: 0, // ציר ה-Y
            start: 0, // מציג את התצוגה ההתחלתית (מ-0%)
            end: 20, // מציג רק את ה-20% הראשונים
            filterMode: "filter", // מצמצם את הנתונים בתצוגה
          },
          {
            type: "inside", // גלילה עם גלגלת עכבר
            yAxisIndex: 0,
            start: 0,
            end: 20,
          },
        ],
      };

      this.chart.setOption(option);
    },
    zoomIn() {
      const dataZoom = this.chart.getOption().dataZoom[0];
      let {start, end} = dataZoom;

      // מצמצם את טווח הנתונים (Zoom In)
      const newStart = start + 5;
      const newEnd = end - 5;

      // מוודא שלא יצאנו מהגבולות
      if (newEnd - newStart >= 10) {
        this.chart.dispatchAction({
          type: "dataZoom",
          start: newStart,
          end: newEnd,
        });
      }
    },
    zoomOut() {
      const dataZoom = this.chart.getOption().dataZoom[0];
      let {start, end} = dataZoom;

      // מרחיב את טווח הנתונים (Zoom Out)
      const newStart = start - 5;
      const newEnd = end + 5;

      // מוודא שלא יצאנו מהגבולות
      if (newStart >= 0 && newEnd <= 100) {
        this.chart.dispatchAction({
          type: "dataZoom",
          start: newStart,
          end: newEnd,
        });
      }
    },
    resizeChart() {
      if (this.chart) this.chart.resize(); // עדכון גודל הגרף במקרה של שינוי חלון
    },
    destroyChart() {
      if (this.chart) {
        this.chart.dispose(); // הסרת גרף
        this.chart = null;
      }
    },
  },
};
</script>

<style>
.lime-chart-container {
  position: relative;
  width: 100%;
  height: 100%;
}

.controls {
  position: absolute;
  top: 10px;
  right: 10px;
  display: flex;
  gap: 10px;
  z-index: 10;
}

.zoom-button {
  padding: 10px;
  border: none;
  border-radius: 50%;
  background-color: #3498db;
  color: white;
  cursor: pointer;
  font-size: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.zoom-button:hover {
  background-color: #2980b9;
  transform: scale(1.1);
}

.chart {
  width: 100%;
  height: 100%;
}
</style>
