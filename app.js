// App entry point
import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import morgan from "morgan";

// Import routes here (example):
import mentorRouter from "./routes/mentor.routes.js";
import authRouter from "./routes/auth.routes.js";
import bookingRouter from "./routes/booking.routes.js";
import errorHandler from "./middleware/errorHandler.js";

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// API routes
app.use("/api/mentors", mentorRouter);
app.use("/api/auth", authRouter);
app.use("/api/bookings", bookingRouter);

// 404 handler
app.use((req, res, next) => {
  res.status(404).json({ success: false, message: "Endpoint not found" });
});

// Global error handler
app.use(errorHandler);

// Connect to MongoDB and start server
const PORT = process.env.PORT || 5000;
const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://localhost:27017/graduation_project";

mongoose
  .connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });
