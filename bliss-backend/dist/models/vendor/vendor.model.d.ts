export interface IVendor {
    _id?: string;
    clerkId: string;
    ownerName: string;
    owner_contactNo?: string[];
    ownerEmail: string;
    ownerImage?: string;
    owner_address?: {
        State: string;
        City: string;
        location: string;
        pinCode: string;
    };
    ownerAadhar?: string;
    service_name?: string;
    service_email?: string;
    service_phone?: string;
    service_address?: {
        State: string;
        City: string;
        location: string;
        pinCode: string;
    };
    service_description?: string;
    establishedYear?: string;
    service_type?: string;
    gstNumber?: string;
    panNumber?: string;
    bankName?: string;
    accountNumber?: string;
    ifscCode?: string;
    accountHolderName?: string;
    listings?: string[];
    messages?: string[];
    createdAt?: Date;
    updatedAt?: Date;
    isVerified: boolean;
}
export interface ICreateVendorInput {
    clerkId: string;
    ownerName: string;
    owner_contactNo?: string[];
    ownerEmail: string;
    ownerImage?: string;
    owner_address?: {
        State: string;
        City: string;
        location: string;
        pinCode: string;
    };
    ownerAadhar?: string;
    service_name?: string;
    service_email?: string;
    service_phone?: string;
    service_address?: {
        State: string;
        City: string;
        location: string;
        pinCode: string;
    };
    service_description?: string;
    establishedYear?: string;
    service_type?: string;
    gstNumber?: string;
    panNumber?: string;
    bankName?: string;
    accountNumber?: string;
    ifscCode?: string;
    accountHolderName?: string;
    isVerified?: boolean;
}
export interface IUpdateVendorInput {
    ownerName?: string;
    owner_contactNo?: string[];
    ownerEmail?: string;
    ownerImage?: string;
    owner_address?: {
        State: string;
        City: string;
        location: string;
        pinCode: string;
    };
    ownerAadhar?: string;
    service_name?: string;
    service_email?: string;
    service_phone?: string;
    service_address?: {
        State: string;
        City: string;
        location: string;
        pinCode: string;
    };
    service_description?: string;
    establishedYear?: string;
    service_type?: string;
    gstNumber?: string;
    panNumber?: string;
    bankName?: string;
    accountNumber?: string;
    ifscCode?: string;
    accountHolderName?: string;
    isVerified?: boolean;
}
//# sourceMappingURL=vendor.model.d.ts.map