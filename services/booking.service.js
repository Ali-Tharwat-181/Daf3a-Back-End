import Booking from "../models/Booking.js";
import User from "../models/User.js";

export const getAllBookings = async () => {
  return Booking.find().populate("mentor student review");
};

export const createBooking = async ({
  mentorId,
  date,
  slots,
  type,
  student,
}) => {
  const mentor = await User.findOne({ _id: mentorId, role: "mentor" });
  if (!mentor) throw new Error("Mentor not found");

  const day = date; // "Monday"

  const dayAvailability = mentor.availability.find(
    (avail) => avail.day.toLowerCase() === day.toLowerCase()
  );
  if (!dayAvailability) {
    throw new Error(`No availability found for ${day}`);
  }

  const invalidSlots = slots.filter(
    (slot) => !dayAvailability.slots.includes(slot)
  );
  if (invalidSlots.length > 0) {
    throw new Error(`Invalid slots: ${invalidSlots.join(", ")}`);
  }

  const booking = new Booking({
    mentor: mentor._id,
    student,
    date: day,
    timeSlot: slots,
    type,
    paymentStatus: "pending",
    status: "pending",
  });

  return await booking.save();
};

export const confirmBooking = async (bookingId, userId) => {
  const booking = await Booking.findById(bookingId);
  if (!booking) throw new Error("Booking not found");

  // Find mentor by userId
  const mentor = await User.findOne({ _id: userId, role: "mentor" });
  if (!mentor) throw new Error("Mentor not found for this user");

  // Check authorization
  if (booking.mentor.toString() !== mentor._id.toString()) {
    throw new Error("Unauthorized: You are not the mentor for this booking");
  }

  if (booking.status !== "pending")
    throw new Error("Booking already confirmed or cancelled");

  // Confirm booking
  booking.status = "confirmed";
  await booking.save();

  // Remove booked slot from availability
  const day = booking.date.toLowerCase();
  const dayAvailability = mentor.availability.find(
    (avail) => avail.day.toLowerCase() === day
  );
  if (dayAvailability) {
    dayAvailability.slots = dayAvailability.slots.filter(
      (slot) => !booking.timeSlot.includes(slot)
    );
  }

  await mentor.save();

  return booking;
};

export const cancelBooking = async (bookingId) => {
  const booking = await Booking.findByIdAndUpdate(
    bookingId,
    { status: "cancelled" },
    { new: true }
  );
  return booking;
};

export const getBookingById = async (id) => {
  return Booking.findById(id).populate("mentor student review");
};

export const getBookingsByMentorId = async (mentorId) => {
  return Booking.find({ mentor: mentorId }).populate("student review");
};

export const updateBooking = async (id, updates) => {
  return Booking.findByIdAndUpdate(id, updates, { new: true });
};
