const fs = require("fs");

// Check if a file exists
function fileExists(filename) {
  return fs.existsSync(filename);
}

// Check if a value is a valid number
function validNumber(value) {
  return !isNaN(value) && isFinite(value);
}

// Get the dimensions of a dataframe or dataset
function dataDimensions(data) {
  if (!Array.isArray(data)) return [-1, -1]; // Not an array
  if (data.length === 0) return [0, 0]; // Empty array

  if (Array.isArray(data[0])) {
    // 2D array (dataframe)
    return [data.length, data[0].length];
  } else {
    // 1D array (dataset)
    return [data.length, -1];
  }
}

// Calculate the mean of a dataset
function calculateMean(dataset) {
  if (!Array.isArray(dataset) || dataDimensions(dataset)[1] !== -1) return 0; // Not a dataset

  const sum = dataset.reduce((acc, val) => acc + (validNumber(val) ? parseFloat(val) : 0), 0);
  const count = dataset.filter((val) => validNumber(val)).length;
  return count === 0 ? 0 : sum / count;
}

// Calculate the median of a dataset
function calculateMedian(dataset) {
  if (!Array.isArray(dataset) || dataDimensions(dataset)[1] !== -1) return 0; // Not a dataset

  const validNumbers = dataset.filter((val) => validNumber(val)).map((val) => parseFloat(val)).sort((a, b) => a - b);
  if (validNumbers.length === 0) return 0;

  const mid = Math.floor(validNumbers.length / 2);
  return validNumbers.length % 2 === 0 ? (validNumbers[mid - 1] + validNumbers[mid]) / 2 : validNumbers[mid];
}

// Convert string numbers to numbers in a specific column of a dataframe
function convertToNumber(dataframe, col) {
  if (!Array.isArray(dataframe) || dataDimensions(dataframe)[1] === -1) return 0; // Not a dataframe

  let count = 0;
  for (let row of dataframe) {
    if (Array.isArray(row) && col < row.length && validNumber(row[col])) {
      row[col] = parseFloat(row[col]);
      count++;
    }
  }
  return count;
}

// Flatten a single-column dataframe into a dataset
function flatten(dataframe) {
  if (!Array.isArray(dataframe) || dataDimensions(dataframe)[1] !== 1) return []; // Not a single-column dataframe

  return dataframe.map((row) => row[0]);
}

// Load a CSV file into a dataframe
function loadCSV(csvFile, ignoreRows = [], ignoreCols = []) {
  if (!fileExists(csvFile)) return [[], -1, -1];

  const fileContent = fs.readFileSync(csvFile, "utf-8");
  const rows = fileContent.split("\n").filter((row) => row.trim() !== "");

  const totalRows = rows.length;
  const totalColumns = rows[0].split(",").length;

  const data = rows
    .filter((_, index) => !ignoreRows.includes(index)) // Filter ignored rows
    .map((row) =>
      row
        .split(",")
        .filter((_, index) => !ignoreCols.includes(index)) // Filter ignored columns
        .map((cell) => cell.trim())
    );

  return [data, totalRows, totalColumns];
}

// Create a slice of a dataframe based on a pattern in a specific column
function createSlice(dataframe, columnIndex, pattern, exportColumns = []) {
  if (!Array.isArray(dataframe) || dataDimensions(dataframe)[1] === -1) return []; // Not a dataframe

  const result = dataframe.filter((row) => {
    if (pattern === "*") return true; // Wildcard matches all rows
    return row[columnIndex] === pattern;
  });

  if (exportColumns.length === 0) return result; // Return all columns if none specified

  return result.map((row) => exportColumns.map((col) => row[col]));
}

// Sum all valid numbers in a dataset
function findTotal(dataset) {
  if (!Array.isArray(dataset) || dataDimensions(dataset)[1] !== -1) return 0; // Not a dataset

  return dataset.reduce((sum, value) => {
    if (validNumber(value)) {
      return sum + parseFloat(value);
    }
    return sum;
  }, 0);
}

module.exports = {
  fileExists,
  validNumber,
  dataDimensions,
  calculateMean,
  findTotal,
  convertToNumber,
  flatten,
  loadCSV,
  calculateMedian,
  createSlice,
};