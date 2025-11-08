import { DBConnectionError } from '@exceptions/core.exceptions';
import { dbConnect } from '@repository/repository';
import Payment from '../../infrastructure/db/models/payment.model.js';
import MessageData from '../../infrastructure/db/models/message.model.js';
import AdminPayment from '../../infrastructure/db/models/admin-payments.model.js';
import type { IPayment } from '@models/payment/payment.model';

export interface MessageDetails {
	user: {
		id: string;
		name: string;
		email: string;
		phone: string;
	};
	vendor: {
		id: string;
		name: string;
		email: string;
		phone: string;
	};
	listing: {
		id: string;
		title: string;
	};
	bookingDetails: {
		status: string;
		totalPrice: number;
	};
}

export async function getMessageByIdFromDb(messageId: string): Promise<MessageDetails | null> {
	try {
		await dbConnect();
		const message = await MessageData.findById(messageId);
		
		if (!message) {
			return null;
		}

		return {
			user: message.user,
			vendor: message.vendor,
			listing: message.listing,
			bookingDetails: message.bookingDetails,
		};
	} catch (error: any) {
		console.error('Error while getMessageByIdFromDb()', {
			error: error.message,
			stack: error.stack,
			data: { messageId },
		});
		throw new DBConnectionError('Failed to fetch message from database');
	}
}

export async function createPaymentRecordInDb(paymentData: {
	messageId: string;
	user: any;
	vendor: any;
	listing: any;
	amounts: any;
	razorpayOrderId: string;
}): Promise<{ paymentId: string; payment: any }> {
	try {
		await dbConnect();

		const payment = new Payment({
			message: paymentData.messageId,
			user: paymentData.user,
			vendor: paymentData.vendor,
			listing: paymentData.listing,
			amount: paymentData.amounts,
			razorpay: {
				orderId: paymentData.razorpayOrderId,
			},
		});

		await payment.save();

		return {
			paymentId: payment._id.toString(),
			payment,
		};
	} catch (error: any) {
		console.error('Error while createPaymentRecordInDb()', {
			error: error.message,
			stack: error.stack,
			data: { messageId: paymentData.messageId },
		});
		throw new DBConnectionError('Failed to create payment record in database');
	}
}

export async function getPaymentByOrderIdFromDb(orderId: string): Promise<IPayment | null> {
	try {
		await dbConnect();
		const payment = await Payment.findOne({ 'razorpay.orderId': orderId });
		return payment;
	} catch (error: any) {
		console.error('Error while getPaymentByOrderIdFromDb()', {
			error: error.message,
			stack: error.stack,
			data: { orderId },
		});
		throw new DBConnectionError('Failed to fetch payment by order ID from database');
	}
}

export async function updatePaymentStatusToFailedInDb(paymentId: string, messageId: string): Promise<void> {
	try {
		await dbConnect();

		await Payment.findByIdAndUpdate(paymentId, {
			status: 'failed',
			updatedAt: new Date(),
		});

		await MessageData.findByIdAndUpdate(messageId, {
			'paymentStatus.status': 'failed',
			updatedAt: new Date(),
		});
	} catch (error: any) {
		console.error('Error while updatePaymentStatusToFailedInDb()', {
			error: error.message,
			stack: error.stack,
			data: { paymentId, messageId },
		});
		throw new DBConnectionError('Failed to update payment status to failed in database');
	}
}

export async function capturePaymentInDb(
	paymentId: string,
	messageId: string,
	razorpayPaymentId: string,
	razorpaySignature: string
): Promise<{
	paymentId: string;
	amount: number;
	advancePaid: number;
	platformFee: number;
	remainingAmount: number;
}> {
	try {
		await dbConnect();

		const payment = await Payment.findById(paymentId);
		if (!payment) {
			throw new Error('Payment not found');
		}

		payment.status = 'captured';
		payment.razorpay.paymentId = razorpayPaymentId;
		payment.razorpay.signature = razorpaySignature;
		payment.payout.advancePaid = false;
		payment.payout.advancePaidAt = undefined;
		payment.payout.payoutStatus = 'none';
		payment.updatedAt = new Date();

		await payment.save();

		await MessageData.findByIdAndUpdate(messageId, {
			'paymentStatus.status': 'paid',
			'paymentStatus.paymentId': payment._id,
			'paymentStatus.paidAt': new Date(),
			updatedAt: new Date(),
		});

		try {
			const adminPayment = new AdminPayment({
				paymentId: payment._id,
			});
			await adminPayment.save();
			console.log('✅ Payment added to admin records:', payment._id);
		} catch (error) {
			console.error('❌ Error adding to admin payments:', error);
		}

		return {
			paymentId: payment._id.toString(),
			amount: payment.amount.total,
			advancePaid: payment.amount.advanceAmount,
			platformFee: payment.amount.platformFee,
			remainingAmount: payment.amount.remainingAmount,
		};
	} catch (error: any) {
		console.error('Error while capturePaymentInDb()', {
			error: error.message,
			stack: error.stack,
			data: { paymentId, messageId },
		});
		
		if (error instanceof Error && error.message === 'Payment not found') {
			throw error;
		}
		
		throw new DBConnectionError('Failed to capture payment in database');
	}
}

export async function getPaymentByIdFromDb(paymentId: string): Promise<IPayment | null> {
	try {
		await dbConnect();
		const payment = await Payment.findById(paymentId).lean();
		return payment as IPayment | null;
	} catch (error: any) {
		console.error('Error while getPaymentByIdFromDb()', {
			error: error.message,
			stack: error.stack,
			data: { paymentId },
		});
		throw new DBConnectionError('Failed to fetch payment from database');
	}
}

