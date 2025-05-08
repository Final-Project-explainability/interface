// services/predictionService.js
import { useDataSourceStore } from "@/stores/dataSourceStore";

// ⬇️ פונקציית טעינה בסיסית
async function loadJsonFile(filePath) {
  const response = await fetch(filePath);
  if (!response.ok) {
    throw new Error(`Failed to load ${filePath}`);
  }
  return response.json();
}


// ✅ פונקציית עזר חדשה
function getSelectedDataset() {
  return localStorage.getItem("selectedDataset") || "DataSet 1";
}

// ⬇️ פונקציה שמחזירה נתיבים לפי הדאטהסט הנבחר
function getDataPaths() {
  const dataset = getSelectedDataset();

  if (dataset === "DataSet 2") {
    return {
      modelPredictions: "/data/model_predictions_mockDS2.json",
      patientDetails: "/data/patients_details_mockDS2.json",
      explanationFolder: "/data/patient_contributions_mockDS2",
    };
  } else {
    return {
      modelPredictions: "/data/model_predictions.json",
      patientDetails: "/data/patients_details.json",
      explanationFolder: "/data/patient_contributions",
    };
  }
}


// ⬇️ תחזיות לכל מודל
export async function GetPatientPredictXGBOOST(patient_id) {
  const { modelPredictions } = getDataPaths();
  const data = await loadJsonFile(modelPredictions);
  const patient = data.find(p => p.patient_id === patient_id.toString());
  if (!patient) throw new Error("Prediction not found for the given patient_id");
  return patient.XGBoost_Pred;
}

export async function GetPatientPredictDecisionTree(patient_id) {
  const { modelPredictions } = getDataPaths();
  const data = await loadJsonFile(modelPredictions);
  const patient = data.find(p => p.patient_id === patient_id.toString());
  if (!patient) throw new Error("Prediction not found for the given patient_id");
  return patient.DecisionTree_Pred;
}

export async function GetPatientPredictLogisticRegression(patient_id) {
  const { modelPredictions } = getDataPaths();
  const data = await loadJsonFile(modelPredictions);
  const patient = data.find(p => p.patient_id === patient_id.toString());
  if (!patient) throw new Error("Prediction not found for the given patient_id");
  return patient.LogisticRegression_Pred;
}

// ⬇️ שליפת פרטי מטופל עם dictionary
export async function GetPatientDetails(patient_id) {
  const { patientDetails } = getDataPaths();
  const data = await loadJsonFile(patientDetails);
  const patient = data.find(p => p.patient_id === patient_id.toString());
  if (!patient) throw new Error("Patient not found");

  const dictionary = await loadJsonFile("/data/variable_mapping.json");

  const updateKeys = (data, dict) => {
    const updated = {};
    for (const key in data) {
      updated[dict[key] || key] = data[key];
    }
    return updated;
  };

  return updateKeys(patient, dictionary);
}

// ⬇️ שליפת הסבר לפי מודל ודאטהסט
export async function GetPatientExplanation(patientId, modelName) {
  try {
    const { explanationFolder } = getDataPaths();
    const explanationPath = `${explanationFolder}/patient_${patientId}_explanation.json`;

    console.log("🔍 LOADING EXPLANATION FROM:", explanationPath);

    const data = await loadJsonFile(explanationPath);

    if (!data || !data[modelName]) {
      throw new Error(`No explanation for ${modelName} in file ${explanationPath}`);
    }

    return data[modelName];
  } catch (error) {
    console.error(`❌ Failed loading explanation for patient ${patientId}:`, error.message);
    throw error;
  }
}


export async function IsPatientInCurrentDataset(patientId) {
  const { patientDetails } = getDataPaths();
  const data = await loadJsonFile(patientDetails);

  // DEBUGGING LOG
  console.log(`Checking if ${patientId} in ${patientDetails}, total records: ${data.length}`);

  return data.some(p => String(p.patient_id) === String(patientId));
}


