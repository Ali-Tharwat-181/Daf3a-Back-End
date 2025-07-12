// App entry point
import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import morgan from "morgan";

// Import routes here
import mentorRouter from "./routes/mentor.routes.js";
import authRouter from "./routes/auth.routes.js";
import bookingRouter from "./routes/booking.routes.js";
import errorHandler from "./middlewares/errorHandler.js";
import studentRouter from "./routes/student.routes.js";
import userRouter from "./routes/user.routes.js";
import reviewRouter from "./routes/review.routes.js";
import adminRouter from "./routes/admin.routes.js";
import connectDB from "./config/db.js";

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
app.use("/api/students", studentRouter);
app.use("/api/users", userRouter);
app.use("/api/reviews", reviewRouter);
app.use("/api/admin", adminRouter);

app.get("/", (req, res) => {
  res.json({ message: "Server is Runing" });
});

// 404 handler
app.use((req, res, next) => {
  res.status(404).json({ success: false, message: "Endpoint not found" });
});

// Global error handler
app.use(errorHandler);
// Connect to MongoDB and start server
const PORT = process.env.PORT || 5000;
const MONGO_URI =
  process.env.MONGO_URI || "mongodb://localhost:27017/graduation_project";

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  });

export default app;
