import { DBConnectionError } from '@exceptions/core.exceptions';
import { sendWhatsApp } from '../../utils/twilio.js';
import { templates } from '../../utils/messageTemplate.js';

export async function notifyCustomerInDb(notificationData: {
	requestId: string;
	customerPhone: string;
	vendorName: string;
	status: string;
	customerName?: string;
}): Promise<any> {
	try {
		const { requestId, customerPhone, vendorName, status } = notificationData;

		if (!requestId || !customerPhone || !vendorName || !status) {
			throw new Error('Missing required fields: requestId, customerPhone, vendorName, status');
		}

		const message = templates.customerNotify({ vendorName, status });

		let formattedPhone = customerPhone;
		if (customerPhone && !customerPhone.startsWith('+')) {
			formattedPhone = `+91${customerPhone}`;
		}

		const result = await sendWhatsApp(formattedPhone, message);

		return result;
	} catch (error) {
		if (error instanceof DBConnectionError) throw error;
		throw new DBConnectionError('Failed to send customer notification');
	}
}

export async function notifyVendorInDb(notificationData: {
	customerName: string;
	requestId: string;
}): Promise<any> {
	try {
		const { customerName, requestId } = notificationData;

		if (!customerName || !requestId) {
			throw new Error('Missing required fields: customerName, requestId');
		}

		const messageBody = templates.vendorNotify({ customerName, requestId });

		const vendorWhatsAppNumber = process.env.VENDOR_WHATSAPP_NUMBER;
		if (!vendorWhatsAppNumber) {
			throw new Error('Vendor WhatsApp number not configured');
		}

		const result = await sendWhatsApp(vendorWhatsAppNumber, messageBody);

		return result;
	} catch (error) {
		if (error instanceof DBConnectionError) throw error;
		throw new DBConnectionError('Failed to send vendor notification');
	}
}

