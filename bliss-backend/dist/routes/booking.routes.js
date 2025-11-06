import express from 'express';
import { getBookingStatus, cancelBooking, } from '../controllers/booking.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';
const router = express.Router();
// GET /api/booking-status - Get booking status by service ID
router.get('/', authenticate, getBookingStatus);
// PATCH /api/booking-status/:requestId - Cancel booking
router.patch('/:requestId', authenticate, cancelBooking);
export default router;
//# sourceMappingURL=booking.routes.js.map