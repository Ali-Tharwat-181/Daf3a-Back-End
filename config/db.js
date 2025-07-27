import mongoose from "mongoose";

const connectDB = async (MONGO_URI) => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log(`MongoDB connected `);
  } catch (err) {
    console.error("MongoDB connection error:", err);
    // Don't exit in serverless environment
    // process.exit(1);
  }
};

export default connectDB;
