    export function MockGetPatientPredictXGBOOST(id) {
      return 86.7; // Return example mortality percentage
    }

    export function MockGetPatientPredictDecisionTree(id) {
      return 20.8; // Return example mortality percentage
    }

    export function MockGetPatientPredictLogisticRegression(id) {
      return 64.7; // Return example mortality percentage
    }

    export function MockGetPatientDeatails(id) {
        const patientDetails = require('./JSON/patient_details_mock.json');
        return patientDetails;
    }


    export function MockGetPatientExplanaition(id) {
      return 64; // Return example mortality percentage
    }

