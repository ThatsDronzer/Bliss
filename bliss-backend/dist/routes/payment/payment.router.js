import express from 'express';
import { createPayment, verifyPayment, } from '@controllers/payment/payment.controller';
const router = express.Router();
router.post('/create', createPayment);
router.post('/verify', verifyPayment);
export default router;
//# sourceMappingURL=payment.router.js.map