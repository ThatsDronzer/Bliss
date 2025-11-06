import mongoose, { Document, Types } from 'mongoose';
export interface IMessageData extends Document {
    user: {
        id: string;
        name: string;
        email: string;
        phone?: string;
        address?: {
            houseNo: string;
            areaName: string;
            landmark: string;
            state: string;
            pin: string;
        };
    };
    vendor: {
        id: string;
        name: string;
        email: string;
        phone?: string;
        service: string;
        service_address?: {
            State: string;
            City: string;
            location: string;
            pinCode: string;
        };
    };
    listing: {
        id: Types.ObjectId;
        title: string;
        description: string;
        basePrice: number;
        location: string;
    };
    bookingDetails: {
        selectedItems: {
            name: string;
            description: string;
            price: number;
            image?: {
                url: string;
                public_id: string;
            };
        }[];
        totalPrice: number;
        bookingDate: Date;
        bookingTime?: string;
        address: {
            houseNo: string;
            areaName: string;
            landmark: string;
            state: string;
            pin: string;
        };
        specialInstructions?: string;
        status: 'accepted' | 'not-accepted' | 'pending';
    };
    paymentStatus: {
        status: 'pending' | 'paid' | 'failed' | 'refunded';
        paymentId?: Types.ObjectId;
        paidAt?: Date;
    };
    createdAt: Date;
    updatedAt: Date;
}
declare const MessageData: mongoose.Model<any, {}, {}, {}, any, any>;
export default MessageData;
//# sourceMappingURL=message.d.ts.map