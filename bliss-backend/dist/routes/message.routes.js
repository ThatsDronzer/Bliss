import express from 'express';
import { createBookingMessage } from '../controllers/booking.controller.js';
const router = express.Router();
// POST /api/message-create - Create booking message
router.post('/create', createBookingMessage);
export default router;
//# sourceMappingURL=message.routes.js.map