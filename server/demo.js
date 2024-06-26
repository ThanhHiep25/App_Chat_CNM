const express = require("express");
const nodemailer = require("nodemailer");
const bodyParser = require("body-parser");
const cors = require("cors");
require("dotenv").config();
const path = require("path");
const fs = require("fs");
const app = express();
const PORT = process.env.PORT || 3001;
// Cấu hình CORS
app.use(cors());

app.use(bodyParser.json());

// create server log

const logToFile = (message) => {
  const timestamp = new Date().toISOString();
  const logMessage = `${timestamp}: ${message}\n`;

  fs.appendFile(logFilePath, logMessage, (err) => {
    if (err) {
      console.error('Error writing to log file:', err);
    }
  });
};
// Đường dẫn đến file log
const logFilePath = path.join(__dirname, "server.log");

// Middleware để ghi log vào file
app.use((req, res, next) => {
  const logMessage = `${new Date().toISOString()} - ${req.method} ${req.url}\n`;
  fs.appendFile(logFilePath, logMessage, (err) => {
    if (err) {
      console.error("Error writing to log file:", err);
    }
  });
  next();
});

app.post("/send-otp", async (req, res) => {
  const { email } = req.body;

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL, // Thay bằng email của bạn
      pass: process.env.PASS, // Thay bằng mật khẩu email của bạn
    },
  });

  const otp = Math.floor(100000 + Math.random() * 900000);

  const mailOptions = {
    from: process.env.EMAIL,
    to: email,
    subject: "Xác thực OTP",
    html: `
   
    <div style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px; borderRadius: 30px;">
    <h2 style="color: #333;">Xin chào,</h2>
    <p style="color: #666;">Mã OTP của bạn là: ${otp}</p>
    <p style="color: #666;">Cảm ơn bạn đã sử dụng dịch vụ của chúng tôi.</p>
    <p style="color: #666;">Vui lòng không cung cấp mã OTP này cho người khác.</p>
    <p style="color: #666;">Thân ái,</p>
    <p style="color: #666;">Đội ngũ hỗ trợ jalooo team</p>
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

//test get api lên login

const dbName = "user_fly"; // Thay đổi tên database của bạn
const collectionName = "user";

/*
app.get("/api/user", async (req, res) => {
  try {
    const apiResponse = await fetch(
      "https://65557a0784b36e3a431dc70d.mockapi.io/user"
    );
    const userData = await apiResponse.json();
    res.json(userData);
  } catch (error) {
    console.error("Error fetching user data:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
*/
// mongodb
const uri = process.env.MONGO;

const { MongoClient, ServerApiVersion } = require("mongodb");
const { log } = require("console");
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

app.get("/api/usermongodb", async (req, res) => {
  const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  try {
    await client.connect();

    // Chọn cơ sở dữ liệu và collection cần truy vấn
    const database = client.db(dbName);
    const collection = database.collection(collectionName);

    // Truy vấn tất cả các documents trong collection
    const cursor = collection.find().toArray();

    // Lặp qua các documents và gửi chúng về client
    const documents = await cursor;
    res.json(documents);
  } finally {
    await client.close();
  }
});


app.post("/api/register", async (req, res) => {
  const { name, email, pass } = req.body;

  try {
    await client.connect();

    const database = client.db('user_fly'); // Thay 'your_database_name' bằng tên database
    const collection = database.collection('user'); // Thay 'user' bằng tên collection.

    const user = { name, email, pass };

    const result = await collection.insertOne(user);

    res.json({ success: true, message: "Đăng ký thành công!" });
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({ success: false, message: "Đã có lỗi xảy ra khi đăng ký." });
  } finally {
    await client.close();
  }
});


// Delete user
app.post("/api/delete", async (req, res) => {
  const { email, name, pass } = req.body;
  try {
    await client.connect();
    const database = client.db('user_fly'); // Thay 'your_database_name' bằng tên database
    const collection = database.collection('user'); // Thay 'user' bằng tên collection.
    const user = { email , name, pass}
    const result = await collection.deleteOne(user);
    res.json({ success: true, message: "Xóa thành công!" });
  } catch (error) {
    console.error("Error registering ", error)
    res.status(500).json({success : false, message :"Đã có lỗi xảy ra khi xóa."})
  }
})


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  const message = `Server is running on port ${PORT}`;
  logToFile(message);
});
