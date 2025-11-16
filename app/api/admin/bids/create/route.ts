import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import dbConnect from '@/lib/dbConnect';
import { createBidOrder } from '@/lib/bidService';

/**
 * POST /api/admin/bids/create
 * Create a new bid order (admin only)
 */
export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Connect to database
    await dbConnect();

    // Parse request body
    const body = await req.json();

    const {
      orderType,
      orderTitle,
      orderDescription,
      requirements,
      biddingDeadline,
      minimumBid,
      maximumBid,
      originalBooking, // Optional: if converting from customer booking
    } = body;

    // Validate required fields
    if (!orderType || !orderTitle || !orderDescription || !requirements || !biddingDeadline) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate requirements structure
    if (!requirements.items || !requirements.eventDate || !requirements.location) {
      return NextResponse.json(
        { error: 'Invalid requirements structure. Must include items, eventDate, and location' },
        { status: 400 }
      );
    }

    // Validate bidding deadline is in the future
    const deadline = new Date(biddingDeadline);
    if (deadline <= new Date()) {
      return NextResponse.json(
        { error: 'Bidding deadline must be in the future' },
        { status: 400 }
      );
    }

    // Create bid order
    const result = await createBidOrder({
      orderType,
      orderTitle,
      orderDescription,
      requirements,
      biddingDeadline: deadline,
      minimumBid,
      maximumBid,
      createdBy: userId,
      originalBooking,
    });

    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Bid order created successfully',
        data: result.data,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Error creating bid order:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}
