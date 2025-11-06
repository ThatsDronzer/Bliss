import mongoose, { Schema, Document, model, models, Types } from 'mongoose';

export interface IUser extends Document {
  clerkId: string;
  name: string;
  email: string;
  phone?: string;
  role: 'user' | 'vendor' | 'admin';
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
  }
  messages: Types.ObjectId[]; // Array of message IDs   
}

const userSchema = new Schema<IUser>(
  {
    clerkId: {
      type: String,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    phone: {
      type: String,
      required: false,
    },
    // role: {
    //   type: String,
    //   enum: ['user', 'vendor', 'admin'],
    //   default: 'user',
    // },
    coins: {
      type: Number,
      default: 0,
    },
    referralCode: {
      type: String,
      // unique: true,
      default:"NoT",

    },
    referredBy: {
      type: String,
      default: "Nada",
    },
    userVerified: {
      type: Boolean,
      default: false,
    },
    address: {
      houseNo: { type: String, required: false, trim: true, default: "" },
      areaName: { type: String, required: false, trim: true, default: "" },
      landmark: { type: String, required: false, trim: true, default: "" },
      postOffice: { type: String, required: false, trim: true, default: "" },
      state: { type: String, required: false, trim: true, default: "" },
      pin: { type: String, required: false, trim: true, default: "" }
    },
    messages: [{ type: Schema.Types.ObjectId, ref: 'MessageData' }],
  },
  
  { timestamps: true }
);

const User = mongoose.models?.User || model<IUser>('User', userSchema);
export default User;
