import { handleClerkWebhookInDb, handleRazorpayWebhookInDb, } from '@repository/webhook/webhook.repository';
import { DBConnectionError } from '@exceptions/core.exceptions';
import { WEBHOOK_ERROR } from '@exceptions/errors';
export class WebhookService {
    async handleClerkWebhook(payload, headers) {
        try {
            return await handleClerkWebhookInDb(payload, headers);
        }
        catch (error) {
            if (error instanceof DBConnectionError)
                throw error;
            throw new Error(WEBHOOK_ERROR.message);
        }
    }
    async handleRazorpayWebhook(body, signature) {
        try {
            return await handleRazorpayWebhookInDb(body, signature);
        }
        catch (error) {
            if (error instanceof DBConnectionError)
                throw error;
            throw new Error(WEBHOOK_ERROR.message);
        }
    }
}
//# sourceMappingURL=webhook.service.js.map