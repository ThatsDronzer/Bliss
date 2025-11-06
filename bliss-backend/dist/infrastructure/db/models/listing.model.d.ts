import mongoose, { Document, Types } from 'mongoose';
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
declare const Listing: mongoose.Model<any, {}, {}, {}, any, any>;
export default Listing;
//# sourceMappingURL=listing.model.d.ts.map