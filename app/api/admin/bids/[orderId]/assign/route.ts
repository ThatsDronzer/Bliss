import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import dbConnect from '@/lib/dbConnect';
import { assignOrderToVendor } from '@/lib/bidService';

/**
 * PUT /api/admin/bids/[orderId]/assign
 * Assign the order to the winning vendor (after winner selection)
 */
export async function PUT(
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

    const { orderId } = params;
    const body = await req.json();
    const { prebookingAmount } = body;

    // Assign order to winning vendor
    const result = await assignOrderToVendor(
      orderId,
      userId,
      prebookingAmount
    );

    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Order assigned to vendor successfully',
        data: result.data,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Error assigning order:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}
