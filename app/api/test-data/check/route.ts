import { NextResponse } from "next/server";
import Listing from "@/model/listing";
import Vendor from "@/model/vendor";
import connectDB from "@/lib/mongodb";

export async function GET() {
  try {
    await connectDB();

    // Get all vendors
    const vendors = await Vendor.find();
    console.log("Total vendors:", vendors.length);
    
    // Get all listings
    const listings = await Listing.find().populate('owner');
    console.log("Total listings:", listings.length);

    return NextResponse.json({
      vendors: vendors.map(v => ({
        id: v._id,
        name: v.ownerName,
        service: v.service_name,
        email: v.ownerEmail
      })),
      listings: listings.map(l => ({
        id: l._id,
        title: l.title,
        description: l.description,
        owner: l.owner?.ownerName
      }))
    });

  } catch (err) {
    console.error("Error checking data:", err);
    return NextResponse.json(
      { message: "Error checking data", error: err.message },
      { status: 500 }
    );
  }
}
