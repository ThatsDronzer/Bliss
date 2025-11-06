import { NextRequest, NextResponse } from 'next/server'
import { getAuth } from '@clerk/nextjs/server'
import MessageData, { IMessageData } from '@/model/message'
import dbConnect from '@/lib/dbConnect'
import { Document } from 'mongoose'

export async function GET(request: NextRequest) {
  try {
    const { userId } = getAuth(request)
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    console.log('Authenticated userId:', userId);

    await dbConnect();
    console.log('Connected to database');

    const searchParams = request.nextUrl.searchParams
    const status = searchParams.get('status')
    const limit = parseInt(searchParams.get('limit') || '50')
    const page = parseInt(searchParams.get('page') || '1')
    
    console.log('Query params:', { status, limit, page });

    // Build query - include cancelled status in queries if needed
    const query = {
      'vendor.id': userId,
      ...(status && status !== 'all' && { 'bookingDetails.status': status })
    }
    console.log('MongoDB query:', JSON.stringify(query));

    const total = await MessageData.countDocuments(query)
    console.log('Total messages found:', total);

    const messages = await MessageData.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean()

    const transformedMessages = messages.map((message: any) => ({
      id: message._id.toString(),
      user: {
        id: message.user.id,
        name: message.user.name,
        email: message.user.email,
        phone: message.user.phone,
      },
      listing: {
        id: message.listing.id.toString(),
        title: message.listing.title,
        description: message.listing.description,
        basePrice: message.listing.basePrice,
        location: message.listing.location,
      },
      bookingDetails: {
        selectedItems: message.bookingDetails.selectedItems.map((item: any) => ({
          name: item.name,
          description: item.description,
          price: item.price,
          image: item.image,
        })),
        totalPrice: message.bookingDetails.totalPrice,
        bookingDate: message.bookingDetails.bookingDate.toISOString(),
        bookingTime: message.bookingDetails.bookingTime,
        address: message.bookingDetails.status === 'accepted' ? message.bookingDetails.address : null,
        status: message.bookingDetails.status,
        specialInstructions: message.bookingDetails.specialInstructions,
      },
      createdAt: message.createdAt.toISOString(),
    }))

    return NextResponse.json({
      messages: transformedMessages,
      pagination: {
        total,
        pages: Math.ceil(total / limit),
        currentPage: page,
        perPage: limit,
      }
    })

  } catch (error) {
    console.error('Error fetching booking requests:', error)
    return NextResponse.json(
      { 
        message: 'Internal server error',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}