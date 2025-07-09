import mongoose, { Schema, Document, model } from 'mongoose';

export interface IVendor extends Document {
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
  ownerImage: {
    // data: Buffer;
    // contentType: string;images: {
    url: string;

    
  };
}

const vendorSchema = new Schema<IVendor>({
  vendorId: {
    type: String,
    required: true,
    unique: true,
  },
  service_name: {
    type: String,
    required: true,
  },
  service_Email: {
    type: String,
    required: true,
  },
  service_Phone: {
    type: String,
    required: true,
  },
  service_address: {
    State: { type: String, required: true },
    City: { type: String, required: true },
    location: { type: String, required: true },
    pinCode: { type: String, required: true },
  },
  gstNumber: {
    type: String,
    required: true,
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
  ownerName: {
    type: String,
    required: true,
  },
  owner_contactNo: {
    type: [String],
    required: true,
  },
  ownerEmail: {
    type: String,
    required: true,
  },
  ownerImage: {
    // data: Buffer,
    // contentType: String,
    // url:"https://www.emamiltd.in/wp-content/themes/emami/images/Fair-and-Handsome02-mob-new.jpg"

     url: { type: String, required: true }
  },
});

const Vendor = mongoose.models.Vendor || model<IVendor>('Vendor', vendorSchema);
export default Vendor;
