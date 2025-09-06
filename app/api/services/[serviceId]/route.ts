import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Listing from "@/model/listing";
import Vendor from "@/model/vendor";
import { isValidObjectId } from "mongoose";

export async function GET(
  request: Request,
  { params }: { params: { serviceId: string } }
) {
  try {
    const id = params.serviceId;

    if (!id || !isValidObjectId(id)) {
      return NextResponse.json(
        { error: "Invalid service ID" },
        { status: 400 }
      );
    }

    await dbConnect();

    const service = await Listing.findById(id);

    if (!service) {
      return NextResponse.json(
        { error: "Service not found" },
        { status: 404 }
      );
    }

    // Get vendor details
    const vendor = await Vendor.findById(service.owner).select('service_name service_type');

    if (!vendor) {
      return NextResponse.json(
        { error: "Vendor not found" },
        { status: 404 }
      );
    }

    // Transform the data to match our needs
    const serviceDetails = {
      id: service._id.toString(),
      name: service.title,
      description: service.description,
      price: service.price,
      images: service.images?.map(img => img.url) || [],
      features: service.features || [],
      isActive: service.isActive,
      vendor: {
        id: vendor._id.toString(),
        name: vendor.service_name,
        category: vendor.service_type
      }
    };

    return NextResponse.json(serviceDetails);

  } catch (error: any) {
    console.error("Error fetching service:", error);
    return NextResponse.json(
      { error: "Failed to fetch service details" },
      { status: 500 }
    );
  }
}
