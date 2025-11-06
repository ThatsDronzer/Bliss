import express from 'express';
import { createPayment, verifyPayment } from '../controllers/payment.controller.js';
const router = express.Router();
// POST /api/payments/create - Create payment order
router.post('/create', createPayment);
// POST /api/payments/verify - Verify payment
router.post('/verify', verifyPayment);
export default router;
//# sourceMappingURL=payment.routes.js.map