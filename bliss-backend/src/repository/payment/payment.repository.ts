import { DBConnectionError } from '@exceptions/core.exceptions';
import { dbConnect } from '@repository/repository';
import Payment from '../../infrastructure/db/models/payment.model.js';
import MessageData from '../../infrastructure/db/models/message.model.js';
import AdminPayment from '../../infrastructure/db/models/admin-payments.model.js';
import { createRazorpayOrder, verifyPaymentSignature, getPaymentDetails } from '../../utils/razorpay.js';
import { calculateAmounts } from '../../utils/amountCalculator.js';
import type { IPayment, ICreatePaymentInput, IUpdatePaymentInput } from '@models/payment/payment.model';

export async function createPaymentOrderInDb(messageId: string): Promise<any> {
	try {
		await dbConnect();

		if (!messageId) {
			throw new Error('Message ID is required');
		}

		const message = await MessageData.findById(messageId);
		if (!message) {
			throw new Error('Message not found');
		}

		if (message.bookingDetails.status !== 'accepted') {
			throw new Error('Booking must be accepted by vendor first');
		}

		const amounts = calculateAmounts(message.bookingDetails.totalPrice);

		const razorpayOrder = await createRazorpayOrder({
			amount: amounts.totalInPaise,
			currency: 'INR',
			receipt: `receipt_${messageId}`,
			notes: {
				messageId: messageId.toString(),
				userId: message.user.id,
				vendorId: message.vendor.id,
			},
		});

		const payment = new Payment({
			message: messageId,
			user: {
				id: message.user.id,
				name: message.user.name,
				email: message.user.email,
				phone: message.user.phone,
			},
			vendor: {
				id: message.vendor.id,
				name: message.vendor.name,
				email: message.vendor.email,
				phone: message.vendor.phone,
			},
			listing: {
				id: message.listing.id,
				title: message.listing.title,
				price: message.bookingDetails.totalPrice,
			},
			amount: amounts,
			razorpay: {
				orderId: razorpayOrder.id,
			},
		});

		await payment.save();

		return {
			success: true,
			order: {
				id: razorpayOrder.id,
				amount: razorpayOrder.amount,
				currency: razorpayOrder.currency,
			},
			paymentId: payment._id.toString(),
			amountBreakdown: amounts,
		};
	} catch (error) {
		if (error instanceof DBConnectionError) throw error;
		throw new DBConnectionError('Failed to create payment order in database');
	}
}

export async function verifyPaymentInDb(verificationData: {
	razorpay_order_id: string;
	razorpay_payment_id: string;
	razorpay_signature: string;
}): Promise<any> {
	try {
		await dbConnect();

		const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = verificationData;

		if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
			throw new Error('Missing payment details');
		}

		const payment = await Payment.findOne({ 'razorpay.orderId': razorpay_order_id });
		if (!payment) {
			throw new Error('Payment record not found');
		}

		const isSignatureValid = verifyPaymentSignature(
			razorpay_order_id,
			razorpay_payment_id,
			razorpay_signature
		);

		if (!isSignatureValid) {
			await Payment.findByIdAndUpdate(payment._id, {
				status: 'failed',
			});

			await MessageData.findByIdAndUpdate(payment.message, {
				'paymentStatus.status': 'failed',
			});

			throw new Error('Payment verification failed');
		}

		const paymentDetails = await getPaymentDetails(razorpay_payment_id);

		if (paymentDetails.status !== 'captured') {
			throw new Error('Payment not captured yet');
		}

		if (payment.status !== 'captured') {
			payment.status = 'captured';
			payment.razorpay.paymentId = razorpay_payment_id;
			payment.razorpay.signature = razorpay_signature;
			payment.payout.advancePaid = false;
			payment.payout.advancePaidAt = undefined;
			payment.payout.payoutStatus = 'none';

			await payment.save();

			await MessageData.findByIdAndUpdate(payment.message, {
				'paymentStatus.status': 'paid',
				'paymentStatus.paymentId': payment._id,
				'paymentStatus.paidAt': new Date(),
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
		}

		return {
			success: true,
			message: 'Payment verified successfully',
			paymentId: payment._id.toString(),
			amount: payment.amount.total,
			advancePaid: payment.amount.advanceAmount,
			platformFee: payment.amount.platformFee,
			remainingAmount: payment.amount.remainingAmount,
		};
	} catch (error) {
		if (error instanceof DBConnectionError) throw error;
		throw new DBConnectionError('Failed to verify payment in database');
	}
}

export async function getPaymentByIdFromDb(paymentId: string): Promise<IPayment | null> {
	try {
		await dbConnect();
		const payment = await Payment.findById(paymentId).lean();
		return payment as IPayment | null;
	} catch (error) {
		throw new DBConnectionError('Failed to fetch payment from database');
	}
}

