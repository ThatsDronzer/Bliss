import connectDB from "@/lib/config/db";
import Listing from "@/model/listing"; 
import Vendor from "@/model/vendor";  
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { users } from "@clerk/clerk-sdk-node";
import mongoose from 'mongoose'; // For ObjectId validation

import type { NextRequest } from "next/server";

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  // ... use `id` instead of `params.id` in your code
  const auth = getAuth(req);
  const userId = auth.userId; // Clerk user ID

  
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

  await connectDB(); // Ensure database connection

  try {
    const listingId = params.id;

    // 1. Validate listing ID format
    if (!listingId || !mongoose.Types.ObjectId.isValid(listingId)) {
      return NextResponse.json({ message: "Invalid Listing ID format" }, { status: 400 });
    }

    // 2. Find the vendor by Clerk ID (the authenticated user)
    const vendor = await Vendor.findOne({ clerkId: userId });
    if (!vendor) {
      return NextResponse.json({ message: "Vendor not found" }, { status: 404 });
    }

    // 3. Find the listing to update
    const listing = await Listing.findById(listingId);
    if (!listing) {
      return NextResponse.json({ message: "Listing not found" }, { status: 404 });
    }

    // 4. AUTHORIZATION CHECK: Ensure the current vendor owns this listing
    if (!listing.owner.equals(vendor._id)) {
      return NextResponse.json(
        { message: "Unauthorized: You do not own this listing." },
        { status: 403 }
      );
    }

    // 5. Toggle the isActive status
    listing.isActive = !listing.isActive;

    // 6. Save the updated listing
    await listing.save();

    // 7. Return success response with the updated listing
    return NextResponse.json(
      {
        message: `Listing status updated to ${listing.isActive ? 'active' : 'inactive'}`,
        listing: listing, // Return the updated listing object
      },
      { status: 200 }
    );

  } catch (error: any) {
    console.error("Error toggling listing status:", error);
    return NextResponse.json(
      { message: "Failed to toggle listing status", error: error.message },
      { status: 500 }
    );
  }
}