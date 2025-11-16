import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IBid extends Document {
  bidOrder: mongoose.Types.ObjectId; // Reference to BidOrder
  vendor: mongoose.Types.ObjectId; // Reference to Vendor

  // Bid details
  totalPrice: number;
  priceBreakdown?: {
    basePrice: number;
    taxes?: number;
    additionalCharges?: number;
    discount?: number;
  };

  // Additional offerings
  additionalServices: Array<{
    name: string;
    description: string;
    included: boolean; // Whether it's free or charged
    price?: number;
  }>;

  // Vendor notes
  proposalNotes?: string;
  deliveryTimeline?: string;
  experienceDetails?: string;

  // Bid metadata
  submittedAt: Date;
  validUntil?: Date;
  status: 'submitted' | 'won' | 'lost' | 'withdrawn' | 'expired';

  // Winner details
  isWinner: boolean;
  selectedAt?: Date;
  selectedBy?: mongoose.Types.ObjectId; // Admin who selected

  // Withdrawal
  withdrawnAt?: Date;
  withdrawalReason?: string;
}

const BidSchema: Schema = new Schema({
  bidOrder: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'BidOrder',
    required: true
  },

  vendor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Vendor',
    required: true
  },

  totalPrice: {
    type: Number,
    required: true,
    min: 0
  },

  priceBreakdown: {
    basePrice: { type: Number },
    taxes: { type: Number },
    additionalCharges: { type: Number },
    discount: { type: Number }
  },

  additionalServices: [{
    name: { type: String, required: true },
    description: { type: String },
    included: { type: Boolean, default: false },
    price: { type: Number }
  }],

  proposalNotes: String,
  deliveryTimeline: String,
  experienceDetails: String,

  submittedAt: {
    type: Date,
    default: Date.now
  },

  validUntil: Date,

  status: {
    type: String,
    enum: ['submitted', 'won', 'lost', 'withdrawn', 'expired'],
    default: 'submitted'
  },

  isWinner: {
    type: Boolean,
    default: false
  },

  selectedAt: Date,

  selectedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },

  withdrawnAt: Date,
  withdrawalReason: String
}, {
  timestamps: true
});

// Indexes
BidSchema.index({ bidOrder: 1, vendor: 1 }); // Composite index for finding vendor's bid on specific order
BidSchema.index({ vendor: 1, status: 1 }); // For vendor's bid history
BidSchema.index({ bidOrder: 1, totalPrice: 1 }); // For finding lowest bid
BidSchema.index({ status: 1 });

// Prevent duplicate bids from same vendor on same order
BidSchema.index({ bidOrder: 1, vendor: 1 }, { unique: true });

// Method to check if bid is still valid
BidSchema.methods.isValid = function() {
  if (this.status === 'withdrawn' || this.status === 'expired') {
    return false;
  }
  if (this.validUntil && new Date() > this.validUntil) {
    this.status = 'expired';
    this.save();
    return false;
  }
  return true;
};

// Static method to find lowest bid for an order
BidSchema.statics.findLowestBid = async function(bidOrderId: mongoose.Types.ObjectId) {
  return this.findOne({
    bidOrder: bidOrderId,
    status: 'submitted'
  }).sort({ totalPrice: 1 }).exec();
};

// Static method to get all valid bids for an order
BidSchema.statics.getValidBids = async function(bidOrderId: mongoose.Types.ObjectId) {
  return this.find({
    bidOrder: bidOrderId,
    status: 'submitted'
  }).populate('vendor', 'service_name ownerName owner_contactNo service_email isVerified')
    .sort({ totalPrice: 1 })
    .exec();
};

const Bid: Model<IBid> = mongoose.models.Bid || mongoose.model<IBid>('Bid', BidSchema);

export default Bid;
