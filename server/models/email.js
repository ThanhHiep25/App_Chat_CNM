const nodemailer = require("nodemailer");
require("dotenv").config();

const sendOTP = async (email, otp) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL,
      pass: process.env.PASS,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL,
    to: email,
    subject: "Xác thực OTP",
    html: `
      <div style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px; borderRadius: 30px;">
        <h2 style="color: #333;">Xin chào,</h2>
        <p style="color: #666;">Mã OTP của bạn là: <span style="color: #6AD4DD;">${otp}</span></p>
        <p style="color: #666;">Cảm ơn bạn đã sử dụng dịch vụ của chúng tôi.</p>
        <p style="color: #666;">Vui lòng không cung cấp mã OTP này cho người khác.</p>
        <p style="color: #666;">Thân ái,</p>
        <p style="color: #666;">Đội ngũ hỗ trợ jalooo team</p>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
};

module.exports = {
  sendOTP,
};
