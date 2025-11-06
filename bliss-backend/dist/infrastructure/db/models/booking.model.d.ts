import mongoose, { Document, Types } from 'mongoose';
export interface IBooking extends Document {
    payment: Types.ObjectId;
    message: Types.ObjectId;
    user: {
        id: string;
        name: string;
        email: string;
        phone?: string;
    };
    vendor: {
        id: string;
        name: string;
        email: string;
        phone?: string;
        service: string;
    };
    service: {
        id: Types.ObjectId;
        title: string;
        price: number;
    };
    bookingDetails: {
        selectedItems: {
            name: string;
            price: number;
        }[];
        totalPrice: number;
        bookingDate: Date;
        bookingTime: string;
        address: {
            houseNo: string;
            areaName: string;
            landmark: string;
            state: string;
            pin: string;
        };
    };
    paymentStatus: {
        advancePaid: boolean;
        advancePaidAt?: Date;
        fullPaid: boolean;
        fullPaidAt?: Date;
    };
    status: 'upcoming' | 'completed' | 'cancelled';
    createdAt: Date;
    updatedAt: Date;
}
declare const _default: mongoose.Model<any, {}, {}, {}, any, any>;
export default _default;
//# sourceMappingURL=booking.model.d.ts.map