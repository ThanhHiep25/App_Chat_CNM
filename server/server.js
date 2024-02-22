const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3001;

// Cấu hình CORS
app.use(cors());

app.use(bodyParser.json());

app.post('/send-otp', async (req, res) => {
  const { email } = req.body;

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'hiepnguyen.250402@gmail.com', // Thay bằng email của bạn
      pass: 'tirnmdjizygalpaw', // Thay bằng mật khẩu email của bạn
    },
  });

  const otp = Math.floor(100000 + Math.random() * 900000);

  const mailOptions = {
    from: 'hiepnguyen.250402@gmail.com',
    to: email,
    subject: 'Xác thực OTP',
    text: `Mã OTP của bạn là: ${otp}`,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Email sent to: ${email}, OTP: ${otp}`);
    res.status(200).json({ success: true, otp });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Error sending email' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
