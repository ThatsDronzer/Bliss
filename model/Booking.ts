import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IBooking extends Document {
  payment: Types.ObjectId;
  message: Types.ObjectId;
  user: {
    id: string;
    name: string;
    email: string;
    phone?: string;
  };
  vendor: {
    id: string;
    name: string;
    email: string;
    phone?: string;
    service: string;
  };
  service: {
    id: Types.ObjectId;
    title: string;
    price: number;
  };
  bookingDetails: {
    selectedItems: {
      name: string;
      price: number;
    }[];
    totalPrice: number;
    bookingDate: Date;
    bookingTime: string;
    address: {
      houseNo: string;
      areaName: string;
      landmark: string;
      state: string;
      pin: string;
    };
  };
  paymentStatus: {
    advancePaid: boolean;
    advancePaidAt?: Date;
    fullPaid: boolean;
    fullPaidAt?: Date;
  };
  status: 'upcoming' | 'completed' | 'cancelled';
  createdAt: Date;
  updatedAt: Date;
}

const BookingSchema = new Schema<IBooking>({
  payment: { type: Schema.Types.ObjectId, ref: 'Payment', required: true },
  message: { type: Schema.Types.ObjectId, ref: 'MessageData', required: true },
  
  user: {
    id: { type: String, required: true },
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String }
  },
  
  vendor: {
    id: { type: String, required: true },
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String },
    service: { type: String, required: true }
  },
  
  service: {
    id: { type: Schema.Types.ObjectId, ref: 'Listing', required: true },
    title: { type: String, required: true },
    price: { type: Number, required: true }
  },
  
  bookingDetails: {
    selectedItems: [{
      name: { type: String, required: true },
      price: { type: Number, required: true }
    }],
    totalPrice: { type: Number, required: true },
    bookingDate: { type: Date, required: true },
    bookingTime: { type: String, required: true },
    address: {
      houseNo: { type: String, required: true },
      areaName: { type: String, required: true },
      landmark: { type: String, required: true },
      state: { type: String, required: true },
      pin: { type: String, required: true }
    }
  },
  
  paymentStatus: {
    advancePaid: { type: Boolean, default: false },
    advancePaidAt: { type: Date },
    fullPaid: { type: Boolean, default: false },
    fullPaidAt: { type: Date }
  },
  
  status: {
    type: String,
    enum: ['upcoming', 'completed', 'cancelled'],
    default: 'upcoming'
  }
}, {
  timestamps: true
});

export default mongoose.models.Booking || mongoose.model<IBooking>('Booking', BookingSchema);