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
    // Parse JSON body (images are already uploaded to Cloudinary via widget)
    const body = await req.json();
    const { 
      title, 
      description, 
      price, 
      location, 
      category, 
      features, 
      images 
    } = body;

    // Validate required fields
    if (!title || !description || !price || !category) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    // Validate images
    if (!images || !Array.isArray(images) || images.length === 0) {
      return NextResponse.json(
        { message: "At least one image is required" },
        { status: 400 }
      );
    }

    // Create vendor if doesn't exist
    let vendor = await Vendor.findOne({ clerkId: userId });
    if (!vendor) {
      // Create new vendor if doesn't exist
      vendor = new Vendor({
        clerkId: userId,
        ownerName: `${user.firstName} ${user.lastName}`.trim() || 'Vendor',
        ownerEmail: user.emailAddresses?.[0]?.emailAddress || 'vendor@example.com',
        service_name: `${user.firstName}'s Service` || 'Vendor Service',
        service_email: user.emailAddresses?.[0]?.emailAddress || 'vendor@example.com',
        service_phone: '',
        service_description: '',
        establishedYear: new Date().getFullYear().toString(),
        service_type: category || 'Other',
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

    // Create new listing with Cloudinary images (already uploaded via widget)
    const newListing = new Listing({
      title,
      description,
      price,
      location: location || '',
      category,
      features: features || [],
      images: images, // These are Cloudinary image objects {url, public_id}
      owner: vendor._id,
    });

    await newListing.save();

    // Update vendor's listings
    vendor.listings.push(newListing._id);
    await vendor.save();
    
    console.log(newListing);
    
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
        ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
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
    // Parse JSON body instead of form data
    const body = await req.json();
    const { 
      listingId, 
      title, 
      description, 
      price, 
      location, 
      category, 
      features, 
      images, // Updated images array
      imagesToDelete // Array of public_ids to delete from Cloudinary
    } = body;

    if (!listingId) {
      return NextResponse.json(
        { message: "Listing ID is required" },
        { status: 400 }
      );
    }

    // Find the listing
    const listing = await Listing.findById(listingId);
    if (!listing) {
      return NextResponse.json({ message: "Listing not found" }, { status: 404 });
    }

    // Verify the listing belongs to the current vendor
    const vendor = await Vendor.findOne({ clerkId: userId });
    if (!vendor || !listing.owner.equals(vendor._id)) {
      return NextResponse.json(
        { message: "Unauthorized: You do not own this listing" },
        { status: 403 }
      );
    }

    // Handle image deletions if provided
    if (imagesToDelete && Array.isArray(imagesToDelete) && imagesToDelete.length > 0) {
      // Delete images from Cloudinary
      await Promise.all(
        imagesToDelete.map(async (publicId: string) => {
          try {
            await cloudinary.uploader.destroy(publicId);
          } catch (error) {
            console.error(`Error deleting image ${publicId}:`, error);
          }
        })
      );
      
      // Remove from listing images array
      listing.images = listing.images.filter(
        (img: any) => !imagesToDelete.includes(img.public_id)
      );
    }

    // Update the listing with new images if provided
    if (images && Array.isArray(images)) {
      listing.images = images; // Replace with new images array
    }

    // Update other listing fields
    if (title) listing.title = title;
    if (description) listing.description = description;
    if (price) listing.price = parseFloat(price);
    if (location) listing.location = location;
    if (category) listing.category = category;
    if (features) listing.features = features;

    await listing.save();

    return NextResponse.json(
      { message: "Listing updated successfully", listing },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error updating listing:", error);
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
