// Booking model (placeholder)
import mongoose from "mongoose";

const BookingSchema = new mongoose.Schema(
  {
    mentor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Mentor",
    },
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true,
    },
    date: { type: String, required: true },
    timeSlot: [{ type: String, required: true }],
    type: { type: String, enum: ["online", "offline"], default: "online", required: true },
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "free"],
      default: "free",
    },
    status: { type: String, enum: ["pending", "confirmed", "cancelled"], default: "pending" },
    summary: String, // AI summary if exists
    review: { type: mongoose.Schema.Types.ObjectId, ref: "Review" },
  },
  { timestamps: true }
);

const Booking = mongoose.model("Booking", BookingSchema);
export default Booking;
