import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import AdminPayment from '@/model/AdminPayments';
import Payment from '@/model/payment';

export async function GET(request: NextRequest) {
  try {
    // Connect to database
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(process.env.MONGODB_URI!);
    }

    // Get all admin payments with payment details
    const adminPayments = await AdminPayment.find()
      .populate({
        path: 'paymentId',
        populate: [
          { 
            path: 'message', 
            select: 'user vendor bookingDetails',
            populate: {
              path: 'listing',
              select: 'title'
            }
          }
        ]
      })
      .sort({ createdAt: -1 });

    // Format response
    const formattedPayments = adminPayments.map(adminPayment => {
      const payment = adminPayment.paymentId as any;
      return {
        _id: adminPayment._id,
        paymentId: payment._id,
        user: payment.user,
        vendor: payment.vendor,
        amount: payment.amount,
        advanceAmount: payment.amount.advanceAmount,
        advancePaid: payment.payout.advancePaid,
        advancePaidAt: payment.payout.advancePaidAt,
        bookingDate: payment.message.bookingDetails.bookingDate,
        bookingTime: payment.message.bookingDetails.bookingTime,
        service: payment.message.listing.title,
        createdAt: adminPayment.createdAt
      };
    });

    return NextResponse.json({
      success: true,
      data: formattedPayments,
      count: formattedPayments.length
    });
  } catch (error) {
    console.error('Error fetching admin payments:', error);
    return NextResponse.json(
      { error: 'Failed to fetch admin payments' },
      { status: 500 }
    );
  }
}