const { MongoClient } = require("mongodb");

let client;
let db;

const connectDB = async () => {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error("MONGO_URI environment variable is not defined");
    }
    if (!process.env.DB_NAME) {
      throw new Error("DB_NAME environment variable is not defined");
    }

    client = new MongoClient(process.env.MONGO_URI);
    await client.connect();
    db = client.db(process.env.DB_NAME);

    console.log(`Connected to MongoDB database: ${process.env.DB_NAME}`);
    return db;
  } catch (error) {
    console.error("Failed to connect to MongoDB:", error.message);
    process.exit(1);
  }
};

const getDB = () => {
  if (!db) {
    throw new Error("Database not initialized. Call connectDB first.");
  }
  return db;
};

const closeDB = async () => {
  if (client) {
    await client.close();
    console.log("MongoDB connection closed");
  }
};

module.exports = {
  connectDB,
  getDB,
  closeDB,
};
