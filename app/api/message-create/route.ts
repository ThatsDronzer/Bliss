import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import MessageData from '@/model/message';
import User from '@/model/user';
import Listing from "@/model/listing";
import Vendor from "@/model/vendor";
import {IListingItem} from "@/model/listing";



export async function POST(request: NextRequest) {
  try {
    const { 
      userId, 
      vendorId, 
      listingId, 
      selectedItems = [], 
      totalPrice,
      address, 
      bookingDate,
      specialInstructions 
    } = await request.json();

    // Validate required fields
    if (!userId || !vendorId || !listingId || !address || !bookingDate || totalPrice === undefined) {
      return NextResponse.json(
        { message: 'Missing required fields: userId, vendorId, listingId, address, bookingDate, totalPrice' },
        { status: 400 }
      );
    }

    // Validate address fields
    if (!address.houseNo || !address.areaName || !address.landmark || !address.state || !address.pin) {
      return NextResponse.json(
        { message: 'Missing required address fields' },
        { status: 400 }
      );
    }

    // Validate totalPrice is a number and positive
    if (typeof totalPrice !== 'number' || totalPrice < 0) {
      return NextResponse.json(
        { message: 'Total price must be a positive number' },
        { status: 400 }
      );
    }

    // Connect to database if not already connected
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(process.env.MONGODB_URI!);
    }

    // Fetch user, vendor, and listing data
    const [user, vendor, listing] = await Promise.all([
      User.findOne({ clerkId: userId }),
      Vendor.findOne({ clerkId: vendorId }),
      Listing.findById(listingId)
    ]);

    if (!user) {
      return NextResponse.json(
        { message: 'User not found' },
        { status: 404 }
      );
    }

    if (!vendor) {
      return NextResponse.json(
        { message: 'Vendor not found' },
        { status: 404 }
      );
    }

    if (!listing) {
      return NextResponse.json(
        { message: 'Listing not found' },
        { status: 404 }
      );
    }

    // Get item details for selected items
    const selectedItemsWithDetails: any[] = [];

    if (selectedItems && selectedItems.length > 0) {
      selectedItems.forEach((itemName: string) => {
        const listingItem: IListingItem | undefined = listing.items?.find((item: IListingItem) => item.name === itemName);
        if (listingItem) {
          selectedItemsWithDetails.push({
            name: listingItem.name,
            description: listingItem.description,
            price: listingItem.price,
            image: listingItem.image
          });
        }
      });
    } else {
      // If no specific items selected, include all listing items
      if (listing.items && listing.items.length > 0) {
        listing.items.forEach((item: IListingItem) => {
          selectedItemsWithDetails.push({
            name: item.name,
            description: item.description,
            price: item.price,
            image: item.image
          });
        });
      }
    }

    // Create the message with pending status
    const newMessage = new MessageData({
      user: {
        id: user.clerkId,
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address
      },
      vendor: {
        id: vendor.clerkId,
        name: vendor.service_name || vendor.ownerName,
        email: vendor.service_email || vendor.ownerEmail,
        phone: vendor.service_phone || vendor.owner_contactNo?.[0],
        service: listing.title,
        service_address: vendor.service_address
      },
      listing: {
        id: listing._id,
        title: listing.title,
        description: listing.description,
        basePrice: listing.price,
        location: listing.location
      },
      bookingDetails: {
        selectedItems: selectedItemsWithDetails,
        totalPrice: totalPrice, // Use the price calculated from frontend
        bookingDate: new Date(bookingDate),
        address: address,
        specialInstructions: specialInstructions,
        status: 'pending'
      }
    });

    // Save the message
    const savedMessage = await newMessage.save();

    // Update user and vendor with the new message reference
    await Promise.all([
      User.findByIdAndUpdate(
        user._id, 
        { $push: { messages: savedMessage._id } }
      ),
      Vendor.findByIdAndUpdate(
        vendor._id, 
        { $push: { messages: savedMessage._id } }
      )
    ]);

    return NextResponse.json(
      {
        message: 'Message created successfully',
        data: savedMessage
      },
      { status: 201 }
    );

  } catch (error) {
    console.error('Error creating message:', error);
    return NextResponse.json(
      { 
        message: 'Internal server error',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

