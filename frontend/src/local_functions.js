
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import csv from 'csv-parser';

export function GetPatientPredictXGBOOST(id) {
  return 86; // Return example mortality percentage
}

export function GetPatientPredictDecisionTree(id) {
  return 20; // Return example mortality percentage
}

export function GetPatientPredictLogisticRegression(id) {
  return 64; // Return example mortality percentage
}


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function GetPatientDetails(patient_id) {
  const filePath = path.resolve(__dirname, 'data', 'example_test_data.csv');

  return new Promise((resolve, reject) => {
    const results = [];

    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', (data) => {
        if (data.patient_id === patient_id.toString()) {
          results.push(data);
        }
      })
      .on('end', () => {
        if (results.length > 0) {
          resolve(results[0]);
        } else {
          reject(new Error('Patient not found'));
        }
      })
      .on('error', (err) => {
        reject(err);
      });
  });
}

GetPatientDetails(125998)
  .then((data) => {
    console.log('Patient details:', data);
  })
  .catch((error) => {
    console.error('Error:', error.message);
  });