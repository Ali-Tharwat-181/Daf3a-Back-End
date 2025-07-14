import Booking from "../models/Booking.js";
import Mentor from "../models/Mentor.js";

//  Create a new booking
export const createBooking = async (mentorId, studentId) => {
  const mentor = await Mentor.findById(mentorId);

  if (!mentor) throw new Error("mentor not found");

  const existingBooking = await Booking.findOne({
    student: studentId,
    mentor: mentorId,
  });
  if (existingBooking) {
    throw new Error("You already booked this mentor");
  }
  const newBooking = new Booking({ mentor: mentorId, student: studentId });

  await newBooking.save();

  return newBooking;
};

//  Get all bookings by a student
export const getAllBookings = async (studentId) => {
  return await Booking.find({ student: studentId }).populate("mentor  review");
};

//  Get a single booking (student can only access their own)
export const getBookingById = async (id, studentId) => {
  const booking = await Booking.findById(id).populate("mentor  review");
  if (!booking) throw new Error("Booking not found");

  if (booking.student.toString() !== studentId.toString()) {
    throw new Error("Unauthorized: You can only access your own bookings");
  }

  return booking;
};

// Update booking (only by the student who created it)
export const updateBooking = async (id, updates, studentId) => {
  const booking = await Booking.findById(id);
  if (!booking) throw new Error("Booking not found");

  if (booking.student.toString() !== studentId.toString()) {
    throw new Error("Unauthorized: You can only update your own bookings");
  }

  Object.assign(booking, updates);
  await booking.save();
  return booking;
};

//  Cancel booking (only by the student who created it)
export const cancelBooking = async (id, studentId) => {
  const booking = await Booking.findById(id);
  if (!booking) throw new Error("Booking not found");

  if (booking.student.toString() !== studentId.toString()) {
    throw new Error("Unauthorized: You can only cancel your own bookings");
  }

  booking.status = "cancelled";
  await booking.save();
  return booking;
};
