import { sendWhatsApp } from '../utils/twilio.js';
import { templates } from '../utils/messageTemplate.js';

export class NotificationService {
  /**
   * Send customer notification
   */
  async notifyCustomer(notificationData: {
    requestId: string;
    customerPhone: string;
    vendorName: string;
    status: string;
    customerName?: string;
  }) {
    const { requestId, customerPhone, vendorName, status } = notificationData;

    if (!requestId || !customerPhone || !vendorName || !status) {
      throw new Error('Missing required fields: requestId, customerPhone, vendorName, status');
    }

    // Build message using template
    const message = templates.customerNotify({ vendorName, status });

    // Ensure phone number is in E.164 format
    let formattedPhone = customerPhone;
    if (customerPhone && !customerPhone.startsWith('+')) {
      formattedPhone = `+91${customerPhone}`;
    }

    // Send via Twilio
    const result = await sendWhatsApp(formattedPhone, message);

    return result;
  }

  /**
   * Send vendor notification
   */
  async notifyVendor(notificationData: {
    customerName: string;
    requestId: string;
  }) {
    const { customerName, requestId } = notificationData;

    if (!customerName || !requestId) {
      throw new Error('Missing required fields: customerName, requestId');
    }

    // Create message text using template
    const messageBody = templates.vendorNotify({ customerName, requestId });

    // Get vendor WhatsApp number from environment (or from database)
    const vendorWhatsAppNumber = process.env.VENDOR_WHATSAPP_NUMBER;
    if (!vendorWhatsAppNumber) {
      throw new Error('Vendor WhatsApp number not configured');
    }

    // Send WhatsApp message via Twilio
    const result = await sendWhatsApp(vendorWhatsAppNumber, messageBody);

    return result;
  }
}

