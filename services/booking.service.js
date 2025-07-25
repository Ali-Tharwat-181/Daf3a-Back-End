import Booking from "../models/Booking.js";
import User from "../models/User.js";
// import { createCheckoutSession } from "./payment.service.js";
// ✅ Create Paid Booking
import Stripe from "stripe";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY); // Make sure this is your test secret key

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
}) => {
  const mentor = await User.findOne({ _id: mentorId, role: "mentor" });
  const student = await User.findOne({ _id: studentId, role: "student" });

  if (!mentor || !student) throw new Error("Mentor or Student not found");
  if (!student.stripeCustomerId)
    throw new Error("Student not connected to Stripe");
  if (!mentor.stripeAccountId)
    throw new Error("Mentor not connected to Stripe");

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

  // ✅ Create PaymentIntent with transfer to mentor
  const paymentIntent = await stripe.paymentIntents.create({
    amount: Math.round(amount * 100), // in cents
    currency: "usd",
    customer: student.stripeCustomerId,
    automatic_payment_methods: { enabled: true },
    transfer_data: {
      destination: mentor.stripeAccountId,
    },
  });

  // Booking is created only after payment confirmation on frontend
  const booking = await Booking.create({
    mentor: mentor._id,
    student: studentId,
    date,
    timeSlot: slotsArray,
    type,
    paymentStatus: "paid",
    status: "confirmed",
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

  await mentor.save();

  return {
    clientSecret: paymentIntent.client_secret, // Needed on frontend
    booking,
  };
};

// ✅ Update Booking
export const updateBooking = async (id, updates) => {
  return Booking.findByIdAndUpdate(id, updates, { new: true });
};

// ✅ Cancel Booking
export const cancelBooking = async (id) => {
  return Booking.findByIdAndUpdate(
    id,
    { attendStatus: "cancelled" },
    { new: true }
  );
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
