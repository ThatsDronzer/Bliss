import mongoose from 'mongoose';
import BidOrder from '@/model/bidOrder';
import Bid from '@/model/bid';
import Vendor from '@/model/vendor';

/**
 * Create a new bid order
 */
export async function createBidOrder(data: {
  orderType: string;
  orderTitle: string;
  orderDescription: string;
  requirements: any;
  biddingDeadline: Date;
  minimumBid?: number;
  maximumBid?: number;
  createdBy: string; // Admin user ID
  originalBooking?: string; // Optional MessageData ID if converted from booking
}) {
  try {
    const bidOrder = await BidOrder.create({
      ...data,
      isConvertedFromBooking: !!data.originalBooking,
      status: 'open',
      totalBidsReceived: 0,
    });

    return {
      success: true,
      data: bidOrder,
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message,
    };
  }
}

/**
 * Get all bid orders with optional filters
 */
export async function getBidOrders(filters: {
  status?: string;
  orderType?: string;
  createdBy?: string;
  assignedVendor?: string;
  limit?: number;
  skip?: number;
}) {
  try {
    const query: any = {};

    if (filters.status) query.status = filters.status;
    if (filters.orderType) query.orderType = filters.orderType;
    if (filters.createdBy) query.createdBy = filters.createdBy;
    if (filters.assignedVendor) query.assignedVendor = filters.assignedVendor;

    const bidOrders = await BidOrder.find(query)
      .populate('createdBy', 'name email')
      .populate('assignedVendor', 'service_name ownerName owner_contactNo')
      .populate('winningBid')
      .sort({ createdAt: -1 })
      .limit(filters.limit || 50)
      .skip(filters.skip || 0);

    const total = await BidOrder.countDocuments(query);

    return {
      success: true,
      data: bidOrders,
      total,
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message,
    };
  }
}

/**
 * Get a single bid order by ID with all bids
 */
export async function getBidOrderWithBids(bidOrderId: string) {
  try {
    const bidOrder = await BidOrder.findById(bidOrderId)
      .populate('createdBy', 'name email')
      .populate('assignedVendor', 'service_name ownerName owner_contactNo ownerEmail')
      .populate('winningBid');

    if (!bidOrder) {
      return {
        success: false,
        error: 'Bid order not found',
      };
    }

    // Get all bids for this order
    const bids = await Bid.find({ bidOrder: bidOrderId })
      .populate('vendor', 'service_name ownerName owner_contactNo ownerEmail isVerified biddingStats')
      .sort({ totalPrice: 1 }); // Sort by price (lowest first)

    return {
      success: true,
      data: {
        bidOrder,
        bids,
      },
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message,
    };
  }
}

/**
 * Close bidding for an order
 */
export async function closeBidding(bidOrderId: string) {
  try {
    const bidOrder = await BidOrder.findById(bidOrderId);

    if (!bidOrder) {
      return {
        success: false,
        error: 'Bid order not found',
      };
    }

    if (bidOrder.status !== 'open') {
      return {
        success: false,
        error: 'Bidding is already closed',
      };
    }

    bidOrder.status = 'bidding_closed';
    await bidOrder.save();

    return {
      success: true,
      data: bidOrder,
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message,
    };
  }
}

/**
 * Auto-select the lowest bid as winner
 */
export async function selectLowestBidAsWinner(bidOrderId: string) {
  try {
    const bidOrder = await BidOrder.findById(bidOrderId);

    if (!bidOrder) {
      return {
        success: false,
        error: 'Bid order not found',
      };
    }

    if (bidOrder.totalBidsReceived === 0) {
      return {
        success: false,
        error: 'No bids received for this order',
      };
    }

    // Find the lowest bid
    const lowestBid = await Bid.findOne({
      bidOrder: bidOrderId,
      status: 'submitted',
    }).sort({ totalPrice: 1 });

    if (!lowestBid) {
      return {
        success: false,
        error: 'No valid bids found',
      };
    }

    // Update the winning bid
    lowestBid.status = 'won';
    lowestBid.isWinner = true;
    await lowestBid.save();

    // Update all other bids as lost
    await Bid.updateMany(
      {
        bidOrder: bidOrderId,
        _id: { $ne: lowestBid._id },
        status: 'submitted',
      },
      {
        status: 'lost',
      }
    );

    // Update bid order with winner info
    bidOrder.winningBid = lowestBid._id as mongoose.Types.ObjectId;
    bidOrder.status = 'bidding_closed';
    await bidOrder.save();

    return {
      success: true,
      data: {
        bidOrder,
        winningBid: lowestBid,
      },
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message,
    };
  }
}

/**
 * Assign order to winning vendor
 */
export async function assignOrderToVendor(
  bidOrderId: string,
  adminId: string,
  prebookingAmount?: number
) {
  try {
    const bidOrder = await BidOrder.findById(bidOrderId).populate('winningBid');

    if (!bidOrder) {
      return {
        success: false,
        error: 'Bid order not found',
      };
    }

    if (!bidOrder.winningBid) {
      return {
        success: false,
        error: 'No winning bid selected',
      };
    }

    const winningBid = await Bid.findById(bidOrder.winningBid).populate('vendor');

    if (!winningBid) {
      return {
        success: false,
        error: 'Winning bid not found',
      };
    }

    // Assign the order to the vendor
    bidOrder.assignedVendor = winningBid.vendor._id;
    bidOrder.assignedAt = new Date();
    bidOrder.assignedBy = new mongoose.Types.ObjectId(adminId);
    bidOrder.status = 'assigned';

    if (prebookingAmount) {
      bidOrder.prebookingAmount = prebookingAmount;
    }

    await bidOrder.save();

    // Update vendor's bidding stats
    await updateVendorBiddingStats(winningBid.vendor._id.toString(), 'won', winningBid.totalPrice);

    // Update losing vendors' stats
    const losingBids = await Bid.find({
      bidOrder: bidOrderId,
      status: 'lost',
    });

    for (const losingBid of losingBids) {
      await updateVendorBiddingStats(losingBid.vendor.toString(), 'lost', losingBid.totalPrice);
    }

    return {
      success: true,
      data: {
        bidOrder,
        assignedVendor: winningBid.vendor,
      },
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message,
    };
  }
}

/**
 * Update vendor bidding statistics
 */
export async function updateVendorBiddingStats(
  vendorId: string,
  result: 'won' | 'lost',
  bidAmount: number
) {
  try {
    const vendor = await Vendor.findById(vendorId);

    if (!vendor) {
      return { success: false, error: 'Vendor not found' };
    }

    // Initialize biddingStats if it doesn't exist
    if (!vendor.biddingStats) {
      vendor.biddingStats = {
        totalBids: 0,
        wonBids: 0,
        lostBids: 0,
      };
    }

    // Update stats
    vendor.biddingStats.totalBids += 1;

    if (result === 'won') {
      vendor.biddingStats.wonBids += 1;
    } else {
      vendor.biddingStats.lostBids += 1;
    }

    // Update bid amounts
    if (!vendor.biddingStats.lowestBidAmount || bidAmount < vendor.biddingStats.lowestBidAmount) {
      vendor.biddingStats.lowestBidAmount = bidAmount;
    }

    if (!vendor.biddingStats.highestBidAmount || bidAmount > vendor.biddingStats.highestBidAmount) {
      vendor.biddingStats.highestBidAmount = bidAmount;
    }

    // Calculate average
    const allBids = vendor.biddingStats.totalBids;
    const currentAvg = vendor.biddingStats.averageBidAmount || 0;
    vendor.biddingStats.averageBidAmount = (currentAvg * (allBids - 1) + bidAmount) / allBids;

    // Calculate win rate
    vendor.biddingStats.winRate = (vendor.biddingStats.wonBids / vendor.biddingStats.totalBids) * 100;

    vendor.biddingStats.lastBidDate = new Date();

    await vendor.save();

    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

/**
 * Submit a bid
 */
export async function submitBid(data: {
  bidOrderId: string;
  vendorId: string;
  totalPrice: number;
  additionalServices?: any[];
  proposalNotes?: string;
  deliveryTimeline?: string;
  priceBreakdown?: any;
}) {
  try {
    // Check if vendor is approved for bidding
    const vendor = await Vendor.findById(data.vendorId);

    if (!vendor) {
      return {
        success: false,
        error: 'Vendor not found',
      };
    }

    if (!vendor.canParticipateInBidding) {
      return {
        success: false,
        error: 'Vendor is not approved for bidding. Please complete KYC and wait for admin approval.',
      };
    }

    // Check if bid order exists and is open
    const bidOrder = await BidOrder.findById(data.bidOrderId);

    if (!bidOrder) {
      return {
        success: false,
        error: 'Bid order not found',
      };
    }

    if (bidOrder.status !== 'open') {
      return {
        success: false,
        error: 'Bidding is closed for this order',
      };
    }

    if (new Date() > bidOrder.biddingDeadline) {
      return {
        success: false,
        error: 'Bidding deadline has passed',
      };
    }

    // Check if vendor already has a bid
    const existingBid = await Bid.findOne({
      bidOrder: data.bidOrderId,
      vendor: data.vendorId,
    });

    if (existingBid) {
      return {
        success: false,
        error: 'You have already submitted a bid for this order. Please withdraw the existing bid first.',
      };
    }

    // Create the bid
    const bid = await Bid.create({
      bidOrder: data.bidOrderId,
      vendor: data.vendorId,
      totalPrice: data.totalPrice,
      additionalServices: data.additionalServices || [],
      proposalNotes: data.proposalNotes,
      deliveryTimeline: data.deliveryTimeline,
      priceBreakdown: data.priceBreakdown,
      submittedAt: new Date(),
      status: 'submitted',
    });

    // Update bid order stats
    bidOrder.totalBidsReceived += 1;

    if (!bidOrder.lowestBidAmount || data.totalPrice < bidOrder.lowestBidAmount) {
      bidOrder.lowestBidAmount = data.totalPrice;
    }

    if (!bidOrder.highestBidAmount || data.totalPrice > bidOrder.highestBidAmount) {
      bidOrder.highestBidAmount = data.totalPrice;
    }

    await bidOrder.save();

    return {
      success: true,
      data: bid,
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message,
    };
  }
}

/**
 * Get vendor's bids
 */
export async function getVendorBids(vendorId: string, status?: string) {
  try {
    const query: any = { vendor: vendorId };

    if (status) {
      query.status = status;
    }

    const bids = await Bid.find(query)
      .populate('bidOrder', 'orderTitle orderType requirements status biddingDeadline')
      .sort({ submittedAt: -1 });

    return {
      success: true,
      data: bids,
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message,
    };
  }
}

/**
 * Get available bid opportunities for a vendor
 */
export async function getAvailableBidOrders(vendorId: string) {
  try {
    // Get all open bid orders where deadline hasn't passed
    const bidOrders = await BidOrder.find({
      status: 'open',
      biddingDeadline: { $gt: new Date() },
    }).sort({ biddingDeadline: 1 });

    // Check which orders the vendor has already bid on
    const vendorBids = await Bid.find({
      vendor: vendorId,
      bidOrder: { $in: bidOrders.map((bo) => bo._id) },
    });

    const bidOrderIds = new Set(vendorBids.map((b) => b.bidOrder.toString()));

    // Filter out orders vendor has already bid on
    const availableOrders = bidOrders.filter(
      (order) => !bidOrderIds.has(order._id.toString())
    );

    return {
      success: true,
      data: availableOrders,
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message,
    };
  }
}

/**
 * Withdraw a bid
 */
export async function withdrawBid(bidId: string, vendorId: string, reason?: string) {
  try {
    const bid = await Bid.findOne({ _id: bidId, vendor: vendorId });

    if (!bid) {
      return {
        success: false,
        error: 'Bid not found',
      };
    }

    if (bid.status !== 'submitted') {
      return {
        success: false,
        error: 'Can only withdraw submitted bids',
      };
    }

    bid.status = 'withdrawn';
    bid.withdrawnAt = new Date();
    bid.withdrawalReason = reason;
    await bid.save();

    // Update bid order stats
    const bidOrder = await BidOrder.findById(bid.bidOrder);
    if (bidOrder) {
      bidOrder.totalBidsReceived -= 1;
      await bidOrder.save();
    }

    return {
      success: true,
      data: bid,
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message,
    };
  }
}

/**
 * Cancel a bid order
 */
export async function cancelBidOrder(bidOrderId: string, adminId: string, reason: string) {
  try {
    const bidOrder = await BidOrder.findById(bidOrderId);

    if (!bidOrder) {
      return {
        success: false,
        error: 'Bid order not found',
      };
    }

    if (bidOrder.status === 'completed' || bidOrder.status === 'in_progress') {
      return {
        success: false,
        error: 'Cannot cancel order in progress or completed',
      };
    }

    bidOrder.status = 'cancelled';
    bidOrder.cancelledAt = new Date();
    bidOrder.cancellationReason = reason;
    await bidOrder.save();

    // Update all submitted bids to withdrawn
    await Bid.updateMany(
      { bidOrder: bidOrderId, status: 'submitted' },
      { status: 'withdrawn', withdrawnAt: new Date(), withdrawalReason: 'Order cancelled by admin' }
    );

    return {
      success: true,
      data: bidOrder,
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message,
    };
  }
}
