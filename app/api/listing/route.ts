import connectDB from "@/lib/config/db";
import Listing from "@/model/listing";
import Vendor from "@/model/vendor";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    await connectDB();

    const url = new URL(req.url);
    const ownerId = url.searchParams.get("owner");

    if (!ownerId) {
      return new NextResponse("Missing owner ID", { status: 400 });
    }

    const listings = await Listing.find({ owner: ownerId }).populate("owner");

    return NextResponse.json({
      message: "Listings fetched successfully",
      listings: listings,
    }, { status: 200 });

  } catch (error: any) {
    console.error("Error fetching listings:", error);
    return NextResponse.json({ message: "Failed to fetch listings", error: error.message }, { status: 500 });
  }
}

export async function POST(req:Request){
  await connectDB();

  try {
    const body = await req.json();

    const { title, description, price, features, location, owner:ownerId}=body;

    const vendor = await Vendor.findById(ownerId);


    if (!vendor) {
      return new NextResponse("Invalid owner ID", { status: 404 });
    }
    const newListing = new Listing({
      title,
      description,
      price,
      features,
      location,
      owner:vendor._id,
    });
    const savedListing = await newListing.save();

    return NextResponse.json({
      message: "Listing created successfully",
      listing: savedListing,
    }, { status: 201 });

  } catch (error: any) {
    console.error("Error creating listing:", error);
    return NextResponse.json({ message: "Failed to create listing", error: error.message }, { status: 500 });
  }

}


