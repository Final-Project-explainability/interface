// services/predictionApi.js
import { useDataSourceStore } from "@/stores/dataSourceStore.js";

// Basic utility function to load a JSON file from a given path
async function loadJsonFile(filePath) {
  const response = await fetch(filePath);
  if (!response.ok) {
    throw new Error(`Failed to load ${filePath}`);
  }
  return response.json();
}


// Utility function to get the selected dataset from localStorage (fallback to "DataSet 1")
function getSelectedDataset() {
  return localStorage.getItem("selectedDataset") || "DataSet 1";
}

// Returns file paths depending on the selected dataset
function getDataPaths() {
  const dataset = getSelectedDataset();

  if (dataset === "DataSet 2") {
    return {
      modelPredictions: "/data/model_predictions_DataSet2.json",
      patientDetails: "/data/patients_details_DataSet2.json",
      explanationFolder: "/data/patient_contributions_DataSet2",
    };
  } else {
    return {
      modelPredictions: "/data/model_predictions_DataSet1.json",
      patientDetails: "/data/patients_details_DataSet1.json",
      explanationFolder: "/data/patient_contributions_DataSet1",
    };
  }
}


// Model predictions for each algorithm:

// Get XGBoost prediction for a given patient
export async function GetPatientPredictXGBOOST(patient_id) {
  const { modelPredictions } = getDataPaths();
  const data = await loadJsonFile(modelPredictions);
  const patient = data.find(p => p.patient_id === patient_id.toString());
  if (!patient) throw new Error("Prediction not found for the given patient_id");
  return patient.XGBoost_Pred;
}

// Get Decision Tree prediction for a given patient
export async function GetPatientPredictDecisionTree(patient_id) {
  const { modelPredictions } = getDataPaths();
  const data = await loadJsonFile(modelPredictions);
  const patient = data.find(p => p.patient_id === patient_id.toString());
  if (!patient) throw new Error("Prediction not found for the given patient_id");
  return patient.DecisionTree_Pred;
}

// Get Logistic Regression prediction for a given patient
export async function GetPatientPredictLogisticRegression(patient_id) {
  const { modelPredictions } = getDataPaths();
  const data = await loadJsonFile(modelPredictions);
  const patient = data.find(p => p.patient_id === patient_id.toString());
  if (!patient) throw new Error("Prediction not found for the given patient_id");
  return patient.LogisticRegression_Pred;
}

// Load and map patient details using a variable name dictionary
export async function GetPatientDetails(patient_id) {
  const { patientDetails } = getDataPaths();
  const data = await loadJsonFile(patientDetails);
  const patient = data.find(p => p.patient_id === patient_id.toString());
  if (!patient) throw new Error("Patient not found");

  const dictionary = await loadJsonFile("/data/variable_mapping.json");

  // Map internal keys to human-readable ones
  const updateKeys = (data, dict) => {
    const updated = {};
    for (const key in data) {
      updated[dict[key] || key] = data[key];
    }
    return updated;
  };

  return updateKeys(patient, dictionary);
}

// Load model explanation (e.g. SHAP values) for a specific patient and model
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

// Check whether a given patient ID exists in the currently selected dataset
export async function IsPatientInCurrentDataset(patientId) {
  const { patientDetails } = getDataPaths();
  const data = await loadJsonFile(patientDetails);

  // Debug log showing where the check is being performed and on how many records
  console.log(`Checking if ${patientId} in ${patientDetails}, total records: ${data.length}`);

  return data.some(p => String(p.patient_id) === String(patientId));
}


