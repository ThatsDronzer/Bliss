import { NextRequest, NextResponse } from 'next/server'
import { getAuth } from '@clerk/nextjs/server'
import MessageData from '@/model/message'
import dbConnect from '@/lib/dbConnect'

export async function PATCH(
  request: NextRequest,
  { params }: { params: { requestId: string } }
) {
  try {
    const { userId } = getAuth(request)
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { status } = await request.json()
    console.log('Updating status for request:', params.requestId, 'to:', status);
    
    if (!status || !['accepted', 'not-accepted'].includes(status)) {
      console.log('Invalid status:', status);
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 })
    }

    // Connect to database
    await dbConnect()
    console.log('Connected to database');

    // Update the message status
    console.log('Updating message with query:', {
      _id: params.requestId,
      'vendor.id': userId
    });
    
    const updatedMessage = await MessageData.findOneAndUpdate(
      {
        _id: params.requestId,
        'vendor.id': userId
      },
      {
        'bookingDetails.status': status
      },
      { new: true, lean: true }
    )

    if (!updatedMessage) {
      console.log('No message found with ID:', params.requestId);
      return NextResponse.json({ error: 'Booking request not found' }, { status: 404 })
    }

    console.log('Successfully updated message:', updatedMessage._id);

    // Type assertion for the mongoose document
    const msg = updatedMessage as any;
    
    // Transform the response
    const transformedMessage = {
      id: msg._id.toString(),
      user: {
        id: msg.user.id,
        name: msg.user.name,
        email: msg.user.email,
        phone: msg.user.phone,
      },
      listing: {
        id: msg.listing.id.toString(),
        title: msg.listing.title,
        description: msg.listing.description,
        basePrice: msg.listing.basePrice,
        location: msg.listing.location,
      },
      bookingDetails: {
        selectedItems: msg.bookingDetails.selectedItems.map((item: any) => ({
          name: item.name,
          description: item.description,
          price: item.price,
          image: item.image,
        })),
        totalPrice: msg.bookingDetails.totalPrice,
        bookingDate: msg.bookingDetails.bookingDate.toISOString(),
        bookingTime: msg.bookingDetails.bookingTime,
        address: status === 'accepted' ? msg.bookingDetails.address : null,
        status: msg.bookingDetails.status,
        specialInstructions: msg.bookingDetails.specialInstructions,
      },
      createdAt: msg.createdAt.toISOString(),
    }

    return NextResponse.json(transformedMessage)

  } catch (error) {
    console.error('Error updating booking status:', error)
    return NextResponse.json(
      { 
        message: 'Internal server error',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}