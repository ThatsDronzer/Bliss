export interface IWebhookService {
    handleClerkWebhook(payload: any, headers: {
        'svix-id': string;
        'svix-timestamp': string;
        'svix-signature': string;
    }): Promise<any>;
    handleRazorpayWebhook(body: string, signature: string): Promise<any>;
}
//# sourceMappingURL=webhook.service.interface.d.ts.map