import { Request, Response, NextFunction } from 'express';
/**
 * POST /api/webhooks/clerk
 * Handle Clerk webhook
 */
export declare const handleClerkWebhook: (req: Request, res: Response, next: NextFunction) => Promise<void>;
/**
 * POST /api/webhooks/razorpay
 * Handle Razorpay webhook
 */
export declare const handleRazorpayWebhook: (req: Request, res: Response, next: NextFunction) => Promise<void>;
/**
 * POST /api/webhooks/razorpay/test
 * Test Razorpay webhook
 */
export declare const testRazorpayWebhook: (req: Request, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>> | undefined>;
/**
 * GET /api/webhooks/razorpay/test
 * Get webhook test configuration
 */
export declare const getWebhookTestConfig: (req: Request, res: Response, next: NextFunction) => Promise<void>;
//# sourceMappingURL=webhook.controller.d.ts.map