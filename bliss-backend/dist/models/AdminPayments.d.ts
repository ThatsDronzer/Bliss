import mongoose, { Document, Types } from 'mongoose';
export interface IAdminPayment extends Document {
    paymentId: Types.ObjectId;
    createdAt: Date;
}
declare const _default: mongoose.Model<any, {}, {}, {}, any, any>;
export default _default;
//# sourceMappingURL=AdminPayments.d.ts.map