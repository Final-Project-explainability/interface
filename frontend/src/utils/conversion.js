import fs from 'fs';
import path from 'path';
import csv from 'csv-parser';

// Define __dirname since it's not available by default in ES Modules
const __dirname = path.dirname(new URL(import.meta.url).pathname);

// 📂 Define the CSV and corresponding JSON output file paths
const filesToConvert = [
  {
    csv: path.resolve(__dirname.replace(/^\/([a-zA-Z]):\//, '$1:/'), 'data', 'model_predictions.csv'),
    json: path.resolve(__dirname.replace(/^\/([a-zA-Z]):\//, '$1:/'), 'data', 'model_predictions_DataSet1.json'),
  },
  {
    csv: path.resolve(__dirname.replace(/^\/([a-zA-Z]):\//, '$1:/'), 'data', 'example_test_data.csv'),
    json: path.resolve(__dirname.replace(/^\/([a-zA-Z]):\//, '$1:/'), 'data', 'example_test_data.json'),
  },
];

// Function to convert a CSV file to JSON
function convertCsvToJson(csvFilePath, jsonFilePath) {
  const results = [];

  return new Promise((resolve, reject) => {
    fs.createReadStream(csvFilePath)
      .pipe(csv())                      // Parse CSV line by line
      .on('data', (data) => results.push(data)) // Accumulate parsed rows
      .on('end', () => {
        // Write the JSON output with pretty formatting (2-space indent)
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

// Run the conversion for each file asynchronously
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
