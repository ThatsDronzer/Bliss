import { NextRequest, NextResponse } from 'next/server';
import { getAuth } from '@clerk/nextjs/server';
import MessageData from '@/model/message';
import dbConnect from '@/lib/dbConnect';

export async function PATCH(
  request: NextRequest,
  { params }: { params: { requestId: string } }
) {
  try {
    const { userId } = getAuth(request);
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { status } = await request.json();
    
    if (status !== 'cancelled') {
      return NextResponse.json({ 
        error: 'Invalid status. Only cancellation allowed from user side.' 
      }, { status: 400 });
    }

    await dbConnect();

    // Update the message status to cancelled
    const updatedMessage = await MessageData.findOneAndUpdate(
      {
        _id: params.requestId,
        'user.id': userId,
        'bookingDetails.status': { $in: ['pending', 'accepted'] }
      },
      {
        'bookingDetails.status': 'cancelled',
        $set: {
          'paymentStatus.status': 'cancelled'
        }
      },
      { new: true }
    );

    if (!updatedMessage) {
      return NextResponse.json({ 
        error: 'Booking request not found or cannot be cancelled' 
      }, { status: 404 });
    }

    return NextResponse.json({
      message: 'Booking cancelled successfully',
      booking: {
        _id: updatedMessage._id.toString(),
        status: updatedMessage.bookingDetails.status,
        paymentStatus: updatedMessage.paymentStatus.status
      }
    });

  } catch (error) {
    console.error('Error cancelling booking:', error);
    return NextResponse.json(
      { 
        message: 'Internal server error',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}