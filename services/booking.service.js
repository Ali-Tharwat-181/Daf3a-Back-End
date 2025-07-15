import Booking from '../models/Booking.js';
import Mentor from '../models/Mentor.js';

export const getAllBookings = async () => {
    return Booking.find().populate('mentor student review');
};

export const createBooking = async ({ mentorId, date, slots, type, student }) => {
    const mentor = await Mentor.findById(mentorId);
    console.log(mentor);
    if (!mentor) throw new Error("Mentor not found");

    const day = date; // "Monday"

    const dayAvailability = mentor.availability.find(avail => avail.day.toLowerCase() === day.toLowerCase());
    if (!dayAvailability) {
        throw new Error(`No availability found for ${day}`);
    }

    const invalidSlots = slots.filter(slot => !dayAvailability.slots.includes(slot));
    if (invalidSlots.length > 0) {
        throw new Error(`Invalid slots: ${invalidSlots.join(", ")}`);
    }

    const booking = new Booking({
        mentor,
        student,
        date: day,
        timeSlot: slots,
        type,
        paymentStatus: 'pending',
        status: 'pending'
    });

    return await booking.save();
};


export const confirmBooking = async (bookingId, mentorId) => {
    const booking = await Booking.findById(bookingId);
    if (!booking) throw new Error("Booking not found");

    if (booking.mentor.toString() !== mentorId.toString()) {
        throw new Error("Unauthorized: Only mentor can confirm this booking");
    }

    if (booking.status !== 'pending') throw new Error("Booking already confirmed or cancelled");

    booking.status = 'confirmed';
    await booking.save();

    // Remove booked slot from mentor availability
    const mentor = await Mentor.findById(mentorId);
    const day = new Date(booking.date).toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();

    const dayIndex = mentor.availability.findIndex(avail => avail.day.toLowerCase() === day);
    if (dayIndex !== -1) {
        mentor.availability[dayIndex].slots = mentor.availability[dayIndex].slots.filter(slot => slot !== booking.timeSlot);
        await mentor.save();
    }

    return booking;
};

export const cancelBooking = async (bookingId) => {
    const booking = await Booking.findByIdAndUpdate(bookingId, { status: 'cancelled' }, { new: true });
    return booking;
};

export const getBookingById = async (id) => {
    return Booking.findById(id).populate('mentor student review');
};

export const updateBooking = async (id, updates) => {
    return Booking.findByIdAndUpdate(id, updates, { new: true });
};
