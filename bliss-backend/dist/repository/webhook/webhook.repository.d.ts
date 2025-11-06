export declare function handleClerkWebhookInDb(payload: any, headers: {
    'svix-id': string;
    'svix-timestamp': string;
    'svix-signature': string;
}): Promise<any>;
export declare function handleRazorpayWebhookInDb(body: string, signature: string): Promise<any>;
//# sourceMappingURL=webhook.repository.d.ts.map