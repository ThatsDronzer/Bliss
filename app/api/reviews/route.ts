// app/api/review/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getAuth } from "@clerk/nextjs/server";
import { users } from "@clerk/clerk-sdk-node";
import connectDB from "@/lib/config/db";
import Listing from "@/model/listing";
import Vendor from "@/model/vendor";
import Review from "@/model/reviews"; 
import User from "@/model/user";    




export async function POST(req: NextRequest) {
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
    const body = await req.json();
    const { listingId, comment, rating } = body;

   
    const clerkUser = await users.getUser(clerkUserId);
    const username = clerkUser.username || clerkUser.firstName + ' ' + clerkUser.lastName; 
 
    if (!username ) {
      return NextResponse.json(
        { message: "User profile incomplete. Missing username or email from Clerk." },
        { status: 400 }
      );
    }

    
    let internalUser = await User.findOne({ clerkId: clerkUserId });
 
    if (!internalUser) {
    
    return NextResponse.json(
        { message: "Internal user not found. Please ensure your account is set up." },  
        { status: 404 }
      );
    
    }
    
    const listing = await Listing.findById(listingId);
    if (!listing) {
      return NextResponse.json(
        { message: "Listing not found" },
        { status: 404 }
      );
    }

    const review = new Review({
      user: internalUser._id, 
      listing: listing._id,
      username, 
      comment,
      rating,
    });

    await review.save();

    
    if (!Array.isArray(listing.reviews)) {
      listing.reviews = [];
    }
    listing.reviews.push(review._id);
    await listing.save(); 

    return NextResponse.json(
      { message: "Review created successfully", review },
      { status: 201 }
    );
  } catch (error: any) { 
    console.error("Error creating review:", error);
    return NextResponse.json(
      { message: "Failed to create review", error: error.message || "Unknown error" },
      { status: 500 }
    );
  }
}
export async function DELETE(req: NextRequest) {
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
    const body = await req.json();
    const { reviewId } = body;

    const review = await Review.findById(reviewId);
    if (!review) {
      return NextResponse.json(
        { message: "Review not found" },
        { status: 404 }
      );
    }

   const internalUser = await User.findOne({ clerkId: clerkUserId });
    if (!internalUser) {
      return NextResponse.json(
        { message: "Internal user not found" },
        { status: 404 }
      );
    }
    if (review.user.toString() !== internalUser._id.toString()) {
      return NextResponse.json(
        { message: "You can only delete your own reviews" },
        { status: 403 }
      );
    }

    const deleteReviewResult = await review.deleteOne();

    if (deleteReviewResult.deletedCount === 0) {
        return NextResponse.json(
            { message: "Failed to delete review from the collection" },
            { status: 500 }
        );
    }

    const updateListingResult = await Listing.updateOne(
        { _id: review.listing },
        { $pull: { reviews: reviewId } }
    );
    
    if (updateListingResult.modifiedCount === 0) {
        console.warn(`Review ${reviewId} was deleted, but not found in listing ${review.listing}'s reviews array.`);
        
    }

    return NextResponse.json(
       { message: "Review deleted successfully", deletedReviewId: reviewId },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error deleting review:", error);
    return NextResponse.json(
      { message: "Failed to delete review", error: error.message || "Unknown error" },
      { status: 500 }
    );
  }
}