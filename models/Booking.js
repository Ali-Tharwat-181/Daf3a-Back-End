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
        _id: false
      }
    ],
    type: {
      type: String,
      enum: ["online", "offline"],
      default: "online",
      required: true,
    },
    paymentStatus: {
      type: String,
      enum: ["paid", "free"],
      default: "free",
    },
    status: {
      type: String,
      enum: ["confirmed", "cancelled"],
      default: "confirmed",
    },
    review: { type: mongoose.Schema.Types.ObjectId, ref: "Review" },
  },
  { timestamps: true }
);

const Booking = mongoose.model("Booking", BookingSchema);
export default Booking;
