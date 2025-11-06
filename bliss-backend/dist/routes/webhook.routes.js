import express from 'express';
import { handleClerkWebhook, handleRazorpayWebhook, testRazorpayWebhook, getWebhookTestConfig, } from '../controllers/webhook.controller.js';
const router = express.Router();
// POST /api/webhooks/clerk - Handle Clerk webhook
router.post('/clerk', handleClerkWebhook);
// POST /api/webhooks/razorpay - Handle Razorpay webhook
router.post('/razorpay', handleRazorpayWebhook);
// GET /api/webhooks/razorpay/test - Get webhook test configuration
router.get('/razorpay/test', getWebhookTestConfig);
// POST /api/webhooks/razorpay/test - Test Razorpay webhook
router.post('/razorpay/test', testRazorpayWebhook);
export default router;
//# sourceMappingURL=webhook.routes.js.map