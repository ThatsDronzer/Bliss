// models/Vendor.ts
import mongoose from "mongoose";

const VendorSchema = new mongoose.Schema({
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
}, { timestamps: true });

export default mongoose.models.VendorVerification || mongoose.model("VendorVerification", VendorSchema)
