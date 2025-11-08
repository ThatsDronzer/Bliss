import express, { Router } from 'express';
import {
	getBookingStatus,
	cancelBooking,
} from '@controllers/booking/booking.controller';
import { authenticate } from '../../middlewares/auth.middleware.js';

const router: Router = express.Router();

router.get('/', authenticate, getBookingStatus);
router.patch('/:requestId', authenticate, cancelBooking);

export default router;

