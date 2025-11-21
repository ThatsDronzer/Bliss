import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import dbConnect from '@/lib/dbConnect';
import { getVendorBids, withdrawBid } from '@/lib/bidService';
import Vendor from '@/model/vendor';

/**
 * GET /api/vendor/my-bids
 * Get all bids submitted by the vendor
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

    // Get query parameters
    const searchParams = req.nextUrl.searchParams;
    const status = searchParams.get('status') || undefined;

    // Get vendor's bids
    const result = await getVendorBids(vendor._id.toString(), status);

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
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Error fetching vendor bids:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/vendor/my-bids
 * Withdraw a bid (pass bidId in body)
 */
export async function DELETE(req: NextRequest) {
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

    const body = await req.json();
    const { bidId, reason } = body;

    if (!bidId) {
      return NextResponse.json(
        { error: 'Bid ID is required' },
        { status: 400 }
      );
    }

    // Withdraw the bid
    const result = await withdrawBid(bidId, vendor._id.toString(), reason);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Bid withdrawn successfully',
        data: result.data,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Error withdrawing bid:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}
