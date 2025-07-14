import * as bookingService from "../services/booking.service.js";

function sendResponse(res, status, success, data, message) {
  return res.status(status).json({ success, data, message });
}

export const getAllBookings = async (req, res, next) => {
  try {
    if (!req.student) {
      return res.status(403).json({
        success: false,
        message: "Only students can view their bookings",
      });
    }

    const bookings = await bookingService.getAllBookings(req.student._id);
    return sendResponse(
      res,
      200,
      true,
      bookings,
      "Bookings fetched successfully"
    );
  } catch (error) {
    next(error);
  }
};

export const createNewBooking = async (req, res, next) => {
  try {
    // Ensure this is a student
    if (!req.student) {
      return res
        .status(403)
        .json({ success: false, message: "Only students can book mentors" });
    }

    const mentorId = req.params.mentorId;
    const studentId = req.student._id;

    const booking = await bookingService.createBooking(mentorId, studentId);

    return res.status(201).json({
      success: true,
      data: booking,
      message: "Booking created successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const getBookingById = async (req, res, next) => {
  try {
    const booking = await bookingService.getBookingById(
      req.params.id,
      req.student._id
    );
    return sendResponse(res, 200, true, booking, "Booking fetched");
  } catch (error) {
    next(error);
  }
};

export const updateBookingById = async (req, res, next) => {
  try {
    const booking = await bookingService.updateBooking(
      req.params.id,
      req.body,
      req.student._id
    );
    return sendResponse(res, 200, true, booking, "Booking updated");
  } catch (error) {
    next(error);
  }
};

export const cancelBookingById = async (req, res, next) => {
  try {
    const booking = await bookingService.cancelBooking(
      req.params.id,
      req.student._id
    );
    return sendResponse(res, 200, true, booking, "Booking cancelled");
  } catch (error) {
    next(error);
  }
};
