import type { IWebhookService } from './webhook.service.interface.js';
export declare class WebhookService implements IWebhookService {
    handleClerkWebhook(payload: any, headers: {
        'svix-id': string;
        'svix-timestamp': string;
        'svix-signature': string;
    }): Promise<any>;
    handleRazorpayWebhook(body: string, signature: string): Promise<any>;
}
//# sourceMappingURL=webhook.service.d.ts.map