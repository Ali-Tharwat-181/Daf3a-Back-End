import Booking from "../models/Booking.js";
import User from "../models/User.js";
import { createCheckoutSession } from "./payment.service.js";

// ✅ Get All Bookings
export const getAllBookings = async () => {
  return Booking.find().populate("mentor student");
};

// ✅ Get Booking by ID
export const getBookingById = async (id) => {
  return Booking.findById(id).populate("mentor student");
};

// ✅ Get Bookings by Mentor
export const getBookingsByMentorId = async (mentorId) => {
  return Booking.find({ mentor: mentorId }).populate("student");
};

// ✅ Create Free Booking
export const createFreeBooking = async ({ mentorId, date, slots, type, studentId }) => {
  const mentor = await User.findOne({ _id: mentorId, role: "mentor" });
  if (!mentor) throw new Error("Mentor not found");

  const dayAvailability = mentor.availability.find(av => av.day.toLowerCase() === date.toLowerCase());
  if (!dayAvailability) throw new Error(`No availability for ${date}`);

  const invalidSlots = slots.filter(s => !dayAvailability.slots.includes(s));
  if (invalidSlots.length > 0) throw new Error(`Invalid slots: ${invalidSlots.join(", ")}`);

  const booking = await Booking.create({
    mentor: mentor._id,
    student: studentId,
    date,
    timeSlot: slots,
    type,
    paymentStatus: "free",
    status: "confirmed"
  });

  // Remove booked slots
  dayAvailability.slots = dayAvailability.slots.filter(s => !slots.includes(s));
  await mentor.save();

  return booking;
};

// ✅ Create Paid Booking
export const createPaidBooking = async ({ mentorId, date, slots, type, studentId, amount }) => {
  const mentor = await User.findOne({ _id: mentorId, role: "mentor" });
  const student = await User.findOne({ _id: studentId, role: "student" });

  if (!mentor || !student) throw new Error("Mentor or Student not found");
  if (!student.stripeCustomerId) throw new Error("Student not connected to Stripe");
  if (!mentor.stripeAccountId) throw new Error("Mentor not connected to Stripe");

  const dayAvailability = mentor.availability.find(av => av.day.toLowerCase() === date.toLowerCase());
  if (!dayAvailability) throw new Error(`No availability for ${date}`);

  const invalidSlots = slots.filter(s => !dayAvailability.slots.includes(s));
  if (invalidSlots.length > 0) throw new Error(`Invalid slots: ${invalidSlots.join(", ")}`);

  // Create Stripe Checkout Session
  const sessionUrl = await createCheckoutSession({
    amount,
    customerId: student.stripeCustomerId,
    mentorStripeAccountId: mentor.stripeAccountId,
  });

  const booking = await Booking.create({
    mentor: mentor._id,
    student: student._id,
    date,
    timeSlot: slots,
    type,
    paymentStatus: "pending",
    status: "pending"
  });

  return { sessionUrl, booking };
};

// ✅ Update Booking
export const updateBooking = async (id, updates) => {
  return Booking.findByIdAndUpdate(id, updates, { new: true });
};

// ✅ Cancel Booking
export const cancelBooking = async (id) => {
  return Booking.findByIdAndUpdate(id, { status: "cancelled" }, { new: true });
};

// ✅ Confirm Booking
export const confirmBooking = async (id) => {
  return Booking.findByIdAndUpdate(id, { status: "confirmed" }, { new: true });
};
