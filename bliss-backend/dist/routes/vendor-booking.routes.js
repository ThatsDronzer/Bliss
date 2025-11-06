import express from 'express';
import { getVendorBookingRequests, updateVendorBookingRequestStatus, } from '../controllers/booking.controller.js';
import { authenticate, requireRole } from '../middleware/auth.middleware.js';
const router = express.Router();
// GET /api/vendor/booking-requests - Get vendor booking requests
router.get('/', authenticate, requireRole('vendor'), getVendorBookingRequests);
// PATCH /api/vendor/booking-requests/:requestId - Update vendor booking request status
router.patch('/:requestId', authenticate, requireRole('vendor'), updateVendorBookingRequestStatus);
export default router;
//# sourceMappingURL=vendor-booking.routes.js.map