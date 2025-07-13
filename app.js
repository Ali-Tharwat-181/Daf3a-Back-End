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
import messageRouter from "./routes/message.routes.js";



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
app.use("/api/workshops", workshopRouter);
app.use("/api/messages", messageRouter);


// 404 handler
app.use((req, res, next) => {
  res.status(404).json({ success: false, message: "Endpoint not found" });
});

// Global error handler
app.use(errorHandler);

export default app;