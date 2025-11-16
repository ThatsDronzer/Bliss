import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IBidOrder extends Document {
  orderId: string;
  orderType: 'light' | 'sound' | 'decoration' | 'catering' | 'photography' | 'combo' | 'other';
  orderTitle: string;
  orderDescription: string;

  // Order details
  requirements: {
    items: Array<{
      name: string;
      quantity?: number;
      specifications?: string;
    }>;
    eventDate: Date;
    eventTime?: string;
    eventDuration?: string;
    location: {
      address: string;
      city: string;
      state: string;
      pinCode: string;
    };
    estimatedBudget?: number;
    specialInstructions?: string;
  };

  // Bidding configuration
  status: 'open' | 'bidding_closed' | 'assigned' | 'in_progress' | 'completed' | 'cancelled';
  biddingDeadline: Date;
  minimumBid?: number;
  maximumBid?: number;

  // Admin details
  createdBy: mongoose.Types.ObjectId; // Reference to User (admin)
  createdAt: Date;

  // Optional: Link to original customer booking if converted
  originalBooking?: mongoose.Types.ObjectId; // Reference to MessageData
  isConvertedFromBooking: boolean;

  // Assignment details
  assignedVendor?: mongoose.Types.ObjectId; // Reference to Vendor
  winningBid?: mongoose.Types.ObjectId; // Reference to Bid
  assignedAt?: Date;
  assignedBy?: mongoose.Types.ObjectId; // Admin who assigned

  // Payment details
  prebookingAmount?: number;
  prebookingPaid: boolean;
  prebookingPaidAt?: Date;
  finalPaymentAmount?: number;
  finalPaymentPaid: boolean;
  finalPaymentPaidAt?: Date;

  // Stats
  totalBidsReceived: number;
  lowestBidAmount?: number;
  highestBidAmount?: number;

  // Completion
  completedAt?: Date;
  cancelledAt?: Date;
  cancellationReason?: string;
}

const BidOrderSchema: Schema = new Schema({
  orderId: {
    type: String,
    required: true,
    unique: true,
    default: () => `BO-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`
  },

  orderType: {
    type: String,
    enum: ['light', 'sound', 'decoration', 'catering', 'photography', 'combo', 'other'],
    required: true
  },

  orderTitle: {
    type: String,
    required: true,
    trim: true
  },

  orderDescription: {
    type: String,
    required: true
  },

  requirements: {
    items: [{
      name: { type: String, required: true },
      quantity: { type: Number },
      specifications: { type: String }
    }],

    eventDate: {
      type: Date,
      required: true
    },

    eventTime: String,
    eventDuration: String,

    location: {
      address: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      pinCode: { type: String, required: true }
    },

    estimatedBudget: Number,
    specialInstructions: String
  },

  status: {
    type: String,
    enum: ['open', 'bidding_closed', 'assigned', 'in_progress', 'completed', 'cancelled'],
    default: 'open'
  },

  biddingDeadline: {
    type: Date,
    required: true
  },

  minimumBid: Number,
  maximumBid: Number,

  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },

  createdAt: {
    type: Date,
    default: Date.now
  },

  originalBooking: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'MessageData'
  },

  isConvertedFromBooking: {
    type: Boolean,
    default: false
  },

  assignedVendor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Vendor'
  },

  winningBid: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Bid'
  },

  assignedAt: Date,

  assignedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },

  prebookingAmount: Number,
  prebookingPaid: {
    type: Boolean,
    default: false
  },
  prebookingPaidAt: Date,

  finalPaymentAmount: Number,
  finalPaymentPaid: {
    type: Boolean,
    default: false
  },
  finalPaymentPaidAt: Date,

  totalBidsReceived: {
    type: Number,
    default: 0
  },

  lowestBidAmount: Number,
  highestBidAmount: Number,

  completedAt: Date,
  cancelledAt: Date,
  cancellationReason: String
}, {
  timestamps: true
});

// Indexes for performance
BidOrderSchema.index({ status: 1, biddingDeadline: 1 });
BidOrderSchema.index({ createdBy: 1 });
BidOrderSchema.index({ assignedVendor: 1 });
BidOrderSchema.index({ orderId: 1 });

// Auto-close bidding when deadline passes
BidOrderSchema.methods.checkAndCloseBidding = async function() {
  if (this.status === 'open' && new Date() > this.biddingDeadline) {
    this.status = 'bidding_closed';
    await this.save();
    return true;
  }
  return false;
};

const BidOrder: Model<IBidOrder> = mongoose.models.BidOrder || mongoose.model<IBidOrder>('BidOrder', BidOrderSchema);

export default BidOrder;
