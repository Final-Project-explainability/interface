import patientDetails from './JSON/patient_details_mock.json';
import predictionExplain from './JSON/patient_prediction_explain_mock.json';

export function MockGetPatientDeatails(id) {
  return patientDetails; // החזרת נתוני המטופל
}

export function MockGetPatientPredictXGBOOST(id) {
  return 86.7; // אחוזי תמותה לדוגמה
}

export function MockGetPatientPredictDecisionTree(id) {
  return 20.8; // אחוזי תמותה לדוגמה
}

export function MockGetPatientPredictLogisticRegression(id) {
  return 64.7; // אחוזי תמותה לדוגמה
}

export function MockGetPatientExplanaition(id) {
  return predictionExplain; // החזרת נתוני הסבר
}

export function MockIsPatientExist(id) {
  if (id === "0000") {
    return false;
  }
  return true;
}
