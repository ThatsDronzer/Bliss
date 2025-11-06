import express from 'express';
import { getBookingStatus, cancelBooking, createBookingMessage, getVendorBookingRequests, updateVendorBookingRequestStatus, } from '@controllers/booking/booking.controller';
import { authenticate, requireRole } from '../../middlewares/auth.middleware.js';
const router = express.Router();
router.get('/', authenticate, getBookingStatus);
router.patch('/:requestId', authenticate, cancelBooking);
router.post('/create', authenticate, createBookingMessage);
router.get('/vendor', authenticate, requireRole('vendor'), getVendorBookingRequests);
router.patch('/vendor/:requestId', authenticate, requireRole('vendor'), updateVendorBookingRequestStatus);
export default router;
//# sourceMappingURL=booking.router.js.map