import express, { Router } from 'express';
import {
	handleClerkWebhook,
	handleRazorpayWebhook,
	testRazorpayWebhook,
	getWebhookTestConfig,
} from '@controllers/webhook/webhook.controller';

const router: Router = express.Router();

router.post('/clerk', handleClerkWebhook);
router.post('/razorpay', handleRazorpayWebhook);
router.get('/razorpay/test', getWebhookTestConfig);
router.post('/razorpay/test', testRazorpayWebhook);

export default router;

