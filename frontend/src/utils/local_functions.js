// services/predictionApi.js
import { useDataSourceStore } from "@/stores/dataSourceStore.js";
/*TODO: this file is necessary? */

// Basic utility function to load a local JSON file
async function loadJsonFile(filePath) {
  const response = await fetch(filePath);
  if (!response.ok) {
    throw new Error(`Failed to load ${filePath}`);
  }
  return response.json();
}

// Determine which dataset paths to use based on the selected dataset
function getDataPaths() {
  const dataSourceStore = useDataSourceStore();
  const dataset = dataSourceStore.selectedDataset;

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

// Get prediction from the XGBoost model for a given patient - XGBoost / DecisionTree / LogisticRegression
export async function GetPatientPredictXGBOOST(patient_id) {
  const { modelPredictions } = getDataPaths();
  const data = await loadJsonFile(modelPredictions);
  const patient = data.find(p => p.patient_id === patient_id.toString());
  if (!patient) throw new Error("Prediction not found for the given patient_id");
  return patient.XGBoost_Pred;
}

// Get prediction from the Decision Tree model for a given patient
export async function GetPatientPredictDecisionTree(patient_id) {
  const { modelPredictions } = getDataPaths();
  const data = await loadJsonFile(modelPredictions);
  const patient = data.find(p => p.patient_id === patient_id.toString());
  if (!patient) throw new Error("Prediction not found for the given patient_id");
  return patient.DecisionTree_Pred;
}

// Get prediction from the Logistic Regression model for a given patient
export async function GetPatientPredictLogisticRegression(patient_id) {
  const { modelPredictions } = getDataPaths();
  const data = await loadJsonFile(modelPredictions);
  const patient = data.find(p => p.patient_id === patient_id.toString());
  if (!patient) throw new Error("Prediction not found for the given patient_id");
  return patient.LogisticRegression_Pred;
}

// Fetch patient details and map variable names using a dictionary
export async function GetPatientDetails(patient_id) {
  const { patientDetails } = getDataPaths();
  const data = await loadJsonFile(patientDetails);
  const patient = data.find(p => p.patient_id === patient_id.toString());
  if (!patient) throw new Error("Patient not found");

  // Load the dictionary that maps technical variable names to readable ones
  const dictionary = await loadJsonFile("/data/variable_mapping.json");

  // Replace keys in patient data using the mapping dictionary
  const updateKeys = (data, dict) => {
    const updated = {};
    for (const key in data) {
      updated[dict[key] || key] = data[key];
    }
    return updated;
  };

  return updateKeys(patient, dictionary);
}

// Load model explanation (e.g., SHAP) for a given patient and model
export async function GetPatientExplanation(patientId, modelName) {
  try {
    const { explanationFolder } = getDataPaths();
    const explanationPath = `${explanationFolder}/patient_${patientId}_explanation.json`;
    const data = await loadJsonFile(explanationPath);
    return data[modelName] || null;
  } catch (error) {
    console.error(`Error loading explanation for patient ${patientId}:`, error.message);
    return null;
  }
}
