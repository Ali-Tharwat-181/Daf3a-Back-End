import express from "express";
import authMiddleware from "../middlewares/auth.js";
import {
  getAllBookings,
  getBookingById,
  updateBookingById,
  confirmBookingController,
  getBookingsByMentor,
  createPaidBookingController,
  createFreeBookingController,
  confirmBookingAttendController,
  getMyBookings,
  cancelBookingController,
} from "../controllers/booking.controller.js";

const bookingRouter = express.Router();

bookingRouter.use(authMiddleware);

bookingRouter.get("/", getAllBookings);
// bookingRouter.post("/", createNewBooking);
bookingRouter.post("/free", createFreeBookingController);
bookingRouter.post("/paid", createPaidBookingController);
bookingRouter.get("/:id", getBookingById);
bookingRouter.patch("/:id", updateBookingById);

bookingRouter.get("/mentor/:mentorId", getBookingsByMentor);
bookingRouter.get("/me/student", getMyBookings);

bookingRouter.post("/cancel/:bookingId", cancelBookingController);

bookingRouter.patch("/:id/confirm", confirmBookingController);

bookingRouter.patch("/:id/confirmattend", confirmBookingAttendController);

export default bookingRouter;
