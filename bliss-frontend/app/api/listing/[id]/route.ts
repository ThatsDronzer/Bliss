import connectDB from "@/lib/config/db";
import Listing from "@/model/listing";
import Vendor from "@/model/vendor";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

import type { NextRequest } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
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
    // Find the vendor by Clerk user ID
    const vendor = await Vendor.findOne({ clerkId: userId });
    if (!vendor) {
      return NextResponse.json({ message: "Vendor not found" }, { status: 404 });
    }

    // Find the listing by ID and ensure it belongs to this vendor
    const listing = await Listing.findOne({ 
      _id: params.id,
      owner: vendor._id 
    });

    if (!listing) {
      return NextResponse.json({ message: "Listing not found" }, { status: 404 });
    }

    return NextResponse.json({ listing }, { status: 200 });
  } catch (error: any) {
    console.error("Error fetching listing:", error);
    return NextResponse.json(
      { message: "Failed to fetch listing", error: error.message },
      { status: 500 }
    );
  }
}
