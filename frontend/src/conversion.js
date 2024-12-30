import fs from 'fs';
import path from 'path';
import csv from 'csv-parser';

const __dirname = path.dirname(new URL(import.meta.url).pathname);

// הגדרת נתיבי הקבצים
const filesToConvert = [
  {
    csv: path.resolve(__dirname.replace(/^\/([a-zA-Z]):\//, '$1:/'), 'data', 'model_predictions.csv'),
    json: path.resolve(__dirname.replace(/^\/([a-zA-Z]):\//, '$1:/'), 'data', 'model_predictions.json'),
  },
  {
    csv: path.resolve(__dirname.replace(/^\/([a-zA-Z]):\//, '$1:/'), 'data', 'example_test_data.csv'),
    json: path.resolve(__dirname.replace(/^\/([a-zA-Z]):\//, '$1:/'), 'data', 'example_test_data.json'),
  },
];

// פונקציה להמרת CSV ל-JSON
function convertCsvToJson(csvFilePath, jsonFilePath) {
  const results = [];

  return new Promise((resolve, reject) => {
    fs.createReadStream(csvFilePath)
      .pipe(csv())
      .on('data', (data) => results.push(data))
      .on('end', () => {
        fs.writeFileSync(jsonFilePath, JSON.stringify(results, null, 2), 'utf8');
        console.log(`CSV converted to JSON successfully: ${jsonFilePath}`);
        resolve();
      })
      .on('error', (err) => {
        console.error(`Error converting file ${csvFilePath}:`, err.message);
        reject(err);
      });
  });
}

// הרצת ההמרות
(async () => {
  try {
    for (const file of filesToConvert) {
      await convertCsvToJson(file.csv, file.json);
    }
    console.log('All files converted successfully!');
  } catch (err) {
    console.error('Error during conversion:', err.message);
  }
})();
