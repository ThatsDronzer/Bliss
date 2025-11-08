import { handleClerkWebhookInDb, handleRazorpayWebhookInDb, } from '@repository/webhook/webhook.repository';
import { BadRequestError, DBConnectionError } from '@exceptions/core.exceptions';
import { sendSuccessResponse } from '@utils/Response.utils';
import { WEBHOOK_ERROR } from '@exceptions/errors';
export async function handleClerkWebhook(req, res, next) {
    try {
        const svixId = req.headers['svix-id'];
        const svixTimestamp = req.headers['svix-timestamp'];
        const svixSignature = req.headers['svix-signature'];
        if (!svixId || !svixTimestamp || !svixSignature) {
            throw new BadRequestError('Missing webhook headers');
        }
        const result = await handleClerkWebhookInDb(req.body, {
            'svix-id': svixId,
            'svix-timestamp': svixTimestamp,
            'svix-signature': svixSignature,
        });
        return sendSuccessResponse(res, result);
    }
    catch (error) {
        if (error instanceof DBConnectionError) {
            return next(error);
        }
        if (error instanceof Error) {
            if (error.message === 'Invalid webhook') {
                return next(new BadRequestError('Invalid webhook'));
            }
        }
        console.error('Error while handleClerkWebhook()', {
            error: error instanceof Error ? error.message : 'Unknown error',
            stack: error instanceof Error ? error.stack : undefined,
            data: { body: req.body },
        });
        next(new Error(WEBHOOK_ERROR.message));
    }
}
export async function handleRazorpayWebhook(req, res, next) {
    const signature = req.headers['x-razorpay-signature'];
    try {
        const rawBody = JSON.stringify(req.body);
        if (!signature) {
            throw new BadRequestError('Missing webhook signature');
        }
        const result = await handleRazorpayWebhookInDb(rawBody, signature);
        return sendSuccessResponse(res, result);
    }
    catch (error) {
        if (error instanceof DBConnectionError) {
            return next(error);
        }
        if (error instanceof Error) {
            if (error.message === 'Invalid signature') {
                return next(new BadRequestError('Invalid signature'));
            }
        }
        console.error('Error while handleRazorpayWebhook()', {
            error: error instanceof Error ? error.message : 'Unknown error',
            stack: error instanceof Error ? error.stack : undefined,
            data: { signature },
        });
        next(new Error(WEBHOOK_ERROR.message));
    }
}
export async function testRazorpayWebhook(req, res, next) {
    try {
        if (!process.env.RAZORPAY_WEBHOOK_SECRET) {
            return res.status(500).json({
                success: false,
                error: 'RAZORPAY_WEBHOOK_SECRET not configured in environment variables',
            });
        }
        const { event, payload, webhookUrl: customWebhookUrl } = req.body;
        const crypto = require('crypto');
        const timestamp = Math.floor(Date.now() / 1000);
        const testPayload = {
            event: event || 'payment.captured',
            payload: payload ||
                {
                    payment: {
                        entity: {
                            id: 'pay_test_' + Date.now(),
                            order_id: 'order_test_' + Date.now(),
                            amount: 1000,
                            currency: 'INR',
                            status: 'captured',
                        },
                    },
                },
        };
        const body = JSON.stringify(testPayload);
        const signature = crypto
            .createHmac('sha256', process.env.RAZORPAY_WEBHOOK_SECRET)
            .update(body)
            .digest('hex');
        return sendSuccessResponse(res, {
            testPayload,
            signature,
            headers: {
                'x-razorpay-signature': signature,
            },
            webhookUrl: customWebhookUrl || `${req.protocol}://${req.get('host')}/api/webhooks/razorpay`,
        });
    }
    catch (error) {
        next(error);
    }
}
export async function getWebhookTestConfig(req, res, next) {
    try {
        if (!process.env.RAZORPAY_WEBHOOK_SECRET) {
            return res.status(500).json({
                success: false,
                error: 'RAZORPAY_WEBHOOK_SECRET not configured',
            });
        }
        return sendSuccessResponse(res, {
            webhookUrl: `${req.protocol}://${req.get('host')}/api/webhooks/razorpay`,
            configured: true,
        });
    }
    catch (error) {
        next(error);
    }
}
//# sourceMappingURL=webhook.controller.js.map