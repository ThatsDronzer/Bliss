import connectDB from "@/lib/config/db";
import Listing from "@/model/listing";
import Vendor from "@/model/vendor";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { users } from "@clerk/clerk-sdk-node";
import cloudinary from "@/lib/cloudinary";
import type { NextRequest } from "next/server";
// /api/upload.js

export const config = {
  api: {
    bodyParser: false, // Disallow body parsing, let multer handle it
  },
};
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

  try {
    const { users } = await import("@clerk/clerk-sdk-node");
    const user = await users.getUser(userId);
    const role = user.unsafeMetadata?.role;

    if (role !== "vendor") {
      return NextResponse.json(
        { message: "User is not a vendor" },
        { status: 403 }
      );
    }

    await connectDB();

    // Ensure vendor exists (no auto-create here)
    const vendor = await Vendor.findOne({ clerkId: userId });
    if (!vendor) {
      return NextResponse.json(
        {
          message:
            "Vendor profile not found. Please complete vendor setup before creating a listing.",
        },
        { status: 400 }
      );
    }

    const formData = await req.formData();

    // Handle image uploads safely
    const imageFiles = formData.getAll("images") as File[];
    const uploadedImages: { url: string; public_id: string }[] = [];

    for (const file of imageFiles) {
      if (file?.size > 0) {
        try {
          const arrayBuffer = await file.arrayBuffer();
          const buffer = Buffer.from(arrayBuffer);

          const uploadResult: any = await new Promise((resolve, reject) => {
            cloudinary.uploader
              .upload_stream(
                {
                  folder: "listings",
                  transformation: [
                    { width: 800, height: 800, crop: "limit" },
                    { quality: "auto" },
                  ],
                },
                (error, result) => {
                  if (error) return reject(error);
                  resolve(result);
                }
              )
              .end(buffer);
          });

          if (uploadResult?.secure_url) {
            uploadedImages.push({
              url: uploadResult.secure_url,
              public_id: uploadResult.public_id,
            });
          }
        } catch (imgErr) {
          console.error("Image upload failed:", imgErr);
          // skip this image, continue loop
        }
      }
    }

    // Create new listing
    const newListing = new Listing({
      title: formData.get("title"),
      description: formData.get("description"),
      price: formData.get("price"),
      location: formData.get("location"),
      category: formData.get("category"),
      features: formData.get("features")
        ? JSON.parse(formData.get("features") as string)
        : [],
      images: uploadedImages, // safe → empty if none uploaded
      owner: vendor._id,
    });

    await newListing.save();

    // Add listing ref to vendor
    vendor.listings.push(newListing._id);
    await vendor.save();

    return NextResponse.json(
      {
        message:
          uploadedImages.length > 0
            ? "Listing created successfully with images"
            : "Listing created successfully (no images uploaded)",
        listing: newListing,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Error creating listing:", error);
    return NextResponse.json(
      {
        message: "Failed to create listing",
        error: error.message,
        stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
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
    const formData = await req.formData();
    const listingId = formData.get('listingId') as string;
    
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

    // Handle image uploads if new images are provided
    const imageFiles = formData.getAll('images') as File[];
    const uploadedImages = [];

    if (imageFiles.length > 0 && imageFiles[0].size > 0) {
      // Upload each new image to Cloudinary
      for (const file of imageFiles) {
        if (file.size > 0) {
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
    }

    // Handle image deletions if image IDs to delete are provided
    const imagesToDelete = formData.get('imagesToDelete') as string;
    if (imagesToDelete) {
      try {
        const deleteIds = JSON.parse(imagesToDelete);
        if (Array.isArray(deleteIds) && deleteIds.length > 0) {
          // Delete images from Cloudinary
          await Promise.all(
            deleteIds.map(async (publicId: string) => {
              await cloudinary.uploader.destroy(publicId);
            })
          );
          
          // Remove from listing images array
          listing.images = listing.images.filter(
            (img: any) => !deleteIds.includes(img.public_id)
          );
        }
      } catch (error) {
        console.error("Error parsing imagesToDelete:", error);
      }
    }

    // Update the listing with new images if any
    if (uploadedImages.length > 0) {
      listing.images = [...listing.images, ...uploadedImages];
    }

    // Update other listing fields
    const title = formData.get('title');
    const description = formData.get('description');
    const price = formData.get('price');
    const location = formData.get('location');
    const category = formData.get('category');
    const features = formData.get('features');
    const status = formData.get('status');

    if (title) listing.title = title as string;
    if (description) listing.description = description as string;
    if (price) listing.price = parseFloat(price as string);
    if (location) listing.location = location as string;
    if (category) listing.category = category as string;
    if (features) listing.features = JSON.parse(features as string);
    if (status) listing.status = status as string;

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