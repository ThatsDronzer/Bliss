import { Webhook } from 'svix';
import User from '../models/user.js';
import Vendor from '../models/vendor.js';
import Payment from '../models/payment.js';
import MessageData from '../models/message.js';
import AdminPayment from '../models/AdminPayments.js';
import dbConnect from '../utils/dbConnect.js';
export class WebhookService {
    /**
     * Handle Clerk webhook
     */
    async handleClerkWebhook(payload, headers) {
        await dbConnect();
        const wh = new Webhook(process.env.CLERK_WEBHOOK_SECRET);
        let evt;
        try {
            if (process.env.NODE_ENV === 'development') {
                evt = payload;
                console.log('⚠️ Development mode: Skipping webhook signature verification');
            }
            else {
                evt = wh.verify(JSON.stringify(payload), headers);
            }
        }
        catch (err) {
            console.error('Webhook signature verification failed:', err);
            throw new Error('Invalid webhook');
        }
        const eventType = evt.type;
        // Handle user creation
        if (eventType === 'user.created') {
            const { id, email_addresses, first_name, last_name } = evt.data;
            const email = email_addresses?.[0]?.email_address ?? '';
            await User.findOneAndUpdate({ $or: [{ clerkId: id }, { email: email }] }, {
                $set: {
                    clerkId: id,
                    name: `${first_name} ${last_name}`,
                    email: email,
                },
            }, { upsert: true, new: true });
            console.log(`[Webhook] User record created or updated for ${id}.`);
        }
        // Handle user update (role changes)
        if (eventType === 'user.updated') {
            const { id, unsafe_metadata } = evt.data;
            const role = unsafe_metadata?.role;
            console.log('[Webhook] Role detected:', role);
            if (role === 'vendor') {
                const userRecord = await User.findOne({ clerkId: id });
                if (!userRecord) {
                    console.log(`[Webhook] ❌ No User found with clerkId ${id}. Vendor not created.`);
                    return;
                }
                await Vendor.create({
                    clerkId: userRecord.clerkId,
                    ownerName: userRecord.name,
                    ownerEmail: userRecord.email,
                });
                await User.findOneAndDelete({ clerkId: id });
                console.log(`[Webhook] ✅ User ${id} successfully migrated to Vendor.`);
            }
            if (role === 'admin') {
                await User.findOneAndUpdate({ clerkId: id }, { $set: { role: 'admin' } }, { upsert: false });
                console.log(`[Webhook] ✅ User ${id} role updated to admin.`);
            }
        }
        // Handle user deletion
        if (eventType === 'user.deleted') {
            const deletedUserId = evt.data.id;
            if (deletedUserId) {
                await User.findOneAndDelete({ clerkId: deletedUserId });
                await Vendor.findOneAndDelete({ clerkId: deletedUserId });
                console.log(`[Webhook] 🗑️ User/Vendor with clerkId ${deletedUserId} deleted.`);
            }
        }
        return { success: true };
    }
    /**
     * Handle Razorpay webhook
     */
    async handleRazorpayWebhook(body, signature) {
        await dbConnect();
        // Verify webhook signature
        const crypto = require('crypto');
        const expectedSignature = crypto
            .createHmac('sha256', process.env.RAZORPAY_WEBHOOK_SECRET)
            .update(body)
            .digest('hex');
        if (expectedSignature !== signature) {
            throw new Error('Invalid signature');
        }
        const webhookData = JSON.parse(body);
        const event = webhookData.event;
        const payload = webhookData.payload;
        console.log(`Received Razorpay webhook: ${event}`);
        switch (event) {
            case 'payment.captured':
                await this.handlePaymentCaptured(payload.payment.entity);
                break;
            case 'payment.failed':
                await this.handlePaymentFailed(payload.payment.entity);
                break;
            case 'payment.disputed':
                await this.handlePaymentDisputed(payload.payment.entity);
                break;
            case 'refund.created':
                await this.handleRefundCreated(payload.refund.entity);
                break;
            default:
                console.log(`Unhandled webhook event: ${event}`);
        }
        return { success: true, message: 'Webhook processed' };
    }
    async handlePaymentCaptured(payment) {
        const paymentId = payment.id;
        const paymentRecord = await Payment.findOne({
            'razorpay.paymentId': paymentId,
        });
        if (!paymentRecord) {
            // Try to find by order ID
            const paymentByOrder = await Payment.findOne({
                'razorpay.orderId': payment.order_id,
            });
            if (!paymentByOrder) {
                console.error(`Payment record not found for payment ID: ${paymentId}`);
                return;
            }
            paymentByOrder.razorpay.paymentId = paymentId;
            paymentByOrder.save();
            return;
        }
        if (paymentRecord.status === 'captured') {
            return;
        }
        paymentRecord.status = 'captured';
        paymentRecord.razorpay.paymentId = paymentId;
        paymentRecord.payout.advancePaid = true;
        paymentRecord.payout.advancePaidAt = new Date();
        paymentRecord.payout.payoutStatus = 'advance_paid';
        await paymentRecord.save();
        await MessageData.findByIdAndUpdate(paymentRecord.message, {
            'paymentStatus.status': 'paid',
            'paymentStatus.paymentId': paymentRecord._id,
            'paymentStatus.paidAt': new Date(),
        });
        // Add to admin payments
        try {
            const adminPayment = new AdminPayment({
                paymentId: paymentRecord._id,
            });
            await adminPayment.save();
            console.log('✅ Payment added to admin records:', paymentRecord._id);
        }
        catch (error) {
            console.error('❌ Error adding to admin payments:', error);
        }
        console.log(`Payment captured for order: ${paymentRecord._id}`);
    }
    async handlePaymentFailed(payment) {
        const paymentId = payment.id;
        const orderId = payment.order_id;
        const paymentRecord = await Payment.findOne({
            $or: [{ 'razorpay.orderId': orderId }, { 'razorpay.paymentId': paymentId }],
        });
        if (!paymentRecord) {
            console.error(`Payment record not found for failed payment: ${paymentId}`);
            return;
        }
        paymentRecord.status = 'failed';
        if (paymentId) {
            paymentRecord.razorpay.paymentId = paymentId;
        }
        await paymentRecord.save();
        await MessageData.findByIdAndUpdate(paymentRecord.message, {
            'paymentStatus.status': 'failed',
        });
        console.log(`Payment failed for order: ${paymentRecord._id}`);
    }
    async handlePaymentDisputed(payment) {
        const paymentId = payment.id;
        const paymentRecord = await Payment.findOne({
            'razorpay.paymentId': paymentId,
        });
        if (paymentRecord) {
            console.log(`Payment disputed: ${paymentId}`);
        }
    }
    async handleRefundCreated(refund) {
        const paymentId = refund.payment_id;
        const paymentRecord = await Payment.findOne({
            'razorpay.paymentId': paymentId,
        });
        if (paymentRecord) {
            paymentRecord.status = 'refunded';
            await paymentRecord.save();
            await MessageData.findByIdAndUpdate(paymentRecord.message, {
                'paymentStatus.status': 'refunded',
            });
            console.log(`Refund processed for payment: ${paymentId}`);
        }
    }
}
//# sourceMappingURL=webhook.service.js.map