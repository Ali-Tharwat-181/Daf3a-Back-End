import * as bookingService from "../services/booking.service.js";

export const getAllBookings = async (req, res, next) => {
  try {
    const data = await bookingService.getAllBookings();
    res.status(200).json({ success: true, data });
  } catch (err) {
    next(err);
  }
};

export const getBookingById = async (req, res, next) => {
  try {
    const data = await bookingService.getBookingById(req.params.id);
    res.status(200).json({ success: true, data });
  } catch (err) {
    next(err);
  }
};

export const getBookingsByMentor = async (req, res, next) => {
  try {
    const data = await bookingService.getBookingsByMentorId(
      req.params.mentorId
    );
    res.status(200).json({ success: true, data });
  } catch (err) {
    next(err);
  }
};

export const createFreeBookingController = async (req, res, next) => {
  const { mentorId, date, slots, type } = req.body;
  if (!mentorId || !date || !slots || !type) {
    console.log(req.body);
    console.log("Missing required fields for free booking:", {
      mentorId,
      date,
      slots,
      type,
    });
    return res
      .status(400)
      .json({ success: false, message: "All fields are required" });
  } else {
    console.log("Creating free booking with:", { mentorId, date, slots, type });
  }
  try {
    const data = await bookingService.createFreeBooking({
      mentorId,
      date,
      slots,
      type,
      studentId: req.user._id,
    });
    console.log("Free booking created successfully:", data);
    res
      .status(201)
      .json({ success: true, data: data, message: "Free booking confirmed" });
  } catch (err) {
    console.error("Error creating free booking:", err);
    next(err);
  }
};

export const createPaidBookingController = async (req, res, next) => {
  const { mentorId, date, slots, type, amount } = req.body;
  try {
    const { sessionUrl, booking } = await bookingService.createPaidBooking({
      mentorId,
      date,
      slots,
      type,
      studentId: req.user._id,
      amount,
    });
    res.status(201).json({
      success: true,
      sessionUrl,
      booking,
      message: "Complete payment via Stripe",
    });
  } catch (err) {
    next(err);
  }
};

export const updateBookingById = async (req, res, next) => {
  try {
    const data = await bookingService.updateBooking(req.params.id, req.body);
    res.status(200).json({ success: true, data });
  } catch (err) {
    next(err);
  }
};

export const cancelBookingById = async (req, res, next) => {
  try {
    const data = await bookingService.cancelBooking(req.params.id);
    res.status(200).json({ success: true, data, message: "Booking cancelled" });
  } catch (err) {
    next(err);
  }
};

export const confirmBookingController = async (req, res, next) => {
  try {
    const data = await bookingService.confirmBooking(req.params.id);
    res.status(200).json({ success: true, data, message: "Booking confirmed" });
  } catch (err) {
    next(err);
  }
};

export const getMyBookings = async (req, res, next) => {
  try {
    const data = await bookingService.getBookingsByStudentId(req.user._id);
    res.status(200).json({ success: true, data });
  } catch (err) {
    next(err);
  }
};
