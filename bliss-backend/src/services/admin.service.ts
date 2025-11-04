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

    const formattedPayments = adminPayments.map((adminPayment: any) => {
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
  async processAdvancePayment(paymentId: string) {
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
    if ((payment as any).payout.advancePaid) {
      throw new Error('Advance payment already processed');
    }

    // Update payment status
    (payment as any).payout.advancePaid = true;
    (payment as any).payout.advancePaidAt = new Date();
    (payment as any).payout.payoutStatus = 'advance_paid';

    await payment.save();

    // Get message details
    const message = await MessageData.findById((payment as any).message);

    if (!message) {
      throw new Error('Message not found');
    }

    // Create booking record
    const booking = new Booking({
      payment: payment._id,
      message: (payment as any).message,
      user: {
        id: (payment as any).user.id,
        name: (payment as any).user.name,
        email: (payment as any).user.email,
        phone: (payment as any).user.phone,
      },
      vendor: {
        id: (payment as any).vendor.id,
        name: (payment as any).vendor.name,
        email: (payment as any).vendor.email,
        phone: (payment as any).vendor.phone,
        service: (payment as any).listing.title,
      },
      service: {
        id: (payment as any).listing.id,
        title: (payment as any).listing.title,
        price: (payment as any).listing.price,
      },
      bookingDetails: {
        selectedItems:
          (message as any).bookingDetails?.selectedItems?.map((item: any) => ({
            name: item.name,
            price: item.price,
          })) || [],
        totalPrice: (message as any).bookingDetails?.totalPrice || 0,
        bookingDate: (message as any).bookingDetails?.bookingDate || new Date(),
        bookingTime: (message as any).bookingDetails?.bookingTime || '10:00',
        address: (message as any).bookingDetails?.address || {
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
      advanceAmount: (payment as any).amount.advanceAmount,
    };
  }
}

