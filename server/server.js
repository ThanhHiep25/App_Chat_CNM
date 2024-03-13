const express = require("express");
const nodemailer = require("nodemailer");
const bodyParser = require("body-parser");
const cors = require("cors");
require("dotenv").config();
const path = require("path");

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

// mongodb
const uri =
  "mongodb+srv://mongo:mongodb123@cluster0.qh6yi.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

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
    const database = client.db("user_fly");
    const collection = database.collection("user");

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
  const { name, email, password } = req.body;

  try {
    await client.connect();

    const database = client.db('user_fly'); // Thay 'your_database_name' bằng tên database của bạn
    const collection = database.collection('user'); // Thay 'user' bằng tên collection của bạn

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


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
