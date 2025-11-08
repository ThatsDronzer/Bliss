import express from 'express';
import { getVendorBookingRequests, updateVendorBookingRequestStatus, } from '@controllers/message/message.controller';
import { authenticate, requireRole } from '../../middlewares/auth.middleware.js';
const router = express.Router();
router.get('/', authenticate, requireRole('vendor'), getVendorBookingRequests);
router.patch('/:requestId', authenticate, requireRole('vendor'), updateVendorBookingRequestStatus);
export default router;
//# sourceMappingURL=vendor-booking.router.js.map