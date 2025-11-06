import express, { Router } from 'express';
import {
	createPayment,
	verifyPayment,
} from '@controllers/payment/payment.controller';

const router: Router = express.Router();

router.post('/create', createPayment);
router.post('/verify', verifyPayment);

export default router;

