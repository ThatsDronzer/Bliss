import type { INotificationService } from './notification.service.interface.js';
export declare class NotificationService implements INotificationService {
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
//# sourceMappingURL=notification.service.d.ts.map