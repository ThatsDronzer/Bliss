import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import MessageData from '@/model/message';
import User, { IUser } from '@/model/user';
import Listing from "@/model/listing";
import Vendor, { IVendor } from "@/model/vendor";
import { IListingItem } from "@/model/listing";

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
      bookingTime,
      specialInstructions 
    } = await request.json();

    if (!userId || !vendorId || !listingId || !address || !bookingDate || !bookingTime || totalPrice === undefined) {
      return NextResponse.json(
        { message: 'Missing required fields: userId, vendorId, listingId, address, bookingDate, bookingTime, totalPrice' },
        { status: 400 }
      );
    }
    if (!address.houseNo || !address.areaName || !address.landmark || !address.state || !address.pin) {
      return NextResponse.json({ message: 'Missing required address fields' }, { status: 400 });
    }
    const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
    if (!timeRegex.test(bookingTime)) {
      return NextResponse.json({ message: 'Invalid booking time format. Please use HH:MM format' }, { status: 400 });
    }
    if (typeof totalPrice !== 'number' || totalPrice < 0) {
      return NextResponse.json({ message: 'Total price must be a positive number' }, { status: 400 });
    }

    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(process.env.MONGODB_URI!);
    }

    // Find the person making the booking (the "booker"). They could be a regular User or a Vendor.
    let booker: (IUser | IVendor) | null = await User.findOne({ clerkId: userId });
    let bookerIsVendor = false;
    if (!booker) {
      booker = await Vendor.findOne({ clerkId: userId });
      if (booker) {
        bookerIsVendor = true;
      }
    }

    // Fetch the service listing and its owner (the vendor)
    const [listing, vendor] = await Promise.all([
      Listing.findById(listingId).exec(),
      Vendor.findById(vendorId).exec()
    ]);

    // Centralized validation for all fetched documents
    if (!booker) {
      return NextResponse.json({ message: 'Booking user not found' }, { status: 404 });
    }
    if (!vendor) {
      return NextResponse.json({ message: 'Vendor not found' }, { status: 404 });
    }
    if (!listing) {
      return NextResponse.json({ message: 'Listing not found' }, { status: 404 });
    }

    const selectedItemsWithDetails: any[] = [];
    const itemsSource = (listing.items && listing.items.length > 0) ? listing.items : [];
    const itemNamesToFind = (selectedItems && selectedItems.length > 0) ? selectedItems : itemsSource.map((item: IListingItem) => item.name);

    itemNamesToFind.forEach((itemName: string) => {
      const listingItem = itemsSource.find((item: IListingItem) => item.name === itemName);
      if (listingItem) {
        selectedItemsWithDetails.push({
          name: listingItem.name,
          description: listingItem.description,
          price: listingItem.price,
          image: listingItem.image
        });
      }
    });

    // Create the message with pending status
    const newMessage = new MessageData({
      user: { // FIX 2: Normalize booker's data from either User or Vendor schema
        id: booker.clerkId,
        name: bookerIsVendor ? (booker as IVendor).ownerName : (booker as IUser).name,
        email: bookerIsVendor ? (booker as IVendor).ownerEmail : (booker as IUser).email,
        phone: bookerIsVendor ? (booker as IVendor).owner_contactNo?.[0] : (booker as IUser).phone,
        address: (booker as IUser).address 
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
        totalPrice: totalPrice,
        bookingDate: new Date(bookingDate),
        bookingTime: bookingTime,
        address: address,
        specialInstructions: specialInstructions,
        status: 'pending'
      }
    });

    const savedMessage = await newMessage.save();

    // FIX 3: Update the correct collection (User or Vendor) for the booker
    const updateBookerPromise = bookerIsVendor
      ? Vendor.findByIdAndUpdate(booker._id, { $push: { messages: savedMessage._id } })
      : User.findByIdAndUpdate(booker._id, { $push: { messages: savedMessage._id } });

    // Update booker and vendor with the new message reference
    await Promise.all([
      updateBookerPromise,
      Vendor.findByIdAndUpdate(vendor._id, { $push: { messages: savedMessage._id } })
    ]);

    return NextResponse.json(
      { message: 'Message created successfully', data: savedMessage },
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