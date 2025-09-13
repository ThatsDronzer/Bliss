import mongoose, { Schema, Document, model, Types } from 'mongoose';

export interface IVendor extends Document {
  clerkId: string;

  //owner related info-
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
  ownerAadhar:string;
  
  //Business related info-
  service_name: string;
  service_email: string;
  service_phone: string;
  service_address: {
    State: string;
    City: string;
    location: string;
    pinCode: string;
  };
  service_description:string;
  establishedYear:string;
  service_type: string;
  gstNumber: string;
  panNumber:string;

  
  // Bank Details
  bankName: string;
  accountNumber: string;
  ifscCode: string;
  accountHolderName: string;

  
  listings: mongoose.Schema.Types.ObjectId[]; // Added listings field

   messages: Types.ObjectId[]; // Array of message IDs

  createdAt?: Date;
  updatedAt?: Date;
  isVerified: boolean;
}

const vendorSchema = new Schema<IVendor>({
  clerkId: {
    type: String,
    required: true,
    unique: true,
  },

  // owner related info-

  ownerName: {
    type: String,
    required: true,
  },
  owner_contactNo: {
    type: [String],
    required: false,
  },
  ownerEmail: {
    type: String,
    required: true,
  },
  ownerImage: {
    type: String,
    default:"https://www.emamiltd.in/wp-content/themes/emami/images/Fair-and-Handsome02-mob-new.jpg"
  },
  owner_address: {
    State: { type: String, required: false },
    City: { type: String, required: false },
    location: { type: String, required: false },
    pinCode: { type: String, required: false },
  },
  ownerAadhar: {
    type: String,
    required:false,
  },

  // Business retaled info------------------------------------
  
  service_name: {
    type: String,
    required: false,
  },
  service_email: {
    type: String,
    required: false,
  },
  service_phone: {
    type: String,
    required: false,
  },
  service_address: {
    State: { type: String, required: false },
    City: { type: String, required: false },
    location: { type: String, required: false },
    pinCode: { type: String, required: false },
  },
  service_description:{
    type: String,
    required: false,
  },
  establishedYear:{
    type: String,
    required: false,
  },
  service_type:{
    type: String,
    required: false,
  },
  gstNumber: {
    type: String,
    required: false,
  },
  panNumber: {
    type: String,
    required: false,
  },


  //Bank related info-----------------------------------
  bankName:{
    type: String,
    required: false,
  },
  accountNumber:{
    type: String,
    required: false,
  },
  ifscCode: {
    type: String,
    required: false,
  },
  accountHolderName: {
    type: String,
    required: false,
  },



  listings: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Listing',
    },
  ], // Added listings field to schema

  messages: [{ type: Schema.Types.ObjectId, ref: 'MessageData' }],

  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
});

const Vendor = mongoose.models.Vendor || model<IVendor>('Vendor', vendorSchema);
export default Vendor;
