import { NextRequest, NextResponse } from 'next/server';
import { getAuth } from '@clerk/nextjs/server';
import MessageData from '@/model/message';
import dbConnect from '@/lib/dbConnect';

export async function GET(request: NextRequest) {
  try {
    const { userId } = getAuth(request);
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;
    const serviceId = searchParams.get('serviceId');

    if (!serviceId) {
      return NextResponse.json({ error: 'Service ID is required' }, { status: 400 });
    }

    await dbConnect();

    // Find the most recent booking for this user and service
    const booking = await MessageData.findOne({
      'user.id': userId,
      'listing.id': serviceId,
      'bookingDetails.status': { $in: ['pending', 'accepted', 'cancelled'] }
    })
    .sort({ createdAt: -1 })
    .select('_id bookingDetails.status paymentStatus createdAt listing.title bookingDetails.totalPrice');

    if (!booking) {
      return NextResponse.json({ 
        booking: null,
        message: 'No booking found for this service'
      });
    }

    return NextResponse.json({
      booking: {
        _id: booking._id.toString(),
        status: booking.bookingDetails.status,
        paymentStatus: booking.paymentStatus,
        createdAt: booking.createdAt,
        listingTitle: booking.listing.title,
        totalPrice: booking.bookingDetails.totalPrice,
        canMakePayment: booking.bookingDetails.status === 'accepted' && booking.paymentStatus.status === 'pending'
      }
    });

  } catch (error) {
    console.error('Error checking booking status:', error);
    return NextResponse.json(
      { 
        message: 'Internal server error',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}