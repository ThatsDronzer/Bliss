import mongoose, { Schema, Document, Types, model } from 'mongoose';

export interface IListing extends Document {
  title: string;
  description: string;
  price: number;
  images: {
    url: string;
    // filename: string;
  }[];
  isActive: boolean;
  features: string[];
  ratings: Types.ObjectId[];
  location: string;
  owner: Types.ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
}

const listingSchema = new Schema<IListing>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
    },

    price: {
      type: Number,
      required: true,
      min: 0,
    },

    images: [
      // {
      //   url: { type: String, required: true },
      //   filename: { type: String, required: true },
      // },
      // {
      //   url:"https://images.unsplash.com/photo-1492684223066-81342ee5ff30?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8ZXZlbnR8ZW58MHx8MHx8fDA%3D"
      // },
      // {
      //   url:"https://images.pexels.com/photos/2747449/pexels-photo-2747449.jpeg?cs=srgb&dl=pexels-wolfgang-1002140-2747449.jpg&fm=jpg"
      // }
       {
        url: { type: String, required: true }, // Explicitly define the type as String
        // filename: { type: String, required: true }, // Uncomment this if you intend to use filename
      },
    ],

    isActive: {
      type: Boolean,
      default: true,
    },

    features: {
      type: [String],
      default: [],
    },

    ratings: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Rating',
      },
    ],

    location: {
      type: String,
      required: true,
    },

    owner: {
      type: Schema.Types.ObjectId,
      ref: 'Vendor',
      required: true,
    },
  },
  { timestamps: true }
);

const Listing = mongoose.models.Service || model<IListing>('Service', listingSchema);
export default Listing;
