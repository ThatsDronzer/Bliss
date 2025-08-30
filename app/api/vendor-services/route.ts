import connectDB from "@/lib/config/db";
import Listing from "@/model/listing";
import Vendor from "@/model/vendor";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// GET all vendor services/listings for the explore services page
export async function GET(req: NextRequest) {
  await connectDB();

  try {
    // Find all vendors that are verified
    const vendors = await Vendor.find({ isVerified: true });
    
    if (!vendors || vendors.length === 0) {
      return NextResponse.json({ 
        message: "No verified vendors found",
        vendorServices: [] 
      }, { status: 200 });
    }

    // Get all vendor IDs
    const vendorIds = vendors.map(vendor => vendor._id);
    
    // Find all listings owned by these vendors
    const listings = await Listing.find({ 
      owner: { $in: vendorIds },
      isActive: true
    });

    // Group listings by vendor
    const vendorServices = await Promise.all(
      vendors.map(async (vendor) => {
        // Find services for this vendor
        const vendorListings = listings.filter(listing => 
          listing.owner.toString() === vendor._id.toString()
        );

        // Format services according to the expected structure
        const services = vendorListings.map(listing => ({
          id: listing._id.toString(),
          name: listing.title,
          price: listing.price,
          category: listing.features[0] || "Other", // Using first feature as category
          description: listing.description,
          startingPrice: `₹${listing.price.toLocaleString('en-IN')}`
        }));

        return {
          id: vendor._id.toString(),
          name: vendor.service_name || vendor.ownerName,
          rating: 4.5, // Default rating as it's not in the model yet
          reviewsCount: 0, // Default count as it's not in the model yet
          image: vendor.ownerImage || "/placeholder.svg?height=200&width=300&text=Vendor",
          location: vendor.service_address?.City || vendor.owner_address?.City || "Location not specified",
          experience: "Established: " + (vendor.establishedYear || "N/A"),
          description: vendor.service_description || "No description available",
          featured: false, // Default value as it's not in the model yet
          verified: vendor.isVerified,
          services: services
        };
      })
    );

    return NextResponse.json({ vendorServices }, { status: 200 });
  } catch (error) {
    console.error("Error fetching vendor services:", error);
    return NextResponse.json({ message: "Failed to fetch vendor services", error: String(error) }, { status: 500 });
  }
}
