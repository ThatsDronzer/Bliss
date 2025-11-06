import AdminPayment from '../models/AdminPayments.js';
import Payment from '../models/payment.js';
import Booking from '../models/Booking.js';
import MessageData from '../models/message.js';
import dbConnect from '../utils/dbConnect.js';
export class AdminService {
    /**
     * Get all admin payments
     */
    async getAdminPayments() {
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
    /**
     * Process advance payment
     */
    async processAdvancePayment(paymentId) {
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
        // Check if advance is already paid
        if (payment.payout.advancePaid) {
            throw new Error('Advance payment already processed');
        }
        // Update payment status
        payment.payout.advancePaid = true;
        payment.payout.advancePaidAt = new Date();
        payment.payout.payoutStatus = 'advance_paid';
        await payment.save();
        // Get message details
        const message = await MessageData.findById(payment.message);
        if (!message) {
            throw new Error('Message not found');
        }
        // Create booking record
        const booking = new Booking({
            payment: payment._id,
            message: payment.message,
            user: {
                id: payment.user.id,
                name: payment.user.name,
                email: payment.user.email,
                phone: payment.user.phone,
            },
            vendor: {
                id: payment.vendor.id,
                name: payment.vendor.name,
                email: payment.vendor.email,
                phone: payment.vendor.phone,
                service: payment.listing.title,
            },
            service: {
                id: payment.listing.id,
                title: payment.listing.title,
                price: payment.listing.price,
            },
            bookingDetails: {
                selectedItems: message.bookingDetails?.selectedItems?.map((item) => ({
                    name: item.name,
                    price: item.price,
                })) || [],
                totalPrice: message.bookingDetails?.totalPrice || 0,
                bookingDate: message.bookingDetails?.bookingDate || new Date(),
                bookingTime: message.bookingDetails?.bookingTime || '10:00',
                address: message.bookingDetails?.address || {
                    houseNo: '',
                    areaName: '',
                    landmark: '',
                    state: '',
                    pin: '',
                },
            },
            paymentStatus: {
                advancePaid: true,
                advancePaidAt: new Date(),
                fullPaid: false,
            },
            status: 'upcoming',
        });
        await booking.save();
        return {
            success: true,
            message: 'Advance payment processed successfully',
            bookingId: booking._id.toString(),
            advanceAmount: payment.amount.advanceAmount,
        };
    }
}
//# sourceMappingURL=admin.service.js.map