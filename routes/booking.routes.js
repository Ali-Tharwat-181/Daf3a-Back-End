import express from "express";
import authMiddleware from "../middlewares/auth.js";
import {
  getAllBookings,
  createNewBooking,
  getBookingById,
  updateBookingById,
  cancelBookingById,
  confirmBookingController,
  getBookingsByMentor,
} from "../controllers/booking.controller.js";

const bookingRouter = express.Router();

bookingRouter.use(authMiddleware);

bookingRouter.get("/", getAllBookings);
bookingRouter.post("/", createNewBooking);
bookingRouter.get("/:id", getBookingById);
bookingRouter.patch("/:id", updateBookingById);

bookingRouter.get("/mentor/:mentorId", getBookingsByMentor);
bookingRouter.patch("/:id/cancel", cancelBookingById);

bookingRouter.patch("/:id/confirm", confirmBookingController);

export default bookingRouter;
