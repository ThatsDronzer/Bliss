import connectDB from "@/lib/config/db";
import Listing from "@/model/listing";
import Vendor from "@/model/vendor";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { users } from "@clerk/clerk-sdk-node";
import cloudinary from "@/lib/cloudinary";
import type { NextRequest } from "next/server";


const MAX_FILE_SIZE = 4 * 1024 * 1024; // 4MB

export async function PATCH(req: NextRequest) {
  try {
    console.log('Starting image upload process...');

    // Check Cloudinary configuration
    if (!process.env.CLOUDINARY_CLOUD_NAME || 
        !process.env.CLOUDINARY_API_KEY || 
        !process.env.CLOUDINARY_API_SECRET) {
      console.error('Cloudinary environment variables are missing');
      return NextResponse.json(
        { message: "Server configuration error" },
        { status: 500 }
      );
    }

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

    const formData = await req.formData();
    const listingId = formData.get('listingId') as string;
    const imageFiles = formData.getAll('newImages') as File[];

    console.log('Received data:', { listingId, fileCount: imageFiles.length });

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

    // Validate file sizes
    for (const file of imageFiles) {
      if (file.size > MAX_FILE_SIZE) {
        return NextResponse.json(
          { message: `File ${file.name} exceeds 4MB limit` },
          { status: 400 }
        );
      }
    }

    const vendor = await Vendor.findOne({ clerkId: userId });
    if (!vendor) {
      return NextResponse.json({ message: "Vendor not found" }, { status: 404 });
    }

    const listing = await Listing.findOne({ _id: listingId, owner: vendor._id });
    if (!listing) {
      return NextResponse.json(
        { message: "Listing not found or unauthorized" },
        { status: 404 }
      );
    }

    const newUploadedImages = [];
    
    for (const file of imageFiles) {
      try {
        console.log(`Processing file: ${file.name}, size: ${file.size} bytes`);
        
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        const uploadResult: any = await new Promise((resolve, reject) => {
          const timeout = setTimeout(() => {
            reject(new Error('Upload timeout'));
          }, 10000);

          cloudinary.uploader.upload_stream(
            {
              folder: 'listings',
              transformation: [
                { width: 800, height: 800, crop: 'limit' },
                { quality: 'auto' }
              ]
            },
            (error, result) => {
              clearTimeout(timeout);
              if (error) {
                console.error('Cloudinary upload error:', error);
                reject(error);
              } else {
                resolve(result);
              }
            }
          ).end(buffer);
        });

        newUploadedImages.push({
          url: uploadResult.secure_url,
          public_id: uploadResult.public_id
        });

        console.log(`Successfully uploaded: ${file.name}`);

      } catch (fileError) {
        console.error(`Failed to upload file ${file.name}:`, fileError);
        // Continue with other files instead of failing completely
        continue;
      }
    }

    if (newUploadedImages.length === 0) {
      return NextResponse.json(
        { message: "All file uploads failed" },
        { status: 400 }
      );
    }

    listing.images.push(...newUploadedImages);
    await listing.save();

    console.log('Successfully updated listing with new images');

    return NextResponse.json(
      {
        message: "Images added successfully",
        newImages: newUploadedImages
      },
      { status: 200 }
    );

  } catch (error: any) {
    console.error("Detailed error in PATCH:", {
      message: error.message,
      stack: error.stack,
      name: error.name
    });
    
    return NextResponse.json(
      {
        message: "Failed to add images",
        error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
      },
      { status: 500 }
    );
  }
}