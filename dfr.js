const fs = require("fs");

function fileExists(filename) {
  return fs.existsSync(filename);
}

function validNumber(value) {
  if (typeof value === "number") return true;
  if (typeof value !== "string") return false;

  // Regex to match valid numbers (integers and decimals, positive/negative)
  const numberRegex = /^-?\d+(\.\d+)?$/;
  return numberRegex.test(value);
}





function dataDimensions(dataframe) {
  if (!Array.isArray(data)) return [-1, -1]; // Not an array
  if (data.length === 0) return [0, 0]; // Empty array

  // Check if it's a 2D array (dataframe)
  if (Array.isArray(data[0])) {
    const rows = data.length;
    const cols = data[0].length;
    return [rows, cols];
  } else {
    // It's a 1D array (dataset)
    return [data.length, -1];
  }
   
}

function calculateMean(dataset) {
  
}

function calculateMedian(dataset) {

}

function convertToNumber(dataframe, col) {

}

function flatten(dataframe) {

}

function loadCSV(csvFile, ignoreRows, ignoreCols) {

}


function createSlice(dataframe, columnIndex, pattern, exportColumns = []) {

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
