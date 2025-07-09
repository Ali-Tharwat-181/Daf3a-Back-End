import Booking from '../models/Booking.js';

export const getAllBookings = async () => {
    return await Booking.find().populate('mentor student review');
};

export const createBooking = async (data) => {
    const newBooking = new Booking(data);
    return await newBooking.save();
};

export const getBookingById = async (id) => {
    return await Booking.findById(id).populate('mentor student review');
};

export const updateBooking = async (id, updates) => {
    return await Booking.findByIdAndUpdate(id, updates, { new: true });
};

export const cancelBooking = async (id) => {
    return await Booking.findByIdAndUpdate(id, { status: 'cancelled' }, { new: true });
};
