// Booking model (placeholder)
import mongoose from "mongoose";

const BookingSchema = new mongoose.Schema(
  {
    student: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    mentor: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    date: { type: String, required: true },
    timeSlot: [
      {
        start: { type: String, required: true },
        end: { type: String, required: true },
        _id: false,
      },
    ],
    type: {
      type: String,
      enum: ["online", "offline"],
      default: "online",
      required: true,
    },
    paymentStatus: {
      type: String,
      enum: ["paid", "free", "refunded"],
      default: "free",
    },
    status: {
      type: String,
      enum: ["confirmed", "cancelled"],
      default: "confirmed",
    },
    paymentIntentId: { type: String }, // Add this field
    attendStatus: {
      type: String,
      enum: ["confirmed", "cancelled", "pending"],
      default: "pending",
    },
    amount: { type: Number, default: 0 }, // Store the amount for paid bookings
    review: { type: mongoose.Schema.Types.ObjectId, ref: "Review" },
  },
  { timestamps: true },
);

const Booking = mongoose.model("Booking", BookingSchema);
export default Booking;
