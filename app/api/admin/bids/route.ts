import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import dbConnect from '@/lib/dbConnect';
import { getBidOrders } from '@/lib/bidService';

/**
 * GET /api/admin/bids
 * Get all bid orders with optional filters (admin only)
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

    // Connect to database
    await dbConnect();

    // Get query parameters
    const searchParams = req.nextUrl.searchParams;
    const status = searchParams.get('status') || undefined;
    const orderType = searchParams.get('orderType') || undefined;
    const createdBy = searchParams.get('createdBy') || undefined;
    const assignedVendor = searchParams.get('assignedVendor') || undefined;
    const limit = parseInt(searchParams.get('limit') || '50');
    const skip = parseInt(searchParams.get('skip') || '0');

    // Get bid orders
    const result = await getBidOrders({
      status,
      orderType,
      createdBy,
      assignedVendor,
      limit,
      skip,
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
        data: result.data,
        total: result.total,
        limit,
        skip,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Error fetching bid orders:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}
