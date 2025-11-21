import { NextResponse } from "next/server";
import Listing from "@/model/listing";
import Vendor from "@/model/vendor";
import connectDB from "@/lib/mongodb";

export async function GET(req: Request) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const query = searchParams.get("query");
    const location = searchParams.get("location");

    console.log("Search params received:", { query, location });

    // Return empty array if neither query nor location is provided
    if (!query && !location) {
      return NextResponse.json({ vendors: [] });
    }

    // Build the query object based on provided parameters
    const searchQuery: any = {
      $or: []
    };

    if (query) {
      // Search in multiple fields
      searchQuery.$or.push(
        { title: { $regex: query, $options: "i" } },
        { description: { $regex: query, $options: "i" } },
        { "features": { $regex: query, $options: "i" } }
      );
    }

    if (location) {
      searchQuery.location = { $regex: location, $options: "i" };
    }

    console.log("MongoDB query:", JSON.stringify(searchQuery, null, 2));

    // Find all listings that match the criteria
    const listings = await Listing.find(searchQuery)
      .populate('owner', 'ownerName ownerEmail ownerImage service_name service_description')
      .exec();

    console.log("Found listings:", listings.length);

    // Get unique vendors (removing duplicates)
    const uniqueVendors = Array.from(
      new Map(listings.map(listing => [listing.owner._id.toString(), listing.owner])).values()
    );

    console.log("Unique vendors:", uniqueVendors.length);

    return NextResponse.json({ 
      vendors: uniqueVendors,
      total: uniqueVendors.length,
      listings: listings.map(l => ({
        id: l._id,
        title: l.title,
        description: l.description,
        price: l.price,
        location: l.location,
        features: l.features
      }))
    });

  } catch (err) {
    console.error("Search API Error:", err);
    return NextResponse.json(
      { message: "Server error" },
      { status: 500 }
    );
  }
}
