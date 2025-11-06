import type { IWebhookService } from './webhook.service.interface.js';
import {
	handleClerkWebhookInDb,
	handleRazorpayWebhookInDb,
} from '@repository/webhook/webhook.repository';
import { DBConnectionError } from '@exceptions/core.exceptions';
import { WEBHOOK_ERROR } from '@exceptions/errors';

export class WebhookService implements IWebhookService {
	async handleClerkWebhook(
		payload: any,
		headers: {
			'svix-id': string;
			'svix-timestamp': string;
			'svix-signature': string;
		}
	): Promise<any> {
		try {
			return await handleClerkWebhookInDb(payload, headers);
		} catch (error) {
			if (error instanceof DBConnectionError) throw error;
			throw new Error(WEBHOOK_ERROR.message);
		}
	}

	async handleRazorpayWebhook(body: string, signature: string): Promise<any> {
		try {
			return await handleRazorpayWebhookInDb(body, signature);
		} catch (error) {
			if (error instanceof DBConnectionError) throw error;
			throw new Error(WEBHOOK_ERROR.message);
		}
	}
}

