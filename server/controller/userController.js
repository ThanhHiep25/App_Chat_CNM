const { getUsersFromDB, addUserToDB, deleteUserFromDB, updateUserPasswordInDB } = require("../models/mongodb");
const { sendOTP } = require("../models/email");

// Đoạn mã để lấy dữ liệu từ cơ sở dữ liệu và trả về cho client
const getUsersHandler = async (req, res) => {
  try {
    const users = await getUsersFromDB();
    res.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ success: false, message: "Error fetching users" });
  }
};

// Đoạn mã để gửi otp về mail
const sendOTPHandler = async (req, res) => {
  const { email } = req.body;
  const otp = Math.floor(100000 + Math.random() * 900000);

  try {
    await sendOTP(email, otp);
    res.status(200).json({ success: true, otp });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Error sending email" });
  }
};


// Đoạn mã để đăng ký người dùng
const registerUserHandler = async (req, res) => {
  const { name, email, pass } = req.body;

  try {
    await addUserToDB({ name, email, pass });
    res.json({ success: true, message: "Đăng ký thành công!" });
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({ success: false, message: "Đã có lỗi xảy ra khi đăng ký." });
  }
};

// Đoạn mã để đặt lại mật khẩu
const resetPasswordHandler = async (req, res) => {
  const { email, newPassword} = req.body;
  try {
    // Cập nhật mật khẩu mới vào cơ sở dữ liệu
    await updateUserPasswordInDB(email, newPassword);
    res.status(200).json({ success: true, message: "Đặt lại mật khẩu thành công" });
  } catch (error) {
    console.error("Error resetting password:", error);
    res.status(500).json({ success: false, message: "Đã có lỗi xảy ra khi đặt lại mật khẩu" });
  }
};


// Đoạn mã để xóa người dùng
const deleteUserHandler = async (req, res) => {
  const { email, name, pass } = req.body;

  try {
    await deleteUserFromDB(email, name, pass);
    res.json({ success: true, message: "Xóa thành công!" });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ success: false, message: "Đã có lỗi xảy ra khi xóa." });
  }
};

module.exports = {
    sendOTPHandler,
    registerUserHandler,
    deleteUserHandler,
    resetPasswordHandler,
    getUsersHandler,
  };