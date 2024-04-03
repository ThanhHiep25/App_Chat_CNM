const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3001;

// Cấu hình CORS
app.use(cors());

app.use(bodyParser.json());
const { sendOTPHandler, registerUserHandler, deleteUserHandler, getUsersHandler } = require("./controller/userController");
// Middleware để ghi log vào file
const { loggerMiddleware } = require("./middlewares/loggerMiddleware");
app.use(loggerMiddleware);

app.post("/send-otp", sendOTPHandler);
app.post("/api/register", registerUserHandler);
app.post("/api/delete", deleteUserHandler);

// Thêm route để lấy dữ liệu từ cơ sở dữ liệu MongoDB
app.get("/api/users", getUsersHandler);

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});