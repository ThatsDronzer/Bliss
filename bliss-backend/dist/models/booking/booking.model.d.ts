export interface IBooking {
    _id?: string;
    payment: string;
    message: string;
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
        id: string;
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
    createdAt?: Date;
    updatedAt?: Date;
}
export interface ICreateBookingInput {
    payment: string;
    message: string;
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
        id: string;
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
    paymentStatus?: {
        advancePaid: boolean;
        advancePaidAt?: Date;
        fullPaid: boolean;
        fullPaidAt?: Date;
    };
    status?: 'upcoming' | 'completed' | 'cancelled';
}
export interface IUpdateBookingInput {
    paymentStatus?: {
        advancePaid?: boolean;
        advancePaidAt?: Date;
        fullPaid?: boolean;
        fullPaidAt?: Date;
    };
    status?: 'upcoming' | 'completed' | 'cancelled';
}
//# sourceMappingURL=booking.model.d.ts.map