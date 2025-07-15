import * as bookingService from '../services/booking.service.js';

export const getAllBookings = async (req, res, next) => {
    try {
        const bookings = await bookingService.getAllBookings();
        return res.status(200).json({ success: true, data: bookings });
    } catch (error) {
        next(error);
    }
};

export const createNewBooking = async (req, res, next) => {
    const { mentorId, date, slots, type } = req.body;

    if (!mentorId || !date || !slots || !type) {
        return res.status(400).json({
            success: false,
            message: 'Please provide mentorId, date (e.g., Monday), slots (array), and type.'
        });
    }

    try {
        const booking = await bookingService.createBooking({
            mentorId, date, slots, type, student: req.user._id
        });

        return res.status(201).json({
            success: true,
            data: booking,
            message: 'Booking created and waiting for mentor confirmation.'
        });
    } catch (error) {
        next(error);
    }
};


export const confirmBookingController = async (req, res, next) => {
    try {
        const booking = await bookingService.confirmBooking(req.params.id, req.user._id);
        return res.status(200).json({ success: true, data: booking, message: 'Booking confirmed' });
    } catch (error) {
        next(error);
    }
};

export const cancelBookingById = async (req, res, next) => {
    try {
        const booking = await bookingService.cancelBooking(req.params.id);
        return res.status(200).json({ success: true, data: booking, message: 'Booking cancelled' });
    } catch (error) {
        next(error);
    }
};

export const getBookingById = async (req, res, next) => {
    try {
        const booking = await bookingService.getBookingById(req.params.id);
        return res.status(200).json({ success: true, data: booking });
    } catch (error) {
        next(error);
    }
};

export const updateBookingById = async (req, res, next) => {
    try {
        const booking = await bookingService.updateBooking(req.params.id, req.body);
        return res.status(200).json({ success: true, data: booking, message: 'Booking updated' });
    } catch (error) {
        next(error);
    }
};
