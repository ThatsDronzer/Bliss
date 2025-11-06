import { NextRequest, NextResponse } from "next/server";
import { getAuth } from "@clerk/nextjs/server";
import { users } from "@clerk/clerk-sdk-node";
import connectDB from "@/lib/config/db";
import Listing from "@/model/listing";
import Review from "@/model/reviews";


export async function GET(req: NextRequest) {
  const auth = getAuth(req);
  const clerkUserId = auth.userId;

  if (!clerkUserId) {
    return NextResponse.json(
      { message: "User is not signed in" },
      { status: 401 }
    );
  }

  await connectDB();

  try {
      const { searchParams } = new URL(req.url);
    const listingId = searchParams.get("listingId");

    const listing = await Listing.findById(listingId);
    if (!listing) {
      return NextResponse.json(
        { message: "Listing not found" },
        { status: 404 }
      );
    }

    const reviews = await Review.find({ listing: listing._id });
    return NextResponse.json(
      { message: "Reviews fetched successfully", reviews },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error fetching reviews:", error);
    return NextResponse.json(
      { message: "Failed to fetch reviews", error: error.message || "Unknown error" },
      { status: 500 }
    );
  }
}