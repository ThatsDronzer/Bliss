import connectDB from "@/lib/config/db";
import Listing from "@/model/listing";
import Vendor from "@/model/vendor";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { users } from "@clerk/clerk-sdk-node";
import cloudinary from "@/lib/cloudinary";
import type { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const auth = getAuth(req);
  const userId = auth.userId;

  if (!userId) {
    return NextResponse.json(
      { message: "User is not signed in" },
      { status: 401 }
    );
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
    return NextResponse.json(
      { message: "User is not signed in" },
      { status: 401 }
    );
  }

  const user = await users.getUser(userId);
  const role = user.unsafeMetadata?.role;

  if (role !== "vendor") {
    return NextResponse.json(
      { message: "User is not a vendor" },
      { status: 403 }
    );
  }

  await connectDB();

  try {
    const formData = await req.formData();

    // Get all images from form data (supports multiple files)
    const imageFiles = formData.getAll('images') as File[];
    const uploadedImages = [];

    // Upload each image to Cloudinary
    for (const file of imageFiles) {
      if (file.size > 0) { // Check if file exists
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        const uploadResult: any = await new Promise((resolve, reject) => {
          cloudinary.uploader.upload_stream(
            {
              folder: 'listings',
              transformation: [
                { width: 800, height: 800, crop: 'limit' },
                { quality: 'auto' }
              ]
            },
            (error, result) => {
              if (error) reject(error);
              resolve(result);
            }
          ).end(buffer);
        });

        uploadedImages.push({
          url: uploadResult.secure_url,
          public_id: uploadResult.public_id
        });
      }
    }

    // Create vendor if doesn't exist
    let vendor = await Vendor.findOne({ clerkId: userId });
    if (!vendor) {
      vendor = new Vendor({
        clerkId: userId,
        ownerName: user.firstName + ' ' + user.lastName || 'Vendor',
        ownerEmail: user.emailAddresses?.[0]?.emailAddress || 'vendor@example.com',
        service_name: 'Vendor Service',
        service_email: user.emailAddresses?.[0]?.emailAddress || 'vendor@example.com',
        service_phone: '',
        service_description: '',
        establishedYear: new Date().getFullYear().toString(),
        service_type: 'Other',
        gstNumber: '',
        panNumber: '',
        bankName: '',
        accountNumber: '',
        ifscCode: '',
        accountHolderName: '',
        isVerified: false,
        listings: [],
      });
      await vendor.save();
    }

    // Create new listing with uploaded images
    const newListing = new Listing({
      title: formData.get('title'),
      description: formData.get('description'),
      price: formData.get('price'),
      location: formData.get('location'),
      category: formData.get('category'),
      features: formData.get('features') ? JSON.parse(formData.get('features') as string) : [],
      images: uploadedImages,
      owner: vendor._id,
    });

    await newListing.save();

    // Update vendor's listings
    if (!Array.isArray(vendor.listings)) {
      vendor.listings = [];
    }
    vendor.listings.push(newListing._id);
    await vendor.save();

    return NextResponse.json(
      {
        message: "Listing created successfully",
        listing: newListing
      },
      { status: 201 }
    );

  } catch (error: any) {
    console.error("Error creating listing:", error);
    return NextResponse.json(
      {
        message: "Failed to create listing",
        error: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
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
    const body = await req.json();
    const { listingId, title, description, price, location, category } = body;

    const listing = await Listing.findById(listingId);
    if (!listing) {
      return NextResponse.json({ message: "Listing not found" }, { status: 404 });
    }

    // Update the listing fields
    listing.title = title || listing.title;
    listing.description = description || listing.description;
    listing.price = price || listing.price;
    listing.location = location || listing.location;
    listing.category = category || listing.category;

    await listing.save();

    return NextResponse.json(
      { message: "Listing updated successfully", listing },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { message: "Failed to update listing", error: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
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
    const body = await req.json();
    const { listingId } = body;

    if (!listingId) {
      return NextResponse.json(
        { message: "Listing ID is required" },
        { status: 400 }
      );
    }

    // Find the listing to ensure it exists and belongs to the current vendor
    const listing = await Listing.findById(listingId);
    if (!listing) {
      return NextResponse.json({ message: "Listing not found" }, { status: 404 });
    }

    // Find the vendor by Clerk ID
    const vendor = await Vendor.findOne({ clerkId: userId });
    if (!vendor) {
      return NextResponse.json({ message: "Vendor not found" }, { status: 404 });
    }

    if (!listing.owner.equals(vendor._id)) {
      return NextResponse.json(
        { message: "Unauthorized: You do not own this listing" },
        { status: 403 }
      );
    }

    // First delete images from Cloudinary
    if (listing.images && listing.images.length > 0) {
      await Promise.all(
        listing.images.map(async (image: any) => {
          if (image.public_id) {
            await cloudinary.uploader.destroy(image.public_id);
          }
        })
      );
    }

    // Remove the listing from the database
    await Listing.deleteOne({ _id: listingId });

    // Remove the listing ID from the vendor's listings array
    await Vendor.updateOne(
      { _id: vendor._id },
      { $pull: { listings: listingId } }
    );

    return NextResponse.json(
      { message: "Listing deleted successfully", deletedListingId: listingId },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error deleting listing:", error);
    return NextResponse.json(
      { message: "Failed to delete listing", error: error.message },
      { status: 500 }
    );
  }
}