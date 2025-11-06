import type { IPaymentService } from './payment.service.interface.js';
import type { IPayment } from '@models/payment/payment.model';
import {
	createPaymentOrderInDb,
	verifyPaymentInDb,
	getPaymentByIdFromDb,
} from '@repository/payment/payment.repository';
import { DBConnectionError } from '@exceptions/core.exceptions';
import { CREATE_PAYMENT_ERROR, FETCH_PAYMENT_ERROR } from '@exceptions/errors';

export class PaymentService implements IPaymentService {
	async createPaymentOrder(messageId: string): Promise<any> {
		try {
			return await createPaymentOrderInDb(messageId);
		} catch (error) {
			if (error instanceof DBConnectionError) throw error;
			throw new Error(CREATE_PAYMENT_ERROR.message);
		}
	}

	async verifyPayment(verificationData: {
		razorpay_order_id: string;
		razorpay_payment_id: string;
		razorpay_signature: string;
	}): Promise<any> {
		try {
			return await verifyPaymentInDb(verificationData);
		} catch (error) {
			if (error instanceof DBConnectionError) throw error;
			throw new Error(CREATE_PAYMENT_ERROR.message);
		}
	}

	async getPaymentById(paymentId: string): Promise<IPayment | null> {
		try {
			return await getPaymentByIdFromDb(paymentId);
		} catch (error) {
			if (error instanceof DBConnectionError) throw error;
			throw new Error(FETCH_PAYMENT_ERROR.message);
		}
	}
}

