import express, { Router } from 'express';
import {
	getVendorBookingRequests,
	updateVendorBookingRequestStatus,
} from '@controllers/booking/booking.controller';
import { authenticate, requireRole } from '../../middlewares/auth.middleware.js';

const router: Router = express.Router();

router.get('/', authenticate, requireRole('vendor'), getVendorBookingRequests);
router.patch('/:requestId', authenticate, requireRole('vendor'), updateVendorBookingRequestStatus);

export default router;

