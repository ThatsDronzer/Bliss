import { Request, Response, NextFunction } from 'express';
import { WebhookService } from '../services/webhook.service.js';
import { AppError } from '../middleware/error.middleware.js';

const webhookService = new WebhookService();

/**
 * POST /api/webhooks/clerk
 * Handle Clerk webhook
 */
export const handleClerkWebhook = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const svixId = req.headers['svix-id'] as string;
    const svixTimestamp = req.headers['svix-timestamp'] as string;
    const svixSignature = req.headers['svix-signature'] as string;

    if (!svixId || !svixTimestamp || !svixSignature) {
      throw new AppError('Missing webhook headers', 400);
    }

    const result = await webhookService.handleClerkWebhook(req.body, {
      'svix-id': svixId,
      'svix-timestamp': svixTimestamp,
      'svix-signature': svixSignature,
    });

    res.json(result);
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === 'Invalid webhook') {
        return next(new AppError('Invalid webhook', 400));
      }
    }
    next(error);
  }
};

/**
 * POST /api/webhooks/razorpay
 * Handle Razorpay webhook
 */
export const handleRazorpayWebhook = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Get raw body for signature verification
    const rawBody = JSON.stringify(req.body);
    const signature = req.headers['x-razorpay-signature'] as string;

    if (!signature) {
      throw new AppError('Missing webhook signature', 400);
    }

    const result = await webhookService.handleRazorpayWebhook(rawBody, signature);
    res.json(result);
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === 'Invalid signature') {
        return next(new AppError('Invalid signature', 400));
      }
    }
    next(error);
  }
};

/**
 * POST /api/webhooks/razorpay/test
 * Test Razorpay webhook
 */
export const testRazorpayWebhook = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
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
              amount: 1000000,
              currency: 'INR',
              status: 'captured',
              method: 'card',
              created_at: timestamp,
              captured_at: timestamp,
            },
          },
        },
      created_at: timestamp,
    };

    const body = JSON.stringify(testPayload);
    const signature = crypto
      .createHmac('sha256', process.env.RAZORPAY_WEBHOOK_SECRET)
      .update(body)
      .digest('hex');

    const baseUrl =
      process.env.NEXT_PUBLIC_APP_URL ||
      process.env.CORS_ORIGIN ||
      'http://localhost:3000';
    const targetWebhookUrl = customWebhookUrl || `${baseUrl}/api/webhooks/razorpay`;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    try {
      const response = await fetch(targetWebhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-razorpay-signature': signature,
          'user-agent': 'Razorpay-Webhook-Test/1.0',
        },
        body: body,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      let result;
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        result = await response.json();
      } else {
        result = { text: await response.text() };
      }

      res.json({
        success: response.status === 200,
        statusCode: response.status,
        testPayload: {
          event: testPayload.event,
          paymentId: testPayload.payload.payment.entity.id,
          orderId: testPayload.payload.payment.entity.order_id,
          amount: testPayload.payload.payment.entity.amount,
        },
        webhookResponse: result,
        signatureValid: true,
        targetUrl: targetWebhookUrl,
      });
    } catch (fetchError: any) {
      clearTimeout(timeoutId);

      if (fetchError.name === 'AbortError') {
        return res.status(408).json({
          success: false,
          error: 'Webhook request timed out after 10 seconds',
          targetUrl: targetWebhookUrl,
        });
      }

      throw fetchError;
    }
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/webhooks/razorpay/test
 * Get webhook test configuration
 */
export const getWebhookTestConfig = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const secretConfigured = !!process.env.RAZORPAY_WEBHOOK_SECRET;
    const appUrlConfigured = !!process.env.NEXT_PUBLIC_APP_URL;

    const baseUrl =
      process.env.NEXT_PUBLIC_APP_URL ||
      process.env.CORS_ORIGIN ||
      'http://localhost:5000';

    res.json({
      message: 'Webhook test endpoint is ready',
      environment: process.env.NODE_ENV,
      configurations: {
        secretConfigured,
        secretLength: secretConfigured
          ? process.env.RAZORPAY_WEBHOOK_SECRET!.length
          : 0,
        appUrlConfigured,
        appUrl: process.env.NEXT_PUBLIC_APP_URL || 'Not configured',
        currentBaseUrl: baseUrl,
      },
      endpoints: {
        mainWebhook: `${baseUrl}/api/webhooks/razorpay`,
        thisTestEndpoint: `${baseUrl}/api/webhooks/razorpay/test`,
      },
    });
  } catch (error) {
    next(error);
  }
};

