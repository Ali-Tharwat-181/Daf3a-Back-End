import Booking from "../models/Booking.js";
import User from "../models/User.js";
import { stripe } from "../services/payment.service.js"; // Your configured Stripe instance

import dayjs from "dayjs";


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
export const createFreeBooking = async ({
  mentorId,
  date,
  slots,
  type,
  studentId,
}) => {
  const mentor = await User.findOne({ _id: mentorId, role: "mentor" });
  if (!mentor) throw new Error("Mentor not found");

  // 🔍 Find availability for the specific date
  const dayAvailability = mentor.availability.find((av) => av.date === date);
  if (!dayAvailability) throw new Error(`No availability found for ${date}`);

  // 🟨 Make sure each slot is { start, end } object
  const slotsArray = Array.isArray(slots) ? slots : [slots];

  // ❌ Validate that each slot exists in mentor's availability
  const invalidSlots = slotsArray.filter(
    (incomingSlot) =>
      !dayAvailability.slots.some(
        (availableSlot) =>
          availableSlot.start === incomingSlot.start &&
          availableSlot.end === incomingSlot.end
      )
  );

  if (invalidSlots.length > 0) {
    throw new Error(
      `Invalid slots: ${invalidSlots
        .map((s) => `${s.start} - ${s.end}`)
        .join(", ")}`
    );
  }

  // ✅ Save full slot objects into DB
  const booking = await Booking.create({
    mentor: mentor._id,
    student: studentId,
    date,
    timeSlot: slotsArray, // 👈 make sure this is array of { start, end }
    type,
    paymentStatus: "free",
    status: "confirmed",
  });

  // 🧹 Remove the booked slots from mentor's availability
  dayAvailability.slots = dayAvailability.slots.filter(
    (availableSlot) =>
      !slotsArray.some(
        (bookedSlot) =>
          bookedSlot.start === availableSlot.start &&
          bookedSlot.end === availableSlot.end
      )
  );

  // ❌ Remove the date if all slots are booked
  if (dayAvailability.slots.length === 0) {
    mentor.availability = mentor.availability.filter((a) => a.date !== date);
  }

  await mentor.save();

  return booking;
};

export const createPaidBooking = async ({
  mentorId,
  date,
  slots,
  type,
  studentId,
  amount,
  paymentIntentId,
}) => {
  const mentor = await User.findOne({ _id: mentorId, role: "mentor" });
  const student = await User.findOne({ _id: studentId, role: "student" });

  if (!mentor || !student) throw new Error("Mentor or Student not found");

  const dayAvailability = mentor.availability.find((av) => av.date === date);
  if (!dayAvailability) throw new Error(`No availability for ${date}`);

  const slotsArray = Array.isArray(slots) ? slots : [slots];

  const invalidSlots = slotsArray.filter(
    (incomingSlot) =>
      !dayAvailability.slots.some(
        (availableSlot) =>
          availableSlot.start === incomingSlot.start &&
          availableSlot.end === incomingSlot.end
      )
  );

  if (invalidSlots.length > 0) {
    throw new Error(
      `Invalid slots: ${invalidSlots
        .map((s) => `${s.start} - ${s.end}`)
        .join(", ")}`
    );
  }

  const booking = await Booking.create({
    mentor: mentor._id,
    student: studentId,
    date,
    timeSlot: slotsArray,
    type,
    paymentStatus: "paid",
    status: "confirmed",
    paymentIntentId: paymentIntentId, // ✅ Save the existing one, don’t create a new one
    amount: amount, // Store the amount for later use
  });

  // Remove booked slots
  dayAvailability.slots = dayAvailability.slots.filter(
    (availableSlot) =>
      !slotsArray.some(
        (bookedSlot) =>
          bookedSlot.start === availableSlot.start &&
          bookedSlot.end === availableSlot.end
      )
  );

  if (dayAvailability.slots.length === 0) {
    mentor.availability = mentor.availability.filter((a) => a.date !== date);
  }

  mentor.balance += amount;
  await mentor.save();

  return { booking };
};


// ✅ Update Booking
export const updateBooking = async (id, updates) => {
  return Booking.findByIdAndUpdate(id, updates, { new: true });
};

export const cancelBookingById = async (bookingId) => {
  const booking = await Booking.findById(bookingId);
  if (!booking) {
    throw new Error("Booking not found");
  }
  const mentor = await User.findById(booking.mentor);
  if (!mentor) throw new Error("Mentor not found");

  const now = dayjs();
  const sessionDateTime = dayjs(`${booking.date} ${booking.timeSlot[0].start}`);
  const hoursDiff = sessionDateTime.diff(now, "hour");

  if (hoursDiff >= 24) {
    if (booking.paymentIntentId && booking.paymentStatus === "paid") {
      const refund = await stripe.refunds.create({
        payment_intent: booking.paymentIntentId,
      });

      booking.paymentStatus = "refunded";
      booking.attendStatus = "cancelled";
      mentor.balance -= booking.amount || 0; // Deduct amount if paid

      await mentor.save();
      await booking.save();

      return {
        message: "Booking cancelled and refunded",
        refund,
      };
    }
  }

  booking.attendStatus = "cancelled";
  await booking.save();
  await mentor.save();

  return {
    message: "Booking cancelled but not eligible for refund",
  };
};


// ✅ Confirm Booking
export const confirmBooking = async (id) => {
  return Booking.findByIdAndUpdate(id, { status: "confirmed" }, { new: true });
};

export const confirmAttend = async (id) => {
  return Booking.findByIdAndUpdate(
    id,
    { attendStatus: "confirmed" },
    { new: true }
  );
};

export const getBookingsByStudentId = async (studentId) => {
  return Booking.find({ student: studentId }).populate("mentor");
};
