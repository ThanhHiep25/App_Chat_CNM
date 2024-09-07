require("dotenv").config();
const path = require("path");

// Đường dẫn đến file log
const logFilePath = path.join(__dirname, "..", "server.log");

module.exports = { logFilePath };
