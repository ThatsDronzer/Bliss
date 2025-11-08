import express, { Router, Request, Response, NextFunction } from 'express';
import {
	handleClerkWebhook,
	handleRazorpayWebhook,
	testRazorpayWebhook,
	getWebhookTestConfig,
} from '@controllers/webhook/webhook.controller';
import { BadRequestError, DBConnectionError } from '@exceptions/core.exceptions';
import { sendSuccessResponse, sendErrorResponse } from '@utils/Response.utils';

const router: Router = express.Router();

router.post('/clerk', async (req: Request, res: Response, next: NextFunction) => {
	try {
		await handleClerkWebhook(req, res, next);
	} catch (error) {
		if (error instanceof BadRequestError || error instanceof DBConnectionError) {
			return sendErrorResponse(res, error);
		}
		console.error('Error in /clerk webhook route', {
			error: error instanceof Error ? error.message : 'Unknown error',
			stack: error instanceof Error ? error.stack : undefined,
			data: {},
		});
		next(error);
	}
});

router.post('/razorpay', async (req: Request, res: Response, next: NextFunction) => {
	try {
		await handleRazorpayWebhook(req, res, next);
	} catch (error) {
		if (error instanceof BadRequestError || error instanceof DBConnectionError) {
			return sendErrorResponse(res, error);
		}
		console.error('Error in /razorpay webhook route', {
			error: error instanceof Error ? error.message : 'Unknown error',
			stack: error instanceof Error ? error.stack : undefined,
			data: {},
		});
		next(error);
	}
});

router.get('/razorpay/test', async (req: Request, res: Response, next: NextFunction) => {
	try {
		await getWebhookTestConfig(req, res, next);
	} catch (error) {
		if (error instanceof BadRequestError || error instanceof DBConnectionError) {
			return sendErrorResponse(res, error);
		}
		console.error('Error in /razorpay/test GET route', {
			error: error instanceof Error ? error.message : 'Unknown error',
			stack: error instanceof Error ? error.stack : undefined,
			data: {},
		});
		next(error);
	}
});

router.post('/razorpay/test', async (req: Request, res: Response, next: NextFunction) => {
	try {
		await testRazorpayWebhook(req, res, next);
	} catch (error) {
		if (error instanceof BadRequestError || error instanceof DBConnectionError) {
			return sendErrorResponse(res, error);
		}
		console.error('Error in /razorpay/test POST route', {
			error: error instanceof Error ? error.message : 'Unknown error',
			stack: error instanceof Error ? error.stack : undefined,
			data: {},
		});
		next(error);
	}
});

export default router;

