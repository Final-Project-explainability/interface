// פונקציה לטעינת נתונים מקובץ JSON
async function loadJsonFile(filePath) {
  const response = await fetch(filePath);
  if (!response.ok) {
    throw new Error(`Failed to load ${filePath}`);
  }
  return response.json();
}

// פונקציה לקבלת תחזית ממודל XGBoost
export async function GetPatientPredictXGBOOST(patient_id) {
  const modelPredictions = await loadJsonFile('/data/model_predictions.json');
  const patient = modelPredictions.find(p => p.patient_id === patient_id.toString());
  if (patient) {
    return patient.XGBoost_Pred;
  } else {
    throw new Error('Prediction not found for the given patient_id');
  }
}

// פונקציה לקבלת תחזית ממודל DecisionTree
export async function GetPatientPredictDecisionTree(patient_id) {
  const modelPredictions = await loadJsonFile('/data/model_predictions.json');
  const patient = modelPredictions.find(p => p.patient_id === patient_id.toString());
  if (patient) {
    return patient.DecisionTree_Pred;
  } else {
    throw new Error('Prediction not found for the given patient_id');
  }
}

// פונקציה לקבלת תחזית ממודל LogisticRegression
export async function GetPatientPredictLogisticRegression(patient_id) {
  const modelPredictions = await loadJsonFile('/data/model_predictions.json');
  const patient = modelPredictions.find(p => p.patient_id === patient_id.toString());
  if (patient) {
    return patient.LogisticRegression_Pred;
  } else {
    throw new Error('Prediction not found for the given patient_id');
  }
}

// פונקציה לקבלת פרטי מטופל
export async function GetPatientDetails(patient_id) {
  const patientDetails = await loadJsonFile('/data/example_test_data.json');
  const patient = patientDetails.find(p => p.patient_id === patient_id.toString());
  if (patient) {
    return patient;
  } else {
    throw new Error('Patient not found');
  }
}

// בדיקות
(async () => {
  try {
    const patientId = '125998';

    // בדיקת פרטי מטופל
    const patientDetails = await GetPatientDetails(patientId);
    console.log('Patient Details:', patientDetails);

    // בדיקת תחזיות
    const xgboostPrediction = await GetPatientPredictXGBOOST(patientId);
    console.log('XGBoost Prediction:', xgboostPrediction);

    const decisionTreePrediction = await GetPatientPredictDecisionTree(patientId);
    console.log('DecisionTree Prediction:', decisionTreePrediction);

    const logisticRegressionPrediction = await GetPatientPredictLogisticRegression(patientId);
    console.log('LogisticRegression Prediction:', logisticRegressionPrediction);
  } catch (error) {
    console.error('Error during tests:', error.message);
  }
})();


// דוגמאות נוספות
// GetPatientPredictDecisionTree(115540)
//   .then((prediction) => {
//     console.log('DecisionTree Prediction:', prediction);
//   })
//   .catch((error) => {
//     console.error('Error:', error.message);
//   });

// GetPatientPredictLogisticRegression(115540)
//   .then((prediction) => {
//     console.log('LogisticRegression Prediction:', prediction);
//   })
//   .catch((error) => {
//     console.error('Error:', error.message);
//   });



// import fs from 'fs';
// import path from 'path';
// import { fileURLToPath } from 'url';
// import csv from 'csv-parser';
//
// export function GetPatientPredictXGBOOST(patient_id) {
//   const filePath = path.resolve(__dirname, 'data', 'model_predictions.csv');
//
//   return new Promise((resolve, reject) => {
//     let predictionFound = false;
//
//     fs.createReadStream(filePath)
//       .pipe(csv())
//       .on('data', (data) => {
//         if (data.patient_id === patient_id.toString()) {
//           predictionFound = true;
//           resolve(data.XGBoost_Pred);
//         }
//       })
//       .on('end', () => {
//         if (!predictionFound) {
//           reject(new Error('Prediction not found for the given patient_id'));
//         }
//       })
//       .on('error', (err) => {
//         reject(err);
//       });
//   });
// }
//
//
// export function GetPatientPredictDecisionTree(patient_id) {
//   const filePath = path.resolve(__dirname, 'data', 'model_predictions.csv');
//
//   return new Promise((resolve, reject) => {
//     let predictionFound = false;
//
//     fs.createReadStream(filePath)
//       .pipe(csv())
//       .on('data', (data) => {
//         if (data.patient_id === patient_id.toString()) {
//           predictionFound = true;
//           resolve(data.DecisionTree_Pred);
//         }
//       })
//       .on('end', () => {
//         if (!predictionFound) {
//           reject(new Error('Prediction not found for the given patient_id'));
//         }
//       })
//       .on('error', (err) => {
//         reject(err);
//       });
//   });
// }
// export function GetPatientPredictLogisticRegression(patient_id) {
//   const filePath = path.resolve(__dirname, 'data', 'model_predictions.csv');
//
//   return new Promise((resolve, reject) => {
//     let predictionFound = false;
//
//     fs.createReadStream(filePath)
//       .pipe(csv())
//       .on('data', (data) => {
//         if (data.patient_id === patient_id.toString()) {
//           predictionFound = true;
//           resolve(data.LogisticRegression_Pred);
//         }
//       })
//       .on('end', () => {
//         if (!predictionFound) {
//           reject(new Error('Prediction not found for the given patient_id'));
//         }
//       })
//       .on('error', (err) => {
//         reject(err);
//       });
//   });
// }
//
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);
//
// export function GetPatientDetails(patient_id) {
//   const filePath = path.resolve(__dirname, 'data', 'example_test_data.csv');
//
//   return new Promise((resolve, reject) => {
//     const results = [];
//
//     fs.createReadStream(filePath)
//       .pipe(csv())
//       .on('data', (data) => {
//         if (data.patient_id === patient_id.toString()) {
//           results.push(data);
//         }
//       })
//       .on('end', () => {
//         if (results.length > 0) {
//           resolve(results[0]);
//         } else {
//           reject(new Error('Patient not found'));
//         }
//       })
//       .on('error', (err) => {
//         reject(err);
//       });
//   });
// }
//
// // Test the functions
// GetPatientDetails(125998)
//   .then((data) => {
//     console.log('Patient details:', data);
//   })
//   .catch((error) => {
//     console.error('Error:', error.message);
//   });
//
// GetPatientPredictXGBOOST(115540)
//   .then((prediction) => {
//     console.log('XGBoost Prediction:', prediction);
//   })
//   .catch((error) => {
//     console.error('Error:', error.message);
//   });
//
// GetPatientPredictDecisionTree(115540)
//   .then((prediction) => {
//     console.log('DecisionTree Prediction:', prediction);
//   })
//   .catch((error) => {
//     console.error('Error:', error.message);
//   });
//
// GetPatientPredictLogisticRegression(115540)
//   .then((prediction) => {
//     console.log('LogisticRegression Prediction:', prediction);
//   })
//   .catch((error) => {
//     console.error('Error:', error.message);
//   });
