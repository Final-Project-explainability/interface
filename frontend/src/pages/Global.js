import React from "react";
import MenuBar from "../components/MenuBar"; // נייבא את ה-MenuBar
import FeatureMetric from "../components/FeatureMetric"; // קומפוננטה לתיבת המידע השמאלית
import GraphContainer from "../components/GraphContainer"; // קומפוננטה לגרפים
import data from "../JSON/global graph data.json"; // ייבוא הנתונים מקובץ JSON
import "../styles/Global.css";

const GlobalPage = () => {
  return (
    <div className="global-page">
      <MenuBar />
      <div className="main-content">
        <FeatureMetric />
        <GraphContainer data={data} />
      </div>
    </div>
  );
};

export default GlobalPage;
