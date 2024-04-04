const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3001;

// Cấu hình CORS
app.use(cors());

app.use(bodyParser.json());
const session = require('express-session');

app.use(session({
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: true
}));



const { sendOTPHandler, registerUserHandler, deleteUserHandler, resetPasswordHandler, getUsersHandler } = require("./controller/userController");

// Middleware để ghi log vào file
const { loggerMiddleware } = require("./middlewares/loggerMiddleware");
app.use(loggerMiddleware);

// Route để gửi OTP
app.post("/send-otp", sendOTPHandler);

// Route để đăng ký người dùng
app.post("/api/register", registerUserHandler);

// Route để xóa người dùng
app.post("/api/delete", deleteUserHandler);

// Route để đặt lại mật khẩu
app.post("/reset-password", resetPasswordHandler);

// Thêm route để lấy dữ liệu từ cơ sở dữ liệu MongoDB
app.get("/api/users", getUsersHandler);

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
