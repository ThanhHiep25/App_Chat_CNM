const { getUsersFromDB, addUserToDB, deleteUserFromDB, updateUserPasswordInDB } = require("../models/mongodb");
const { sendOTP } = require("../models/email");
const {auth} = require("../config/firebase")
const{ getFirestore, doc, setDoc } = require("firebase/firestore")
const { createUserWithEmailAndPassword, updateProfile } = require("firebase/auth")
const db = getFirestore();
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
  const { name, email, pass, gender, date } = req.body;
  const tempPhotoURL = gender === 'Nam' ? 'https://firebasestorage.googleapis.com/v0/b/demo1-14597.appspot.com/o/avatar%2Favatar_male.png?alt=media&token=c800b68c-1e1c-4660-b8a0-4dd8563cf74a' : 'https://firebasestorage.googleapis.com/v0/b/demo1-14597.appspot.com/o/avatar%2Favatar_fmale.png?alt=media&token=2301ca57-cf3d-49c2-b7bc-1bf472513dff';
  createUserWithEmailAndPassword(auth, email, pass)
  .then((userCredential) => {
    updateProfile(userCredential.user, {
      displayName: name
    }).then(() => {
      setDoc(doc(db, "users", userCredential.user.uid), {
        name: name,
        UID: userCredential.user.uid,
        email: email,
        gender: gender,
        birthdate: date,
        photoURL: tempPhotoURL
      });
      res.status(200).json({ success: true, message: "Đăng ký thành công" });
    }).catch((error) => {
      console.log("Update profile error: ", error);
    });

  }).catch((error) => {
    console.log("Update profile error: ", error);
  });
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

const getUserByEmailFromDB = async (email) => {
  //truy vấn cơ sở dữ liệu và kiểm tra xem email đã tồn tại hay không
};

module.exports = {
    registerUserHandler,
    deleteUserHandler,
    resetPasswordHandler,
    getUsersHandler,
    getUserByEmailFromDB,
    sendOTPHandler
  };