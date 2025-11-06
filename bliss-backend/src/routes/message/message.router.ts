import express, { Router } from 'express';
import {
	createBookingMessage,
} from '@controllers/booking/booking.controller';
import { authenticate } from '../../middlewares/auth.middleware.js';

const router: Router = express.Router();

router.post('/create', authenticate, createBookingMessage);

export default router;

