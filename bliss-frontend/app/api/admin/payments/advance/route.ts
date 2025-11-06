import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import Payment from '@/model/payment';
import Booking from '@/model/Booking';
import MessageData from '@/model/message';

export async function POST(request: NextRequest) {
  try {
    const { paymentId } = await request.json();

    if (!paymentId) {
      return NextResponse.json(
        { error: 'Payment ID is required' },
        { status: 400 }
      );
    }

    // Connect to database
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(process.env.MONGODB_URI!);
    }

    // Find the payment with populated data
    const payment = await Payment.findById(paymentId)
      .populate('message')
      .populate('listing');

    if (!payment) {
      return NextResponse.json(
        { error: 'Payment not found' },
        { status: 404 }
      );
    }

    // Check if advance is already paid
    if (payment.payout.advancePaid) {
      return NextResponse.json(
        { error: 'Advance payment already processed' },
        { status: 400 }
      );
    }

    // Update payment status - mark advance as paid
    payment.payout.advancePaid = true;
    payment.payout.advancePaidAt = new Date();
    payment.payout.payoutStatus = 'advance_paid';
    
    await payment.save();

    // Get message details for booking
    const message = await MessageData.findById(payment.message);
    console.log('📝 Message booking details:', message?.bookingDetails);

    if (!message) {
      return NextResponse.json(
        { error: 'Message not found' },
        { status: 404 }
      );
    }

    // Create booking record with proper validation
    const booking = new Booking({
      payment: payment._id,
      message: payment.message,
      user: {
        id: payment.user.id,
        name: payment.user.name,
        email: payment.user.email,
        phone: payment.user.phone
      },
      vendor: {
        id: payment.vendor.id,
        name: payment.vendor.name,
        email: payment.vendor.email,
        phone: payment.vendor.phone,
        service: payment.listing.title
      },
      service: {
        id: payment.listing.id,
        title: payment.listing.title,
        price: payment.listing.price
      },
      bookingDetails: {
        selectedItems: message.bookingDetails?.selectedItems?.map((item: any) => ({
          name: item.name,
          price: item.price
        })) || [],
        totalPrice: message.bookingDetails?.totalPrice || 0,
        bookingDate: message.bookingDetails?.bookingDate || new Date(),
        bookingTime: message.bookingDetails?.bookingTime || '10:00',
        address: message.bookingDetails?.address || 'Address not provided'
      },
      paymentStatus: {
        advancePaid: true,
        advancePaidAt: new Date(),
        fullPaid: false
      },
      status: 'upcoming'
    });

    await booking.save();

    console.log('✅ Advance payment processed and booking created:', {
      paymentId: payment._id,
      bookingId: booking._id,
      advanceAmount: payment.amount.advanceAmount
    });

    return NextResponse.json({
      success: true,
      message: 'Advance payment processed successfully',
      bookingId: booking._id,
      advanceAmount: payment.amount.advanceAmount
    });

  } catch (error) {
    console.error('Error processing advance payment:', error);
    return NextResponse.json(
      { error: 'Failed to process advance payment' },
      { status: 500 }
    );
  }
}