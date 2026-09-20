const mongoose = require("mongoose");

let isMongoConnected = false;

const connectDB = async () => {
  const MONGODB_URI =
    process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/artdeco_goals";
  try {
    await mongoose.connect(MONGODB_URI, { serverSelectionTimeoutMS: 3000 });
    isMongoConnected = true;
    console.log("🏛️  Art Deco Server: Connected successfully to MongoDB");
  } catch (err) {
    isMongoConnected = false;
    console.warn(
      "⚠️  MongoDB Connection Warning (Using High-Performance Local JSON Engine fallback):",
      err.message,
    );
  }
};

const getIsMongoConnected = () => isMongoConnected;

module.exports = {
  connectDB,
  getIsMongoConnected,
};
