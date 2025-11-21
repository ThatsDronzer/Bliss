import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IVendorPackage extends Document {
  vendor: mongoose.Types.ObjectId; // Reference to Vendor

  // Package details
  packageName: string;
  packageType: 'light' | 'sound' | 'decoration' | 'catering' | 'photography' | 'combo' | 'custom';
  description: string;

  // Items included in package
  items: Array<{
    name: string;
    description?: string;
    quantity?: number;
    basePrice?: number;
    imageUrl?: string;
  }>;

  // Pricing
  totalPrice: number;
  discount?: number;
  finalPrice: number;

  // Images
  images: Array<{
    url: string;
    public_id: string;
    caption?: string;
  }>;

  // Package specifications
  specifications?: {
    duration?: string; // e.g., "4 hours", "Full day"
    coverage?: string; // For photography, area coverage, etc.
    capacity?: string; // Number of guests, area size, etc.
    setup?: string; // Setup time, requirements
    additionalInfo?: string;
  };

  // Availability
  isActive: boolean;
  isPublic: boolean; // Whether shown on public marketplace
  availableForBidding: boolean; // Whether can be used in bid responses

  // Stats
  views: number;
  timesOrdered: number;
  averageRating?: number;

  // Metadata
  createdAt: Date;
  updatedAt: Date;
  lastOrderDate?: Date;
}

const VendorPackageSchema: Schema = new Schema({
  vendor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Vendor',
    required: true
  },

  packageName: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },

  packageType: {
    type: String,
    enum: ['light', 'sound', 'decoration', 'catering', 'photography', 'combo', 'custom'],
    required: true
  },

  description: {
    type: String,
    required: true,
    maxlength: 1000
  },

  items: [{
    name: { type: String, required: true },
    description: { type: String },
    quantity: { type: Number },
    basePrice: { type: Number },
    imageUrl: { type: String }
  }],

  totalPrice: {
    type: Number,
    required: true,
    min: 0
  },

  discount: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },

  finalPrice: {
    type: Number,
    required: true,
    min: 0
  },

  images: [{
    url: { type: String, required: true },
    public_id: { type: String, required: true },
    caption: { type: String }
  }],

  specifications: {
    duration: String,
    coverage: String,
    capacity: String,
    setup: String,
    additionalInfo: String
  },

  isActive: {
    type: Boolean,
    default: true
  },

  isPublic: {
    type: Boolean,
    default: true
  },

  availableForBidding: {
    type: Boolean,
    default: true
  },

  views: {
    type: Number,
    default: 0
  },

  timesOrdered: {
    type: Number,
    default: 0
  },

  averageRating: {
    type: Number,
    min: 0,
    max: 5
  },

  lastOrderDate: Date
}, {
  timestamps: true
});

// Indexes
VendorPackageSchema.index({ vendor: 1, isActive: 1 });
VendorPackageSchema.index({ packageType: 1, isPublic: 1, isActive: 1 });
VendorPackageSchema.index({ finalPrice: 1 });
VendorPackageSchema.index({ averageRating: -1 });

// Pre-save hook to calculate final price
VendorPackageSchema.pre('save', function(next) {
  if (this.isModified('totalPrice') || this.isModified('discount')) {
    const discountAmount = (this.totalPrice * (this.discount || 0)) / 100;
    this.finalPrice = this.totalPrice - discountAmount;
  }
  next();
});

// Method to increment views
VendorPackageSchema.methods.incrementViews = async function() {
  this.views += 1;
  await this.save();
};

// Method to increment orders
VendorPackageSchema.methods.incrementOrders = async function() {
  this.timesOrdered += 1;
  this.lastOrderDate = new Date();
  await this.save();
};

// Static method to get popular packages
VendorPackageSchema.statics.getPopularPackages = async function(limit = 10) {
  return this.find({ isPublic: true, isActive: true })
    .sort({ timesOrdered: -1, averageRating: -1 })
    .limit(limit)
    .populate('vendor', 'service_name owner_address isVerified')
    .exec();
};

// Static method to search packages
VendorPackageSchema.statics.searchPackages = async function(filters: {
  packageType?: string;
  minPrice?: number;
  maxPrice?: number;
  vendorId?: string;
  searchTerm?: string;
}) {
  const query: any = { isPublic: true, isActive: true };

  if (filters.packageType) {
    query.packageType = filters.packageType;
  }

  if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
    query.finalPrice = {};
    if (filters.minPrice !== undefined) query.finalPrice.$gte = filters.minPrice;
    if (filters.maxPrice !== undefined) query.finalPrice.$lte = filters.maxPrice;
  }

  if (filters.vendorId) {
    query.vendor = filters.vendorId;
  }

  if (filters.searchTerm) {
    query.$or = [
      { packageName: { $regex: filters.searchTerm, $options: 'i' } },
      { description: { $regex: filters.searchTerm, $options: 'i' } }
    ];
  }

  return this.find(query)
    .populate('vendor', 'service_name owner_address isVerified averageRating')
    .sort({ averageRating: -1, timesOrdered: -1 })
    .exec();
};

const VendorPackage: Model<IVendorPackage> = mongoose.models.VendorPackage || mongoose.model<IVendorPackage>('VendorPackage', VendorPackageSchema);

export default VendorPackage;
