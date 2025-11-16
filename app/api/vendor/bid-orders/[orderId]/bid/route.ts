import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import dbConnect from '@/lib/dbConnect';
import { submitBid } from '@/lib/bidService';
import Vendor from '@/model/vendor';

/**
 * POST /api/vendor/bid-orders/[orderId]/bid
 * Submit a bid for a specific order
 */
export async function POST(
  req: NextRequest,
  { params }: { params: { orderId: string } }
) {
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

    const { orderId } = params;
    const body = await req.json();

    const {
      totalPrice,
      additionalServices,
      proposalNotes,
      deliveryTimeline,
      priceBreakdown,
    } = body;

    // Validate required fields
    if (!totalPrice || totalPrice <= 0) {
      return NextResponse.json(
        { error: 'Valid total price is required' },
        { status: 400 }
      );
    }

    // Submit the bid
    const result = await submitBid({
      bidOrderId: orderId,
      vendorId: vendor._id.toString(),
      totalPrice,
      additionalServices,
      proposalNotes,
      deliveryTimeline,
      priceBreakdown,
    });

    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Bid submitted successfully',
        data: result.data,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Error submitting bid:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}
