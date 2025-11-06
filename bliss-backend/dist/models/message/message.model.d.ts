export interface IMessageData {
    _id?: string;
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
        id: string;
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
        paymentId?: string;
        paidAt?: Date;
    };
    createdAt?: Date;
    updatedAt?: Date;
}
export interface ICreateMessageInput {
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
        id: string;
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
        status?: 'accepted' | 'not-accepted' | 'pending';
    };
    paymentStatus?: {
        status?: 'pending' | 'paid' | 'failed' | 'refunded';
        paymentId?: string;
        paidAt?: Date;
    };
}
export interface IUpdateMessageInput {
    bookingDetails?: {
        status?: 'accepted' | 'not-accepted' | 'pending';
        specialInstructions?: string;
    };
    paymentStatus?: {
        status?: 'pending' | 'paid' | 'failed' | 'refunded';
        paymentId?: string;
        paidAt?: Date;
    };
}
//# sourceMappingURL=message.model.d.ts.map