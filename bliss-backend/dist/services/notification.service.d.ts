export declare class NotificationService {
    /**
     * Send customer notification
     */
    notifyCustomer(notificationData: {
        requestId: string;
        customerPhone: string;
        vendorName: string;
        status: string;
        customerName?: string;
    }): Promise<{
        success: boolean;
        sid: string;
    }>;
    /**
     * Send vendor notification
     */
    notifyVendor(notificationData: {
        customerName: string;
        requestId: string;
    }): Promise<{
        success: boolean;
        sid: string;
    }>;
}
//# sourceMappingURL=notification.service.d.ts.map