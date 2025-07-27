// App entry point
import express from "express";
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
import workshopRouter from "./routes/workshop.routes.js";
import chatRouter from "./routes/chat.routes.js";
import messageRouter from "./routes/message.routes.js";
import aiRouter from "./routes/ai.routes.js";
import { multerErrorHandler } from "./middlewares/upload.js";
import oauthRouter from "./routes/auth.routes.js";
import reportRouter from "./routes/report.routes.js";
import videoRouter from "./routes/video.routes.js";
import paymentRouter from "./routes/payment.routes.js";

const app = express();

// Middleware
app.use(
  cors({
    origin: process.env.CLIENT_URL, // your frontend URL
    credentials: true,
  })
);
app.use(express.json());
app.use(morgan("dev"));

// Root endpoint
app.get("/", (req, res) => {
  res.json({
    message: "MentorMatch API is running!",
    version: "1.0.0",
    endpoints: {
      auth: "/api/auth",
      mentors: "/api/mentors",
      students: "/api/students",
      bookings: "/api/bookings",
      messages: "/api/messages",
      reviews: "/api/reviews",
      workshops: "/api/workshops",
      admin: "/api/admin",
      ai: "/api/ai",
      payments: "/api/payment",
    },
  });
});

// API root endpoint
app.get("/api", (req, res) => {
  res.json({
    message: "MentorMatch API",
    version: "1.0.0",
    status: "running",
    endpoints: {
      auth: "/api/auth",
      mentors: "/api/mentors",
      students: "/api/students",
      bookings: "/api/bookings",
      messages: "/api/messages",
      reviews: "/api/reviews",
      workshops: "/api/workshops",
      admin: "/api/admin",
      ai: "/api/ai",
      payments: "/api/payment",
    },
  });
});

// API routes
app.use("/api/mentors", mentorRouter);
app.use("/api/auth", authRouter);
app.use("/api/bookings", bookingRouter);
app.use("/api/students", studentRouter);
app.use("/api/users", userRouter);
app.use("/api/reviews", reviewRouter);
app.use("/api/admin", adminRouter);
app.use("/api/workshops", workshopRouter);
app.use("/api/messages", messageRouter);
app.use("/api/chats", chatRouter);
app.use("/api/ai", aiRouter);
app.use("/api/auth", oauthRouter); // mount OAuth routes
app.use("/api/reports", reportRouter); // mount OAuth routes
app.use("/api/video", videoRouter);
app.use("/api", paymentRouter);

// Multer error handler (for file upload errors)
app.use(multerErrorHandler);

// 404 handler
app.use((req, res, next) => {
  res.status(404).json({ success: false, message: "Endpoint not found" });
});

// Global error handler
app.use(errorHandler);

export default app;
