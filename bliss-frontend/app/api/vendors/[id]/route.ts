import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Vendor from "@/model/vendor";
import mongoose, { isValidObjectId } from "mongoose";
import Listing from "@/model/listing";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    if (!id || !isValidObjectId(id)) {
      return NextResponse.json(
        { error: "Invalid vendor ID" },
        { status: 400 }
      );
    }

    await dbConnect();

    // First get the vendor details
    const vendor = await Vendor.findById(id).select({
      ownerName: 1,
      service_name: 1,
      service_email: 1,
      service_phone: 1,
      service_address: 1,
      service_description: 1,
      establishedYear: 1,
      service_type: 1,
      isVerified: 1,
      createdAt: 1
    });

    if (!vendor) {
      return NextResponse.json(
        { error: "Vendor not found" },
        { status: 404 }
      );
    }

    // Then find all listings/services that belong to this vendor
    const listings = await Listing.find({ 
      owner: id
    }).select('title description price images features isActive');

    // Transform listings into services
    const services = listings.map((listing: any) => ({
      id: listing._id.toString(),
      name: listing.title,
      price: listing.price,
      description: listing.description,
      images: listing.images?.map((img: any) => img.url) || [],
      features: listing.features || [],
      isActive: listing.isActive
    }));

    // Transform the vendor data to match VendorDetails interface
    const vendorDetails = {
      id: vendor._id.toString(),
      name: vendor.service_name,
      location: `${vendor.service_address.City}, ${vendor.service_address.State}`,
      rating: 4.5, // TODO: Calculate from reviews
      category: vendor.service_type,
      coverImage: "/images/vendors/default-cover.jpg", // TODO: Add actual image
      description: vendor.service_description,
      shortDescription: vendor.service_description?.slice(0, 150) + "...",
      services: services,
      packages: [], // TODO: Add packages
      gallery: [], // TODO: Add gallery
      reviews: [], // TODO: Add reviews
      availability: [], // TODO: Add availability
      refundPolicy: {
        description: "Standard refund policy applies",
        cancellationTerms: [
          { daysBeforeEvent: 7, refundPercentage: 100 },
          { daysBeforeEvent: 3, refundPercentage: 50 }
        ]
      },
      contact: {
        phone: vendor.service_phone,
        email: vendor.service_email,
        whatsapp: vendor.service_phone
      },
      businessHours: "Mon-Sat: 10:00 AM - 7:00 PM",
      socialLinks: {}
    };

    return NextResponse.json(vendorDetails);

  } catch (error: any) {
    console.error("Error fetching vendor:", error);
    return NextResponse.json(
      { error: "Failed to fetch vendor details" },
      { status: 500 }
    );
  }
}
