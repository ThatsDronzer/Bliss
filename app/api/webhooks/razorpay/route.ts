import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import mongoose from 'mongoose';
import Payment from '@/model/payment';
import MessageData from '@/model/message';
 
// Verify webhook signature
const verifyWebhookSignature = (body: string, signature: string): boolean => {
  const expectedSignature = crypto
    .createHmac('sha256', process.env.RAZORPAY_WEBHOOK_SECRET!)
    .update(body)
    .digest('hex');
  
  return expectedSignature === signature;
};
 
export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const signature = request.headers.get('x-razorpay-signature') || '';
 
    // Verify webhook signature
    if (!verifyWebhookSignature(body, signature)) {
      console.error('Webhook signature verification failed');
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
    }
 
    const webhookData = JSON.parse(body);
    const event = webhookData.event;
    const payload = webhookData.payload;
 
    console.log(`Received Razorpay webhook: ${event}`);
 
    // Connect to database
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(process.env.MONGODB_URI!);
    }
 
    // Handle different webhook events
    switch (event) {
      case 'payment.captured':
        await handlePaymentCaptured(payload.payment.entity);
        break;
      
      case 'payment.failed':
        await handlePaymentFailed(payload.payment.entity);
        break;
      
      case 'payment.disputed':
        await handlePaymentDisputed(payload.payment.entity);
        break;
      
      case 'refund.created':
        await handleRefundCreated(payload.refund.entity);
        break;
      
      default:
        console.log(`Unhandled webhook event: ${event}`);
    }
 
    return NextResponse.json({ success: true, message: 'Webhook processed' });
  } catch (error) {
    console.error('Webhook processing error:', error);
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 });
  }
}
 
// Handle successful payment
async function handlePaymentCaptured(payment: any) {
  try {
    const paymentId = payment.id;
    
    // Find payment by razorpay payment ID
    const paymentRecord = await Payment.findOne({ 'razorpay.paymentId': paymentId });
    
    if (!paymentRecord) {
      console.error(`Payment record not found for payment ID: ${paymentId}`);
      return;
    }
 
    // If payment is already captured, skip
    if (paymentRecord.status === 'captured') {
      return;
    }
 
    // Update payment status
    paymentRecord.status = 'captured';
    paymentRecord.razorpay.paymentId = paymentId;
    
    // Mark advance as paid (15% to vendor)
    paymentRecord.payout.advancePaid = true;
    paymentRecord.payout.advancePaidAt = new Date();
    paymentRecord.payout.payoutStatus = 'advance_paid';
    
    await paymentRecord.save();
 
    // Update message payment status
    await MessageData.findByIdAndUpdate(paymentRecord.message, {
      'paymentStatus.status': 'paid',
      'paymentStatus.paymentId': paymentRecord._id,
      'paymentStatus.paidAt': new Date(),
    });
 
    console.log(`Payment captured for order: ${paymentRecord._id}`);
    
    // TODO: Trigger advance payout to vendor (15%)
    // await processAdvancePayout(paymentRecord);
 
  } catch (error) {
    console.error('Error handling payment.captured webhook:', error);
    throw error;
  }
}
 
// Handle failed payment
async function handlePaymentFailed(payment: any) {
  try {
    const paymentId = payment.id;
    const orderId = payment.order_id;
 
    // Find payment by razorpay order ID or payment ID
    const paymentRecord = await Payment.findOne({
      $or: [
        { 'razorpay.orderId': orderId },
        { 'razorpay.paymentId': paymentId }
      ]
    });
 
    if (!paymentRecord) {
      console.error(`Payment record not found for failed payment: ${paymentId}`);
      return;
    }
 
    // Update payment status
    paymentRecord.status = 'failed';
    if (paymentId) {
      paymentRecord.razorpay.paymentId = paymentId;
    }
    
    await paymentRecord.save();
 
    // Update message payment status
    await MessageData.findByIdAndUpdate(paymentRecord.message, {
      'paymentStatus.status': 'failed',
    });
 
    console.log(`Payment failed for order: ${paymentRecord._id}`);
 
  } catch (error) {
    console.error('Error handling payment.failed webhook:', error);
    throw error;
  }
}
 
// Handle payment dispute
async function handlePaymentDisputed(payment: any) {
  try {
    const paymentId = payment.id;
    
    const paymentRecord = await Payment.findOne({ 'razorpay.paymentId': paymentId });
    
    if (paymentRecord) {
      console.log(`Payment disputed: ${paymentId}`);
      // Handle dispute logic here
      // You might want to put a hold on vendor payouts
    }
  } catch (error) {
    console.error('Error handling payment.disputed webhook:', error);
    throw error;
  }
}
 
// Handle refund
async function handleRefundCreated(refund: any) {
  try {
    const paymentId = refund.payment_id;
    
    const paymentRecord = await Payment.findOne({ 'razorpay.paymentId': paymentId });
    
    if (paymentRecord) {
      paymentRecord.status = 'refunded';
      await paymentRecord.save();
 
      // Update message payment status
      await MessageData.findByIdAndUpdate(paymentRecord.message, {
        'paymentStatus.status': 'refunded',
      });
 
      console.log(`Refund processed for payment: ${paymentId}`);
    }
  } catch (error) {
    console.error('Error handling refund.created webhook:', error);
    throw error;
  }
}
 
// Prevent other HTTP methods
export async function GET() {
  return NextResponse.json({ error: 'Method not allowed' }, { status: 405 });
}
 
export async function PUT() {
  return NextResponse.json({ error: 'Method not allowed' }, { status: 405 });
}
 
export async function DELETE() {
  return NextResponse.json({ error: 'Method not allowed' }, { status: 405 });
}
