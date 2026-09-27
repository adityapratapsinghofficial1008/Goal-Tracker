const mongoose = require("mongoose");

let isMongoConnected = false;
let currentMongoUri = "";

const connectDB = async (customUri) => {
  const targetUri = customUri || process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/artdeco_goals";
  
  if (isMongoConnected && currentMongoUri === targetUri) {
    return true;
  }

  try {
    if (mongoose.connection.readyState !== 0) {
      await mongoose.disconnect();
    }
    await mongoose.connect(targetUri, { serverSelectionTimeoutMS: 4000 });
    isMongoConnected = true;
    currentMongoUri = targetUri;
    console.log("🏛️  Art Deco Server: Connected successfully to MongoDB");
    return true;
  } catch (err) {
    isMongoConnected = false;
    currentMongoUri = "";
    console.warn(
      "⚠️  MongoDB Connection Warning (Falling back to High-Performance Local JSON Engine):",
      err.message,
    );
    return false;
  }
};

const getIsMongoConnected = () => isMongoConnected;

module.exports = {
  connectDB,
  getIsMongoConnected,
};
