import { notifyCustomerInDb, notifyVendorInDb, } from '@repository/notification/notification.repository';
import { DBConnectionError } from '@exceptions/core.exceptions';
import { NOTIFICATION_ERROR } from '@exceptions/errors';
export class NotificationService {
    async notifyCustomer(notificationData) {
        try {
            return await notifyCustomerInDb(notificationData);
        }
        catch (error) {
            if (error instanceof DBConnectionError)
                throw error;
            throw new Error(NOTIFICATION_ERROR.message);
        }
    }
    async notifyVendor(notificationData) {
        try {
            return await notifyVendorInDb(notificationData);
        }
        catch (error) {
            if (error instanceof DBConnectionError)
                throw error;
            throw new Error(NOTIFICATION_ERROR.message);
        }
    }
}
//# sourceMappingURL=notification.service.js.map