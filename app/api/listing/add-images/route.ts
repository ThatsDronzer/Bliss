import connectDB from "@/lib/config/db";
import Listing from "@/model/listing";
import Vendor from "@/model/vendor";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { users } from "@clerk/clerk-sdk-node";
import cloudinary from "@/lib/cloudinary";

import type { NextRequest } from "next/server";

export async function PATCH(req: NextRequest) {
  const auth = getAuth(req);
  const userId = auth.userId;

  // 1. Check if user is signed in
  if (!userId) {
    return NextResponse.json(
      { message: "User is not signed in" },
      { status: 401 }
    );
  }

  // 2. (Optional) Check if user has the 'vendor' role
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

    // 3. Get the listing ID and new images from the form data
    const listingId = formData.get('listingId') as string;
    const imageFiles = formData.getAll('newImages') as File[]; // Use 'newImages' to distinguish from initial upload

    if (!listingId) {
      return NextResponse.json(
        { message: "Listing ID is required" },
        { status: 400 }
      );
    }

    if (!imageFiles || imageFiles.length === 0) {
      return NextResponse.json(
        { message: "At least one new image is required" },
        { status: 400 }
      );
    }

    // 4. Find the vendor and the listing, and verify ownership
    const vendor = await Vendor.findOne({ clerkId: userId });
    if (!vendor) {
      return NextResponse.json({ message: "Vendor not found" }, { status: 404 });
    }

    const listing = await Listing.findOne({ _id: listingId, owner: vendor._id });
    if (!listing) {
      // This will trigger if the listing doesn't exist OR if the vendor doesn't own it
      return NextResponse.json(
        { message: "Listing not found or unauthorized" },
        { status: 404 }
      );
    }

    // 5. Upload new images to Cloudinary
    const newUploadedImages = [];
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

        newUploadedImages.push({
          url: uploadResult.secure_url,
          public_id: uploadResult.public_id
        });
      }
    }

    // 6. Append the new images to the existing array
    listing.images.push(...newUploadedImages); // Use the spread operator to push all new images

    // 7. Save the updated listing
    await listing.save();

    return NextResponse.json(
      {
        message: "Images added successfully",
        listing: listing, // Sending back the updated listing
        newImages: newUploadedImages // Optionally, just send the new images
      },
      { status: 200 }
    );

  } catch (error: any) {
    console.error("Error adding images to listing:", error);
    return NextResponse.json(
      {
        message: "Failed to add images",
        error: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}