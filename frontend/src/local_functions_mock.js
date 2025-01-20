import patientDetails from './JSON/patient_details_mock.json';
import predictionExplain from './JSON/patient_prediction_explain_mock.json';
// import predictionExplain from './JSON/patient_contributions/patient_1428_explanation.json';

export function MockGetPatientDeatails(id) {
  return patientDetails; // החזרת נתוני המטופל
}

// export function MockGetPatientPredictXGBOOST(id) {
//   return 86.7; // אחוזי תמותה לדוגמה
// }

// export function MockGetPatientPredictXGBOOST(id) {
//   const mockData = [
//     { patient_id: "125998", XGBoost_Pred: "0.02" },
//     { patient_id: "26422", XGBoost_Pred: "0.19100113" },
//     // ...שאר המטופלים
//   ];
//
//   const patient = mockData.find(p => p.patient_id === String(id));
//   if (patient) {
//     return patient.XGBoost_Pred;
//   } else {
//     throw new Error("Prediction not found for the given patient_id");
//   }
// }

export function MockGetPatientPredictDecisionTree(id) {
  return 20.8; // אחוזי תמותה לדוגמה
}

export function MockGetPatientPredictLogisticRegression(id) {
  return 64.7; // אחוזי תמותה לדוגמה
}

// export function MockGetPatientExplanaition(id) {
//   return predictionExplain; // החזרת נתוני הסבר
// }

export function MockGetPatientExplanaition(patientId, modelName) {
  return predictionExplain[modelName];
}

// export function MockGetPatientExplanaition(patientId, modelName) {
//   const predictionExplain = {
//     XGBOOST: {
//       feature1: 0.9,
//       feature2: 0.8,
//     },
//     LogisticRegression: {
//       feature1: 0.7,
//       feature2: 0.6,
//     },
//     DecisionTree: {
//       feature1: 0.4,
//       feature2: 0.3,
//     },
//   };
//
//   // וודא שהמודל קיים לפני ההחזרה
//   if (!predictionExplain[modelName]) {
//     return {}; // החזר אובייקט ריק במקרה של מודל לא חוקי
//   }
//
//   return predictionExplain[modelName];
// }

export function MockIsPatientExist(id) {
  if (id === "0000") {
    return false;
  }
  return true;
}
