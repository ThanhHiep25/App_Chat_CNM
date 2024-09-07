const fs = require("fs");
const path = require("path");
const { logFilePath } = require("../config");

const loggerMiddleware = (req, res, next) => {
  const logMessage = `${new Date().toISOString()} - ${req.method} ${req.url}\n`;
  fs.appendFile(logFilePath, logMessage, (err) => {
    if (err) {
      console.error("Error writing to log file:", err);
    }
  });
  next();
};

module.exports = { loggerMiddleware };
