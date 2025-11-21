import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import dbConnect from '@/lib/dbConnect';
import { selectLowestBidAsWinner, closeBidding } from '@/lib/bidService';

/**
 * POST /api/admin/bids/[orderId]/select-winner
 * Auto-select the lowest bid as winner and close bidding
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

    const { orderId } = params;

    // First, close bidding if still open
    await closeBidding(orderId);

    // Then select lowest bid as winner
    const result = await selectLowestBidAsWinner(orderId);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Lowest bid selected as winner successfully',
        data: result.data,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Error selecting winner:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}
