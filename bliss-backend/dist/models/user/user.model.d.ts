export interface IUser {
    _id?: string;
    clerkId: string;
    name: string;
    email: string;
    phone?: string;
    role?: 'user' | 'vendor' | 'admin';
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
    messages?: string[];
}
export interface ICreateUserInput {
    clerkId: string;
    name: string;
    email: string;
    phone?: string;
    role?: 'user' | 'vendor' | 'admin';
    coins?: number;
    referralCode?: string;
    referredBy?: string;
    userVerified?: boolean;
    address?: {
        houseNo: string;
        areaName: string;
        landmark: string;
        postOffice: string;
        state: string;
        pin: string;
    };
}
export interface IUpdateUserInput {
    name?: string;
    phone?: string;
    coins?: number;
    referralCode?: string;
    referredBy?: string;
    userVerified?: boolean;
    address?: {
        houseNo: string;
        areaName: string;
        landmark: string;
        postOffice: string;
        state: string;
        pin: string;
    };
}
//# sourceMappingURL=user.model.d.ts.map