import mongoose, { Document, Types } from 'mongoose';
export interface IVendor extends Document {
    clerkId: string;
    ownerName: string;
    owner_contactNo: string[];
    ownerEmail: string;
    ownerImage: string;
    owner_address: {
        State: string;
        City: string;
        location: string;
        pinCode: string;
    };
    ownerAadhar: string;
    service_name: string;
    service_email: string;
    service_phone: string;
    service_address: {
        State: string;
        City: string;
        location: string;
        pinCode: string;
    };
    service_description: string;
    establishedYear: string;
    service_type: string;
    gstNumber: string;
    panNumber: string;
    bankName: string;
    accountNumber: string;
    ifscCode: string;
    accountHolderName: string;
    listings: mongoose.Schema.Types.ObjectId[];
    messages: Types.ObjectId[];
    createdAt?: Date;
    updatedAt?: Date;
    isVerified: boolean;
}
declare const Vendor: mongoose.Model<any, {}, {}, {}, any, any>;
export default Vendor;
//# sourceMappingURL=vendor.model.d.ts.map