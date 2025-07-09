import * as bookingService from '../services/booking.service.js';


export const getAllBookings = async (req, res, next) => {
    try {
        const bookings = await bookingService.getAllBookings();
        return (res, 200, true, bookings, 'Bookings fetched successfully');
    } catch (error) {
        next(error);
    }
};

export const createNewBooking = async (req, res, next) => {
    try {
        const booking = await bookingService.createBooking(req.body);
        return sendResponse(res, 201, true, booking, 'Booking created successfully');
    } catch (error) {
        next(error);
    }
};

export const getBookingById = async (req, res, next) => {
    try {
        const booking = await bookingService.getBookingById(req.params.id);
        return sendResponse(res, 200, true, booking, 'Booking fetched');
    } catch (error) {
        next(error);
    }
};

export const updateBookingById = async (req, res, next) => {
    try {
        const booking = await bookingService.updateBooking(req.params.id, req.body);
        return sendResponse(res, 200, true, booking, 'Booking updated');
    } catch (error) {
        next(error);
    }
};

export const cancelBookingById = async (req, res, next) => {
    try {
        const booking = await bookingService.cancelBooking(req.params.id);
        return sendResponse(res, 200, true, booking, 'Booking cancelled');
    } catch (error) {
        next(error);
    }
};