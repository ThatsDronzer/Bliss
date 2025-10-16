import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { verifyPaymentSignature, getPaymentDetails } from '@/lib/razorpay';
import Payment from '@/model/payment';
import MessageData from '@/model/message';
 
export async function POST(request: NextRequest) {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = await request.json();
 
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json(
        { error: 'Missing payment details' },
        { status: 400 }
      );
    }
 
    // Connect to database
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(process.env.MONGODB_URI!);
    }
 
    // Find payment by razorpay order ID
    const payment = await Payment.findOne({ 'razorpay.orderId': razorpay_order_id });
    if (!payment) {
      return NextResponse.json(
        { error: 'Payment record not found' },
        { status: 404 }
      );
    }
 
    // Verify payment signature
    const isSignatureValid = verifyPaymentSignature(
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature
    );
 
    if (!isSignatureValid) {
      // Update payment status to failed
      await Payment.findByIdAndUpdate(payment._id, {
        status: 'failed',
      });
 
      await MessageData.findByIdAndUpdate(payment.message, {
        'paymentStatus.status': 'failed',
      });
 
      return NextResponse.json(
        { error: 'Payment verification failed' },
        { status: 400 }
      );
    }
 
    // Double-check payment status with Razorpay API
    const paymentDetails = await getPaymentDetails(razorpay_payment_id);
    
    if (paymentDetails.status !== 'captured') {
      return NextResponse.json(
        { error: 'Payment not captured yet' },
        { status: 400 }
      );
    }
 
    // If webhook hasn't processed this yet, update manually
    if (payment.status !== 'captured') {
      payment.status = 'captured';
      payment.razorpay.paymentId = razorpay_payment_id;
      payment.razorpay.signature = razorpay_signature;
      payment.payout.advancePaid = true;
      payment.payout.advancePaidAt = new Date();
      payment.payout.payoutStatus = 'advance_paid';
      
      await payment.save();
 
      await MessageData.findByIdAndUpdate(payment.message, {
        'paymentStatus.status': 'paid',
        'paymentStatus.paymentId': payment._id,
        'paymentStatus.paidAt': new Date(),
      });
    }
 
    return NextResponse.json({
      success: true,
      message: 'Payment verified successfully',
      paymentId: payment._id,
      amount: payment.amount.total,
      advancePaid: payment.amount.advanceAmount,
      platformFee: payment.amount.platformFee,
      remainingAmount: payment.amount.remainingAmount,
    });
  } catch (error) {
    console.error('Error verifying payment:', error);
    return NextResponse.json(
      { error: 'Payment verification failed' },
      { status: 500 }
    );
  }
}
