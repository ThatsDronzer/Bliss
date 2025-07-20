import connectDB from "@/lib/config/db";
import Listing from "@/model/listing";
import Vendor from "@/model/vendor";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { users } from "@clerk/clerk-sdk-node";

import type { NextRequest } from "next/server";
//send session id of clerk in headers for both requests by window.Clerk.session.getToken().then(console.log)
export async function GET(req: NextRequest) {
  const auth = getAuth(req);
  const userId = auth.userId;

  if (!userId) {
    return NextResponse.json(
      { message: "User is not signed in" },
      { status: 401 }
    );
  }

  await connectDB();

  // Find the vendor by Clerk user ID
  const vendor = await Vendor.findOne({ clerkId: userId });
  if (!vendor) {
    return NextResponse.json({ message: "Vendor not found" }, { status: 404 });
  }

  // Find all listings for this vendor
  const listings = await Listing.find({ owner: vendor._id });
  return NextResponse.json({ listings }, { status: 200 });
}

export async function POST(req: NextRequest) {
  const auth = getAuth(req);

  const userId = auth.userId;

  if (!userId) {
    return NextResponse.json(
      { message: "User is not signed in" },
      { status: 401 }
    );
  }

  const user = await users.getUser(userId);

  const role = user.unsafeMetadata?.role;

  if (role !== "vendor") {
    return NextResponse.json(
      { message: "User is not a vendor" },
      { status: 403 }
    );
  }

  await connectDB();

  try {
    const body = await req.json();

    const { title, description, price, features, location } = body;

    const vendor = await Vendor.findOne({ clerkId: userId });

    if (!vendor) {
      return new NextResponse("Invalid owner ID", { status: 404 });
    }
    const newListing = new Listing({
      title,
      description,
      price,
      features,
      location,
      owner: vendor._id, // Use the vendor's ID as the owner
    });
    await newListing.save();

    if (!Array.isArray(vendor.listings)) {
      vendor.listings = [];
    }

   
    await vendor.listings.push(newListing._id);

    vendor.markModified("listings");

    await vendor.save();

    return NextResponse.json(
      { message: "Listing created successfully", listing: newListing },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { message: "Failed to create listing", error: error.message },
      { status: 500 }
    );
  }
}
export async function PUT(req: NextRequest) {
  const auth = getAuth(req);
  const userId = auth.userId;

  if (!userId) {
    return NextResponse.json(
      { message: "User is not signed in" },
      { status: 401 }
    );
  }

  await connectDB();

  try {
    const body = await req.json();
    const { listingId, title, description, price, features, location } = body;

    const listing = await Listing.findById(listingId);
    if (!listing) {
      return NextResponse.json({ message: "Listing not found" }, { status: 404 });
    }

    // Update the listing fields
    listing.title = title || listing.title;
    listing.description = description || listing.description;
    listing.price = price || listing.price;
    listing.features = features || listing.features;
    listing.location = location || listing.location;

    await listing.save();

    return NextResponse.json(
      { message: "Listing updated successfully", listing },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { message: "Failed to update listing", error: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  const auth = getAuth(req);
  const userId = auth.userId;

  if (!userId) {
    return NextResponse.json(
      { message: "User is not signed in" },
      { status: 401 }
    );
  }

  await connectDB(); // Ensure DB connection

  try {
    const body = await req.json();
    const { listingId } = body;

    if (!listingId) {
      return NextResponse.json(
        { message: "Listing ID is required" },
        { status: 400 }
      );
    }

   
    // Find the listing to ensure it exists and belongs to the current vendor
    const listing = await Listing.findById(listingId);
    if (!listing) {
      return NextResponse.json({ message: "Listing not found" }, { status: 404 });
    }

    //  Find the vendor by Clerk ID
    const vendor = await Vendor.findOne({ clerkId: userId });
    if (!vendor) {
      return NextResponse.json({ message: "Vendor not found" }, { status: 404 });
    }

    if (!listing.owner.equals(vendor._id)) {
      return NextResponse.json(
        { message: "Unauthorized: You do not own this listing" },
        { status: 403 }
      );
    }

    // Remove the listing from the database using deleteOne
    const deleteResult = await Listing.deleteOne({ _id: listingId });
    if (deleteResult.deletedCount === 0) {
      
      return NextResponse.json({ message: "Failed to delete listing from collection" }, { status: 500 });
    }

    //  Remove the listing ID from the vendor's listings array using $pull
    const updateVendorResult = await Vendor.updateOne(
      { _id: vendor._id },
      { $pull: { listings: listingId } } 
    );

    if (updateVendorResult.modifiedCount === 0) {
      console.warn(`Listing ${listingId} was deleted, but not found in vendor ${vendor._id}'s listings array.`);
      
    }

    // Return a success response
    return NextResponse.json(
      { message: "Listing deleted successfully", deletedListingId: listingId },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error deleting listing:", error); 
    return NextResponse.json(
      { message: "Failed to delete listing", error: error.message },
      { status: 500 }
    );
  }
}