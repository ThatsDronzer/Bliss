// models/Vendor.ts
import mongoose, { Document, Schema, Model } from "mongoose";

export interface IVendor extends Document {
  businessName?: string;
  businessType?: string;
  businessAddress?: string;
  businessCity?: string;
  businessState?: string;
  businessPincode?: string;
  businessPhone?: string;
  businessDescription?: string;
  establishedYear?: string;
  gstNumber?: string;
  panNumber?: string;
  ownerName?: string;
  ownerEmail?: string;
  ownerPhone?: string;
  ownerCity?: string;
  ownerState?: string;
  ownerPincode?: string;
  bankName?: string;
  accountNumber?: string;
  ifscCode?: string;
  accountHolderName?: string;
  createdAt?: Date;
  updatedAt?: Date;
  owner_image?: String;
}

const VendorSchema: Schema<IVendor> = new Schema(
  {
    businessName: String,
    businessType: String,
    businessAddress: String,
    businessCity: String,
    businessState: String,
    businessPincode: String,
    businessPhone: String,
    businessDescription: String,
    establishedYear: String,
    gstNumber: String,
    panNumber: String,
    ownerName: String,
    ownerEmail: String,
    ownerPhone: String,
    ownerCity: String,
    ownerState: String,
    ownerPincode: String,
    bankName: String,
    accountNumber: String,
    ifscCode: String,
    accountHolderName: String,
    owner_image: String,
  },
  { timestamps: true }
);

const VendorModel: Model<IVendor> =
  mongoose.models.VendorVerification ||
  mongoose.model<IVendor>("Vendor", VendorSchema);

export default VendorModel;
