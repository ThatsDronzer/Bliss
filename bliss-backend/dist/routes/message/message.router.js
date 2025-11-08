import express from 'express';
import { createBookingMessage, getVendorBookingRequests, updateVendorBookingRequestStatus, getUserBookingRequests, } from '@controllers/message/message.controller';
import { authenticate, requireRole } from '../../middlewares/auth.middleware.js';
const router = express.Router();
router.post('/create', authenticate, createBookingMessage);
router.get('/vendor', authenticate, requireRole('vendor'), getVendorBookingRequests);
router.patch('/vendor/:requestId', authenticate, requireRole('vendor'), updateVendorBookingRequestStatus);
router.get('/user', authenticate, getUserBookingRequests);
export default router;
//# sourceMappingURL=message.router.js.map