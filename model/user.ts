import mongoose, { Schema, Document, model, models } from 'mongoose';

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
  },
  { timestamps: true }
);

const User = mongoose.models?.User || model<IUser>('User', userSchema);
export default User;
