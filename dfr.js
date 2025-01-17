const fs = require("fs");

// Check if a file exists
function fileExists(filename) {
  return fs.existsSync(filename);
}

// Check if a value is a valid number (supports integers, decimals, and scientific notation)
function validNumber(value) {
  if (typeof value === "number") return true; // Already a number
  if (typeof value !== "string") return false; // Not a string or number

  // Regex to match valid numbers
  const numberRegex = /^-?\d+(\.\d+)?([eE][+-]?\d+)?$/;
  return numberRegex.test(value);
}

// Get the dimensions of a dataframe or dataset
function dataDimensions(data) {
  if (!Array.isArray(data)) return [-1, -1]; // Not an array
  if (data.length === 0) return [0, 0]; // Empty array

  if (Array.isArray(data[0])) {
    // 2D array (dataframe)
    const rows = data.length;
    const cols = data[0].length;

    // Check for inconsistent row lengths
    for (let row of data) {
      if (!Array.isArray(row) || row.length !== cols) return [rows, -1]; // Inconsistent rows
    }
    return [rows, cols];
  } else {
    // 1D array (dataset)
    return [data.length, -1];
  }
}

// Calculate the mean (average) of a dataset
function calculateMean(dataset) {
  if (!Array.isArray(dataset) || dataDimensions(dataset)[1] !== -1) return 0; // Not a dataset

  // Filter valid numbers and calculate the sum
  const validNumbers = dataset.filter((val) => validNumber(val));
  if (validNumbers.length === 0) return 0; // No valid numbers

  const sum = validNumbers.reduce((acc, val) => acc + parseFloat(val), 0);
  return sum / validNumbers.length; // Return the mean
}

// Calculate the median of a dataset
function calculateMedian(dataset) {
  if (!Array.isArray(dataset) || dataDimensions(dataset)[1] !== -1) return 0; // Not a dataset

  // Filter valid numbers, convert to floats, and sort
  const validNumbers = dataset
    .filter((val) => validNumber(val))
    .map((val) => parseFloat(val))
    .sort((a, b) => a - b);

  if (validNumbers.length === 0) return 0; // No valid numbers

  // Calculate the median
  const mid = Math.floor(validNumbers.length / 2);
  return validNumbers.length % 2 === 0
    ? (validNumbers[mid - 1] + validNumbers[mid]) / 2 // Even number of elements
    : validNumbers[mid]; // Odd number of elements
}

// Convert string numbers to actual numbers in a specific column of a dataframe
function convertToNumber(dataframe, col) {
  if (!Array.isArray(dataframe) || dataDimensions(dataframe)[1] === -1) return 0; // Not a dataframe

  let count = 0;
  for (let row of dataframe) {
    // Check if the row is valid and the column index is within bounds
    if (Array.isArray(row) && col < row.length && validNumber(row[col])) {
      row[col] = parseFloat(row[col]); // Convert to number
      count++; // Increment the conversion count
    }
  }
  return count; // Return the number of conversions
}

// Flatten a single-column dataframe into a dataset
function flatten(dataframe) {
  if (!Array.isArray(dataframe) || dataDimensions(dataframe)[1] !== 1) return []; // Not a single-column dataframe

  // Extract the first column from each row
  return dataframe.map((row) => row[0]);
}

// Load a CSV file into a dataframe
function loadCSV(csvFile, ignoreRows = [], ignoreCols = []) {
  if (!fileExists(csvFile)) return [[], -1, -1]; // File does not exist

  // Read the file and split into rows
  const fileContent = fs.readFileSync(csvFile, "utf-8");
  const rows = fileContent.split("\n").filter((row) => row.trim() !== ""); // Remove empty rows

  const totalRows = rows.length; // Total rows in the file
  const totalColumns = rows[0].split(",").length; // Total columns in the file

  // Process the rows and columns
  const data = rows
    .filter((_, index) => !ignoreRows.includes(index)) // Filter ignored rows
    .map((row) =>
      row
        .split(",")
        .filter((_, index) => !ignoreCols.includes(index)) // Filter ignored columns
        .map((cell) => cell.trim()) // Trim whitespace from cells
    );

  return [data, totalRows, totalColumns]; // Return the processed data
}

// Create a slice of a dataframe based on a pattern in a specific column
function createSlice(dataframe, columnIndex, pattern, exportColumns = []) {
  if (!Array.isArray(dataframe) || dataDimensions(dataframe)[1] === -1) return []; // Not a dataframe

  // Filter rows based on the pattern
  const result = dataframe.filter((row) => {
    if (pattern === "*") return true; // Wildcard matches all rows
    return row[columnIndex].toString().toLowerCase() === pattern.toString().toLowerCase(); // Case-insensitive match
  });

  if (exportColumns.length === 0) return result; // Return all columns if none specified

  // Return only the specified columns
  return result.map((row) => exportColumns.map((col) => row[col]));
}

// Sum all valid numbers in a dataset
function findTotal(dataset) {
  if (!Array.isArray(dataset) || dataDimensions(dataset)[1] !== -1) return 0; // Not a dataset

  // Sum all valid numbers in the dataset
  return dataset.reduce((sum, value) => {
    if (validNumber(value)) {
      return sum + parseFloat(value);
    }
    return sum;
  }, 0);
}

// Export all functions
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