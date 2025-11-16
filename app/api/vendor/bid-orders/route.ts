import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import dbConnect from '@/lib/dbConnect';
import { getAvailableBidOrders } from '@/lib/bidService';
import Vendor from '@/model/vendor';

/**
 * GET /api/vendor/bid-orders
 * Get available bid opportunities for the vendor
 */
export async function GET(req: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await dbConnect();

    // Get vendor by clerkId
    const vendor = await Vendor.findOne({ clerkId: userId });

    if (!vendor) {
      return NextResponse.json(
        { error: 'Vendor not found' },
        { status: 404 }
      );
    }

    // Check if vendor is approved for bidding
    if (!vendor.canParticipateInBidding) {
      return NextResponse.json(
        {
          error: 'You are not approved for bidding yet. Please complete KYC and wait for admin approval.',
          canBid: false,
        },
        { status: 403 }
      );
    }

    // Get available bid orders
    const result = await getAvailableBidOrders(vendor._id.toString());

    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        data: result.data,
        canBid: true,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Error fetching bid opportunities:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}
