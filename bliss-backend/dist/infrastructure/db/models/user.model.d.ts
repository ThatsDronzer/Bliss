import mongoose, { Document, Types } from 'mongoose';
export interface IUser extends Document {
    clerkId: string;
    name: string;
    email: string;
    phone?: string;
    role: 'user' | 'vendor' | 'admin';
    coins: number;
    referralCode?: string;
    referredBy?: string;
    userVerified: boolean;
    createdAt?: Date;
    updatedAt?: Date;
    address?: {
        houseNo: string;
        areaName: string;
        landmark: string;
        postOffice: string;
        state: string;
        pin: string;
    };
    messages: Types.ObjectId[];
}
declare const User: mongoose.Model<any, {}, {}, {}, any, any>;
export default User;
//# sourceMappingURL=user.model.d.ts.map