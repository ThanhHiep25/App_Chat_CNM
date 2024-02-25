const express = require("express");
const nodemailer = require("nodemailer");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3001;

// Cấu hình CORS
app.use(cors());

app.use(bodyParser.json());

app.post("/send-otp", async (req, res) => {
  const { email } = req.body;

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "contact.jaloo.1@gmail.com", // Thay bằng email của bạn
      pass: "hfkskqjmhvrtnjih", // Thay bằng mật khẩu email của bạn
    },
  });

  const otp = Math.floor(100000 + Math.random() * 900000);

  const mailOptions = {
    from: "contact.jaloo.1@gmail.com",
    to: email,
    subject: "Xác thực OTP",
    html: `
   
    <div style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px;">
    <h2 style="color: #333;">Xin chào,</h2>
    <p style="color: #666;">Mã OTP của bạn là: ${otp}</p>
    <p style="color: #666;">Cảm ơn bạn đã sử dụng dịch vụ của chúng tôi.</p>
    <p style="color: #666;">Vui lòng không cung cấp mã OTP này cho người khác.</p>
    <p style="color: #666;">Thân ái,</p>
    <p style="color: #666;">Đội ngũ hỗ trợ</p>
  </div>
  `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Email sent to: ${email}, OTP: ${otp}`);
    res.status(200).json({ success: true, otp });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Error sending email" });
  }
});



app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
