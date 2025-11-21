import mongoose, { Schema, Document, Types, model } from 'mongoose';

export interface IListingImage {
  url: string;
  public_id: string;
}
export interface IListingItem {
  name: string;
  description: string;
  image: IListingImage;
  price: number;
}

export interface IListing extends Document {
  title: string;
  description: string;
  price: number;
  images?: IListingImage[];
  isActive: boolean;
  features?: string[];
  location: string;
  owner: Types.ObjectId;
  reviews: Types.ObjectId[];
  items?: IListingItem[];
  createdAt?: Date;
  updatedAt?: Date;
}

const listingImageSchema = new Schema<IListingImage>({
  url: {
    type: String,
    required: true
  },
  public_id: {
    type: String,
    required: true
  }
});

const listingItemSchema = new Schema<IListingItem>({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
    trim: true,
  },
  image: {
    type: listingImageSchema,
    required: true,
  },
  price: {
    type: Number,
    required: true,
    min: 0,
  },
});

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

    images: [listingImageSchema],
    isActive: {
      type: Boolean,
      default: true,
    },

    features: {
      type: [String],
      default: [],
    },
    location: {
      type: String,
      required: true,
    },
    reviews: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Review',
      },
    ],

    owner: {
      type: Schema.Types.ObjectId,
      ref: 'Vendor',
      required: true,
    },
    items: [listingItemSchema],
  },
  { timestamps: true }
);

const Listing = mongoose.models.Service || model<IListing>('Service', listingSchema);
export default Listing;
