import express from 'express';
import {
    getAllBookings,
    createNewBooking,
    getBookingById,
    updateBookingById,
    cancelBookingById,
} from '../controllers/booking.controller.js';
import authMiddleware from '../middlewares/auth.js';


const bookingRouter = express.Router();

bookingRouter.use(authMiddleware);

bookingRouter.get('/', getAllBookings);
bookingRouter.post('/', createNewBooking);
bookingRouter.get('/:id', getBookingById);
bookingRouter.patch('/:id', updateBookingById);
bookingRouter.patch('/:id/cancel', cancelBookingById);

export default bookingRouter;
