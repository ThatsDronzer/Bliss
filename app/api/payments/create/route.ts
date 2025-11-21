import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { createRazorpayOrder } from '@/lib/razorpay';
import { calculateAmounts } from '@/lib/amountCalculator';
import Payment from "@/model/payment"
import MessageData from '@/model/message';
 
export async function POST(request: NextRequest) {
  try {
    const { messageId } = await request.json();
 
    if (!messageId) {
      return NextResponse.json(
        { error: 'Message ID is required' },
        { status: 400 }
      );
    }
 
    // Connect to database
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(process.env.MONGODB_URI!);
    }
 
    // Get message details
    const message = await MessageData.findById(messageId);
    if (!message) {
      return NextResponse.json(
        { error: 'Message not found' },
        { status: 404 }
      );
    }
 
    if (message.bookingDetails.status !== 'accepted') {
      return NextResponse.json(
        { error: 'Booking must be accepted by vendor first' },
        { status: 400 }
      );
    }
 
    // Calculate amounts with commission structure
    const amounts = calculateAmounts(message.bookingDetails.totalPrice);
 
    // Create Razorpay order
    const razorpayOrder = await createRazorpayOrder({
      amount: amounts.totalInPaise,
      currency: 'INR',
      receipt: `receipt_${messageId}`,
      notes: {
        messageId: messageId.toString(),
        userId: message.user.id,
        vendorId: message.vendor.id,
      }
    });
 
    // Create payment record
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
        price: message.bookingDetails.totalPrice
      },
      amount: amounts,
      razorpay: {
        orderId: razorpayOrder.id,
      },
    });
 
    await payment.save();
 
    return NextResponse.json({
      success: true,
      order: {
        id: razorpayOrder.id,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
      },
      paymentId: payment._id,
      amountBreakdown: amounts,
    });
  } catch (error) {
    console.error('Error creating payment:', error);
    return NextResponse.json(
      { error: 'Failed to create payment' },
      { status: 500 }
    );
  }
}
