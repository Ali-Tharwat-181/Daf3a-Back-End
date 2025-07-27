import app from "../../app.js";
import connectDB from "../../config/db.js";
import dotenv from "dotenv";

dotenv.config();

// Connect to database
const MONGO_URI = process.env.MONGO_URI;
if (MONGO_URI) {
  // Connect to database asynchronously
  connectDB(MONGO_URI).catch((error) => {
    console.error("Database connection error:", error);
  });
}

// Export the Express app as a serverless function
export default app;
