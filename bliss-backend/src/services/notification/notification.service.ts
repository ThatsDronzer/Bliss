import type { INotificationService } from './notification.service.interface.js';
import {
	notifyCustomerInDb,
	notifyVendorInDb,
} from '@repository/notification/notification.repository';
import { DBConnectionError } from '@exceptions/core.exceptions';
import { NOTIFICATION_ERROR } from '@exceptions/errors';

export class NotificationService implements INotificationService {
	async notifyCustomer(notificationData: {
		requestId: string;
		customerPhone: string;
		vendorName: string;
		status: string;
		customerName?: string;
	}): Promise<any> {
		try {
			return await notifyCustomerInDb(notificationData);
		} catch (error) {
			if (error instanceof DBConnectionError) throw error;
			throw new Error(NOTIFICATION_ERROR.message);
		}
	}

	async notifyVendor(notificationData: {
		customerName: string;
		requestId: string;
	}): Promise<any> {
		try {
			return await notifyVendorInDb(notificationData);
		} catch (error) {
			if (error instanceof DBConnectionError) throw error;
			throw new Error(NOTIFICATION_ERROR.message);
		}
	}
}

