import { DBConnectionError } from '@exceptions/core.exceptions';
import { dbConnect } from '@repository/repository';
import AdminPayment from '../../infrastructure/db/models/admin-payments.model.js';
import Payment from '../../infrastructure/db/models/payment.model.js';
import Booking from '../../infrastructure/db/models/booking.model.js';
export async function getAdminPaymentsFromDb() {
    try {
        await dbConnect();
        const adminPayments = await AdminPayment.find()
            .populate({
            path: 'paymentId',
            populate: [
                {
                    path: 'message',
                    select: 'user vendor bookingDetails',
                },
            ],
        })
            .sort({ createdAt: -1 })
            .lean();
        const formattedPayments = adminPayments.map((adminPayment) => {
            const payment = adminPayment.paymentId;
            return {
                _id: adminPayment._id,
                paymentId: payment._id,
                user: payment.user,
                vendor: payment.vendor,
                amount: payment.amount,
                advanceAmount: payment.amount.advanceAmount,
                advancePaid: payment.payout.advancePaid,
                advancePaidAt: payment.payout.advancePaidAt,
                bookingDate: payment.message?.bookingDetails?.bookingDate,
                bookingTime: payment.message?.bookingDetails?.bookingTime,
                service: payment.message?.listing?.title || payment.listing.title,
                createdAt: adminPayment.createdAt,
            };
        });
        return {
            success: true,
            data: formattedPayments,
            count: formattedPayments.length,
        };
    }
    catch (error) {
        console.error('Error while getAdminPaymentsFromDb()', {
            error: error.message,
            stack: error.stack,
        });
        throw new DBConnectionError('Failed to fetch admin payments from database');
    }
}
export async function processAdvancePaymentInDb(paymentId) {
    try {
        await dbConnect();
        if (!paymentId) {
            throw new Error('Payment ID is required');
        }
        const payment = await Payment.findById(paymentId)
            .populate('message')
            .exec();
        if (!payment) {
            throw new Error('Payment not found');
        }
        if (payment.payout.advancePaid) {
            throw new Error('Advance payment already processed');
        }
        payment.payout.advancePaid = true;
        payment.payout.advancePaidAt = new Date();
        payment.payout.payoutStatus = 'advance_paid';
        payment.updatedAt = new Date();
        await payment.save();
        const message = payment.message;
        if (message) {
            await Booking.findOneAndUpdate({ payment: paymentId }, {
                'paymentStatus.advancePaid': true,
                'paymentStatus.advancePaidAt': new Date(),
                updatedAt: new Date(),
            });
        }
        return {
            success: true,
            message: 'Advance payment processed successfully',
            payment: {
                id: payment._id.toString(),
                advancePaid: payment.payout.advancePaid,
                advancePaidAt: payment.payout.advancePaidAt,
            },
        };
    }
    catch (error) {
        // Re-throw validation errors for controller to handle
        if (error.message === 'Payment ID is required' ||
            error.message === 'Payment not found' ||
            error.message.includes('already processed')) {
            throw error;
        }
        console.error('Error while processAdvancePaymentInDb()', {
            error: error.message,
            stack: error.stack,
            data: { paymentId },
        });
        throw new DBConnectionError('Failed to process advance payment in database');
    }
}
export async function processFullPaymentInDb(paymentId) {
    try {
        await dbConnect();
        if (!paymentId) {
            throw new Error('Payment ID is required');
        }
        const payment = await Payment.findById(paymentId)
            .populate('message')
            .exec();
        if (!payment) {
            throw new Error('Payment not found');
        }
        if (payment.payout.fullPaid) {
            throw new Error('Full payment already processed');
        }
        payment.payout.fullPaid = true;
        payment.payout.fullPaidAt = new Date();
        payment.payout.payoutStatus = 'full_paid';
        payment.updatedAt = new Date();
        await payment.save();
        const message = payment.message;
        if (message) {
            await Booking.findOneAndUpdate({ payment: paymentId }, {
                'paymentStatus.fullPaid': true,
                'paymentStatus.fullPaidAt': new Date(),
                updatedAt: new Date(),
            });
        }
        return {
            success: true,
            message: 'Full payment processed successfully',
            payment: {
                id: payment._id.toString(),
                fullPaid: payment.payout.fullPaid,
                fullPaidAt: payment.payout.fullPaidAt,
            },
        };
    }
    catch (error) {
        // Re-throw validation errors for controller to handle
        if (error.message === 'Payment ID is required' ||
            error.message === 'Payment not found' ||
            error.message.includes('already processed')) {
            throw error;
        }
        console.error('Error while processFullPaymentInDb()', {
            error: error.message,
            stack: error.stack,
            data: { paymentId },
        });
        throw new DBConnectionError('Failed to process full payment in database');
    }
}
//# sourceMappingURL=admin.repository.js.map