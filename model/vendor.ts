import mongoose, { Schema, Document, model } from 'mongoose';

export interface IVendor extends Document {
  clerkId: string;
  vendorId: string;
  service_name: string;
  service_Email: string;
  service_Phone: string;
  service_address: {
    State: string;
    City: string;
    location: string;
    pinCode: string;
  };
  gstNumber: string;
  createdAt?: Date;
  updatedAt?: Date;
  isVerified: boolean;
  ownerName: string;
  owner_contactNo: string[];
  ownerEmail: string;
  description: string; // Added new field
  established: string; // Added new field
  website: string; // Added new field
  status: string; // Added new field (derived from isVerified)
  joinDate: string; // Added new field
  rating: number; // Added new field
  totalBookings: number; // Added new field
  totalRevenue: string; // Added new field
  coins: number; // Added new field for wallet balance
  listings: mongoose.Schema.Types.ObjectId[]; // Added listings field
  // ownerImage: {
 
  //   // data: Buffer;
  //   // contentType: string;images: {
  //   url: string;
  // };
  ownerImage: string;
}

const vendorSchema = new Schema<IVendor>({
 clerkId: {
      type: String,
      required: true,
      unique: true,
    },
  // vendorId: {
  //   type: String,
  //   required: true,
  //   unique: true,
  // },
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
  
  service_name: {
    type: String,
    required: false,
  },
  service_Email: {
    type: String,
    required: false,
  },
  service_Phone: {
    type: String,
    required: false,
  },
  service_address: {
    State: { type: String, required: false },
    City: { type: String, required: false },
    location: { type: String, required: false },
    pinCode: { type: String, required: false },
  },
  gstNumber: {
    type: String,
    required: false,
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
  description: {
    type: String,
    required: false,
    default: ""
  },
  established: {
    type: String,
    required: false,
    default: ""
  },
  website: {
    type: String,
    required: false,
    default: ""
  },
  status: {
    type: String,
    required: false,
    default: "Not Verified"
  },
  joinDate: {
    type: String,
    required: false,
    default: new Date().toISOString().split('T')[0] // Default to current date
  },
  rating: {
    type: Number,
    required: false,
    default: 0
  },
  totalBookings: {
    type: Number,
    required: false,
    default: 0
  },
  totalRevenue: {
    type: String,
    required: false,
    default: "₹0"
  },
  coins: {
    type: Number,
    required: false,
    default: 0
  },
  listings: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Listing',
    },
  ], // Added listings field to schema
});

const Vendor = mongoose.models.Vendor || model<IVendor>('Vendor', vendorSchema);
export default Vendor;
