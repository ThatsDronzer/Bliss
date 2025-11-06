import express from 'express';
import { createBookingMessage, } from '@controllers/booking/booking.controller';
import { authenticate } from '../../middlewares/auth.middleware.js';
const router = express.Router();
router.post('/create', authenticate, createBookingMessage);
export default router;
//# sourceMappingURL=message.router.js.map