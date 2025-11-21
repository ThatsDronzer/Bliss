import mongoose, { Document, model, Schema, Types } from 'mongoose';

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

  // Enhanced KYC for bidding system
  upiId?: string;
  idProof?: {
    type: 'aadhar' | 'pan' | 'driving_license' | 'passport' | 'voter_id';
    documentNumber: string;
    documentUrl: string; // Cloudinary URL
    verified: boolean;
    verifiedAt?: Date;
    verifiedBy?: string; // Admin ID
  };

  // Bidding access control
  adminApproved: boolean;
  adminApprovedAt?: Date;
  adminApprovedBy?: string; // Admin user ID
  canParticipateInBidding: boolean;

  // Prebuilt packages
  prebuiltPackages: mongoose.Schema.Types.ObjectId[]; // Reference to VendorPackage

  // Bidding statistics
  biddingStats?: {
    totalBids: number;
    wonBids: number;
    lostBids: number;
    averageBidAmount?: number;
    lowestBidAmount?: number;
    highestBidAmount?: number;
    winRate?: number; // Percentage
    lastBidDate?: Date;
  };

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

  // Enhanced KYC for bidding system
  upiId: {
    type: String,
    required: false,
  },

  idProof: {
    type: {
      type: String,
      enum: ['aadhar', 'pan', 'driving_license', 'passport', 'voter_id'],
    },
    documentNumber: String,
    documentUrl: String,
    verified: {
      type: Boolean,
      default: false,
    },
    verifiedAt: Date,
    verifiedBy: String,
  },

  // Bidding access control
  adminApproved: {
    type: Boolean,
    default: false,
  },
  adminApprovedAt: Date,
  adminApprovedBy: String,
  canParticipateInBidding: {
    type: Boolean,
    default: false,
  },

  // Prebuilt packages
  prebuiltPackages: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'VendorPackage',
    },
  ],

  // Bidding statistics
  biddingStats: {
    totalBids: {
      type: Number,
      default: 0,
    },
    wonBids: {
      type: Number,
      default: 0,
    },
    lostBids: {
      type: Number,
      default: 0,
    },
    averageBidAmount: Number,
    lowestBidAmount: Number,
    highestBidAmount: Number,
    winRate: Number,
    lastBidDate: Date,
  },

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
