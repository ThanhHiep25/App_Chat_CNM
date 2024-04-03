const { MongoClient } = require("mongodb");

const uri = process.env.MONGO;
const dbName = "user_fly"; // Thay đổi tên database của bạn
const collectionName = "user";

// Đoạn mã connect Mongodb
const connectToMongoDB = async () => {
  const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  await client.connect();
  return client;
};

// Đoạn mã get data từ mongo
const getUsersFromDB = async () => {
  const client = await connectToMongoDB();
  const database = client.db(dbName);
  const collection = database.collection(collectionName);
  const users = await collection.find().toArray();
  client.close();
  return users;
};

// Đoạn mã add data từ mongo
const addUserToDB = async (user) => {
  const client = await connectToMongoDB();
  const database = client.db(dbName);
  const collection = database.collection(collectionName);
  await collection.insertOne(user);
  client.close();
};

// Đoạn mã xóa
const deleteUserFromDB = async (email, name, pass) => {
  const client = await connectToMongoDB();
  const database = client.db(dbName);
  const collection = database.collection(collectionName);
  await collection.deleteOne({ email, name, pass });
  client.close();
};

module.exports = {
  getUsersFromDB,
  addUserToDB,
  deleteUserFromDB,
};
