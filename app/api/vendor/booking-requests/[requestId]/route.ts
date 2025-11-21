import { NextRequest, NextResponse } from 'next/server'
import { getAuth } from '@clerk/nextjs/server'
import MessageData from '@/model/message'
import dbConnect from '@/lib/dbConnect'

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ requestId: string }> }
) {
  try {
    const { userId } = getAuth(request)
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Await params in Next.js 15
    const { requestId } = await params;

    const { status } = await request.json();
    console.log('Updating status for request:', requestId, 'to:', status);
    
    if (!status || !['accepted', 'not-accepted'].includes(status)) {
      console.log('Invalid status:', status);
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 })
    }

    await dbConnect();
    console.log('Connected to database');

    console.log('Updating message with query:', {
      _id: requestId,
      'vendor.id': userId
    });
    
    const updatedMessage = await MessageData.findOneAndUpdate(
      {
        _id: requestId,
        'vendor.id': userId,
        'bookingDetails.status': 'pending' // Only allow updates for pending requests
      },
      {
        'bookingDetails.status': status
      },
      { new: true, lean: true }
    )

    if (!updatedMessage) {
      console.log('No message found with ID:', requestId);
      return NextResponse.json({ error: 'Booking request not found or cannot be updated' }, { status: 404 })
    }

    const msg = updatedMessage as any;
    console.log('Successfully updated message:', msg._id);

    // Send WhatsApp notification to customer
    try {
      // Use localhost for internal API calls to avoid ngrok bot protection
      const baseUrl = 'http://localhost:3000';
      
      // Ensure phone number is in E.164 format (+91...)
      let customerPhone = msg.user.phone;
      if (customerPhone && !customerPhone.startsWith('+')) {
        customerPhone = `+91${customerPhone}`;
      }
      
      console.log('Sending notification to:', baseUrl + '/api/notify/customer');
      console.log('Notification data:', {
        requestId,
        customerPhone,
        vendorName: msg.vendor.name,
        status,
      });
      
      const notificationResponse = await fetch(`${baseUrl}/api/notify/customer`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          requestId: requestId,
          customerPhone: customerPhone,
          vendorName: msg.vendor.name,
          status: status,
          customerName: msg.user.name,
        }),
      });

      // Check if response is JSON before parsing
      const contentType = notificationResponse.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        const notificationResult = await notificationResponse.json();
        
        if (!notificationResponse.ok) {
          console.error('Failed to send customer notification:', notificationResult);
        } else {
          console.log('Customer notification sent successfully:', notificationResult);
        }
      } else {
        const textResponse = await notificationResponse.text();
        console.error('Notification API returned non-JSON response:', textResponse.substring(0, 200));
      }
    } catch (notificationError) {
      console.error('Error sending customer notification:', notificationError);
      // Don't fail the status update if notification fails
    }
    
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