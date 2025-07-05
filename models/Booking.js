// Booking model (placeholder)
import mongoose from 'mongoose'
const Schema = mongoose.Schema;

const BookingSchema = new Schema({
    mentor: { type: Schema.Types.ObjectId, ref: "Mentor", required: true },
    student: { type: Schema.Types.ObjectId, ref: "Student", required: true },
    date: Date,
    timeSlot: String,
    type: { type: String, enum: ["online", "offline"] },
    paymentStatus: {
        type: String,
        enum: ["pending", "paid", "free"],
        default: "free",
    },
    summary: String, // AI summary if exists
    review: { type: Schema.Types.ObjectId, ref: "Review" },
});

const Booking = mongoose.model('Booking', BookingSchema);
export default Booking;
