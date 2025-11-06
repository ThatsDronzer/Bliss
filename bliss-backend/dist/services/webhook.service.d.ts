export declare class WebhookService {
    /**
     * Handle Clerk webhook
     */
    handleClerkWebhook(payload: any, headers: {
        'svix-id': string;
        'svix-timestamp': string;
        'svix-signature': string;
    }): Promise<{
        success: boolean;
    } | undefined>;
    /**
     * Handle Razorpay webhook
     */
    handleRazorpayWebhook(body: string, signature: string): Promise<{
        success: boolean;
        message: string;
    }>;
    private handlePaymentCaptured;
    private handlePaymentFailed;
    private handlePaymentDisputed;
    private handleRefundCreated;
}
//# sourceMappingURL=webhook.service.d.ts.map