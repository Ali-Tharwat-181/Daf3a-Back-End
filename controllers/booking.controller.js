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
    return res.status(400).json({
      success: false,
      message: "All fields are required: mentorId, date, slots, type",
    });
  }

  try {
    const data = await bookingService.createFreeBooking({
      mentorId,
      date,
      slots,
      type,
      studentId: req.user._id,
    });

    res.status(201).json({
      success: true,
      data,
      message: "Free booking confirmed",
    });
  } catch (err) {
    console.error("❌ Error creating free booking:", err);
    next(err);
  }
};

export const createPaidBookingController = async (req, res, next) => {
  const { mentorId, date, slots, type, amount, paymentIntentId } = req.body;
  try {
    const { booking, clientSecret } = await bookingService.createPaidBooking({
      mentorId,
      date,
      slots,
      type,
      studentId: req.user._id,
      amount,
      paymentIntentId,
    });

    res.status(201).json({
      success: true,
      booking,
      clientSecret,
      message: "Booking created and payment successful",
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



export const cancelBookingController = async (req, res, next) => {
  try {
    const { bookingId } = req.params;
    const result = await bookingService.cancelBookingById(bookingId);

    res.status(200).json({
      success: true,
      ...result,
    });
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

export const confirmBookingAttendController = async (req, res, next) => {
  try {
    const data = await bookingService.confirmAttend(req.params.id);
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
