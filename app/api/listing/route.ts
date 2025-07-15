

import connectDB from "@/lib/config/db";
import Listing from "@/model/listing";
import Vendor from "@/model/vendor";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { users } from "@clerk/clerk-sdk-node";


import type { NextRequest } from "next/server";
//send session id of clerk in headers for both requests
export async function GET(req: NextRequest) {
  const auth = getAuth(req);
  const userId = auth.userId;

  if (!userId) {
    return NextResponse.json({ message: "User is not signed in" }, { status: 401 });
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
    return NextResponse.json({ message: "User is not signed in" }, { status: 401 });
  }

  const user = await users.getUser(userId);

  const role = user.unsafeMetadata?.role;
 

  if (role !== "vendor") {
    return NextResponse.json({ message: "User is not a vendor" }, { status: 403 });
  }

  await connectDB();

  try {
    const body = await req.json();

    const { title, description, price, features, location}=body;

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
    console.log("New Listing Created:", newListing);
    return NextResponse.json({ message: "Listing created successfully", listing: newListing }, { status: 201 });


  } catch (error: any) {
    console.error("Error creating listing:", error);
    return NextResponse.json({ message: "Failed to create listing", error: error.message }, { status: 500 });
  }

}