import type { Request, Response, NextFunction } from 'express';
import { WebhookService } from '@services/webhook/webhook.service';
import { BadRequestError } from '@exceptions/core.exceptions';
import { sendSuccessResponse } from '@utils/Response.utils';

const webhookService = new WebhookService();

export async function handleClerkWebhook(req: Request, res: Response, next: NextFunction) {
	try {
		const svixId = req.headers['svix-id'] as string;
		const svixTimestamp = req.headers['svix-timestamp'] as string;
		const svixSignature = req.headers['svix-signature'] as string;

		if (!svixId || !svixTimestamp || !svixSignature) {
			throw new BadRequestError('Missing webhook headers');
		}

		const result = await webhookService.handleClerkWebhook(req.body, {
			'svix-id': svixId,
			'svix-timestamp': svixTimestamp,
			'svix-signature': svixSignature,
		});

		return sendSuccessResponse(res, result);
	} catch (error) {
		if (error instanceof Error) {
			if (error.message === 'Invalid webhook') {
				return next(new BadRequestError('Invalid webhook'));
			}
		}
		next(error);
	}
}

export async function handleRazorpayWebhook(req: Request, res: Response, next: NextFunction) {
	try {
		const rawBody = JSON.stringify(req.body);
		const signature = req.headers['x-razorpay-signature'] as string;

		if (!signature) {
			throw new BadRequestError('Missing webhook signature');
		}

		const result = await webhookService.handleRazorpayWebhook(rawBody, signature);
		return sendSuccessResponse(res, result);
	} catch (error) {
		if (error instanceof Error) {
			if (error.message === 'Invalid signature') {
				return next(new BadRequestError('Invalid signature'));
			}
		}
		next(error);
	}
}

export async function testRazorpayWebhook(req: Request, res: Response, next: NextFunction) {
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
			payload:
				payload ||
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
	} catch (error) {
		next(error);
	}
}

export async function getWebhookTestConfig(req: Request, res: Response, next: NextFunction) {
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
	} catch (error) {
		next(error);
	}
}

