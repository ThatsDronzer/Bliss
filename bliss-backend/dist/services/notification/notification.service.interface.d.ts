export interface INotificationService {
    notifyCustomer(notificationData: {
        requestId: string;
        customerPhone: string;
        vendorName: string;
        status: string;
        customerName?: string;
    }): Promise<any>;
    notifyVendor(notificationData: {
        customerName: string;
        requestId: string;
    }): Promise<any>;
}
//# sourceMappingURL=notification.service.interface.d.ts.map