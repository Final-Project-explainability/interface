    function MockGetPatientPredictXGBOOST(id) {
      return 86.7; // Return example mortality percentage
    }

    function MockGetPatientPredictDecisionTree(id) {
      return 50.8; // Return example mortality percentage
    }

    function MockGetPatientPredictLogisticRegression(id) {
      return 64.7; // Return example mortality percentage
    }

    function MockGetPatientDeatails(id) {
        const patientDetails = require('./JSON/patient_details_mock.json');
        return patientDetails;
    }


    function MockGetPatientExplanaition(id) {
        const predictionExplain = require('./JSON/patient_prediction_explain_mock.json');
        return predictionExplain;
    }

