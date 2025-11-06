import connectDB from "@/lib/config/db";
import Listing from "@/model/listing";
import Vendor from "@/model/vendor";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { users } from "@clerk/clerk-sdk-node";
import cloudinary from "@/lib/cloudinary";
import type { NextRequest } from "next/server";

interface CloudinaryImage {
  url: string;
  public_id: string;
  [key: string]: any;
}
async function cleanupImages(publicIds: string[]) {
  try {
    // Filter out any empty or invalid public_ids
    const validPublicIds = publicIds.filter(id => 
      id && typeof id === 'string' && id.trim().length > 0
    );

    if (validPublicIds.length === 0) {
      console.log('No valid public IDs to delete');
      return;
    }

    console.log(`Deleting ${validPublicIds.length} images from Cloudinary:`, validPublicIds);

    // Delete images in batches
    const batchSize = 10;
    for (let i = 0; i < validPublicIds.length; i += batchSize) {
      const batch = validPublicIds.slice(i, i + batchSize);
      
      const deletionResults = await Promise.allSettled(
        batch.map(async (publicId: string) => {
          try {
            const result = await cloudinary.uploader.destroy(publicId);
            console.log(`Cloudinary deletion result for ${publicId}:`, result);
            return { publicId, result };
          } catch (error) {
            console.error(`Error deleting image ${publicId}:`, error);
            throw error;
          }
        })
      );

      // Log results for debugging
      deletionResults.forEach((result, index) => {
        if (result.status === 'fulfilled') {
          console.log(`Successfully deleted ${batch[index]}`);
        } else {
          console.error(`Failed to delete ${batch[index]}:`, result.reason);
        }
      });
      
      // Small delay between batches
      if (i + batchSize < validPublicIds.length) {
        await new Promise(resolve => setTimeout(resolve, 200));
      }
    }

    console.log('Image cleanup completed');
  } catch (error) {
    console.error("Error in cleanupImages:", error);
    throw error; // Re-throw to handle in calling function
  }
}
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

  let tempImageIds: string[] = [];
  let tempItemImageIds: string[] = [];
  
  try {
    // Parse JSON body
    const body = await req.json();
    const { 
      title, 
      description, 
      price, 
      location, 
      category, 
      features, 
      images,
       items,
      tempImageIds: sentTempImageIds ,
       tempItemImageIds: sentTempItemImageIds// Get temp IDs from frontend
    } = body;

    // Store temp IDs for cleanup if needed
    if (sentTempImageIds && Array.isArray(sentTempImageIds)) {
      tempImageIds = sentTempImageIds;
    }
     if (sentTempItemImageIds && Array.isArray(sentTempItemImageIds)) {
      tempItemImageIds = sentTempItemImageIds;
    }
    // Validate required fields
    if (!title || !description || !price || !category) {
      // Clean up uploaded images if validation fails
      if (tempImageIds.length > 0 || tempItemImageIds.length > 0) {
        await cleanupImages([...tempImageIds, ...tempItemImageIds]);
      }
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    // Validate images
    if (!images || !Array.isArray(images) || images.length === 0) {
     if (tempImageIds.length > 0 || tempItemImageIds.length > 0) {
        await cleanupImages([...tempImageIds, ...tempItemImageIds]);
      }
      return NextResponse.json(
        { message: "At least one image is required" },
        { status: 400 }
      );
    }

    let vendor = await Vendor.findOne({ clerkId: userId });
    if (!vendor) {
        if (tempImageIds.length > 0 || tempItemImageIds.length > 0) {
        await cleanupImages([...tempImageIds, ...tempItemImageIds]);
      }
      return NextResponse.json(
        { message: "Vendor not found" },
        { status: 400 }
      );
    }

    const processedItems = items && Array.isArray(items) ? items.map((item: any) => ({
      name: item.name,
      description: item.description || '',
      price: typeof item.price === 'number' ? item.price : parseFloat(item.price) || 0,
      image: item.image || { url: '', public_id: '' } // Ensure image object structure
    })) : [];

    // Create new listing 
    const newListing = new Listing({
      title,
      description,
      price: typeof price === 'number' ? price : parseFloat(price),
      location: location || '',
      category,
      features: features || [],
      images: images, 
      items: processedItems,
      owner: vendor._id,
    });

    await newListing.save();

    // Update vendor's listings
    vendor.listings.push(newListing._id);
    await vendor.save();
    
    // Clean up any temporary images that weren't used
    if (tempImageIds.length > 0 || tempItemImageIds.length > 0) {
      const usedImageIds = images.map((img: CloudinaryImage) => img.public_id);
      const usedItemImageIds = processedItems
        .map((item: any) => item.image?.public_id)
        .filter((id: string) => id); // Filter out undefined/null
      
      const allUsedIds = [...usedImageIds, ...usedItemImageIds];
      const allTempIds = [...tempImageIds, ...tempItemImageIds];
      
      const imagesToDelete = allTempIds.filter((id: string) => !allUsedIds.includes(id));
      
      if (imagesToDelete.length > 0) {
        await cleanupImages(imagesToDelete);
      }
    }
    
    return NextResponse.json(
      {
        message: "Listing created successfully",
        listing: newListing
      },
      { status: 201 }
    );

  } catch (error: any) {
    // Clean up images on any error
     if (tempImageIds.length > 0 || tempItemImageIds.length > 0) {
      await cleanupImages([...tempImageIds, ...tempItemImageIds]);
    }
    
    
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

  let tempImageIds: string[] = [];
  let tempItemImageIds: string[] = [];
  
  try {
    const body = await req.json();
    const { 
      listingId, 
      title, 
      description, 
      price, 
      location, 
      category, 
      features, 
      images,
      items,
      imagesToDelete,
      itemImagesToDelete,
      tempImageIds: sentTempImageIds,
      tempItemImageIds: sentTempItemImageIds
    } = body;

    // Store temp IDs for cleanup
    if (sentTempImageIds && Array.isArray(sentTempImageIds)) {
      tempImageIds = sentTempImageIds;
    }
    if (sentTempItemImageIds && Array.isArray(sentTempItemImageIds)) {
      tempItemImageIds = sentTempItemImageIds;
    }

    if (!listingId) {
      if (tempImageIds.length > 0 || tempItemImageIds.length > 0) {
        await cleanupImages([...tempImageIds, ...tempItemImageIds]);
      }
      return NextResponse.json(
        { message: "Listing ID is required" },
        { status: 400 }
      );
    }

    const listing = await Listing.findById(listingId);
    if (!listing) {
      if (tempImageIds.length > 0 || tempItemImageIds.length > 0) {
        await cleanupImages([...tempImageIds, ...tempItemImageIds]);
      }
      return NextResponse.json({ message: "Listing not found" }, { status: 404 });
    }

    const vendor = await Vendor.findOne({ clerkId: userId });
    if (!vendor || !listing.owner.equals(vendor._id)) {
      if (tempImageIds.length > 0 || tempItemImageIds.length > 0) {
        await cleanupImages([...tempImageIds, ...tempItemImageIds]);
      }
      return NextResponse.json(
        { message: "Unauthorized: You do not own this listing" },
        { status: 403 }
      );
    }

    // FIX 1: Handle main image deletions FIRST
    if (imagesToDelete && Array.isArray(imagesToDelete) && imagesToDelete.length > 0) {
      // Filter out the images to be deleted BEFORE cleanup
      const imagesToKeep = listing.images.filter(
        (img: any) => !imagesToDelete.includes(img.public_id)
      );
      
      // Get the images that will actually be deleted
      const imagesBeingDeleted = listing.images.filter(
        (img: any) => imagesToDelete.includes(img.public_id)
      );
      
      // Clean up ONLY if there are valid images to delete
      if (imagesBeingDeleted.length > 0) {
        const publicIdsToDelete = imagesBeingDeleted
          .map((img: any) => img.public_id)
          .filter((id: string) => id && id.trim().length > 0);
        
        if (publicIdsToDelete.length > 0) {
          await cleanupImages(publicIdsToDelete);
        }
      }
      
      // Update the listing images
      listing.images = imagesToKeep;
    }

    // FIX 2: Handle item image deletions
    if (itemImagesToDelete && Array.isArray(itemImagesToDelete) && itemImagesToDelete.length > 0) {
      // Filter out empty public_ids
      const validItemImageIds = itemImagesToDelete.filter(
        (id: string) => id && id.trim().length > 0
      );
      
      if (validItemImageIds.length > 0) {
        await cleanupImages(validItemImageIds);
      }
    }

    // Add new main images if provided
    if (images && Array.isArray(images) && images.length > 0) {
      listing.images = [...listing.images, ...images];
    }

    // FIX 3: Process items - handle deletions properly
    if (items && Array.isArray(items)) {
      // For existing items, we need to handle image deletions at the item level
      const processedItems = items.map((item: any) => {
        // If this is an existing item with _id, check if it needs image updates
        if (item._id) {
          const existingItem = listing.items.find(
            (existing: any) => existing._id.toString() === item._id
          );
          
          // If the existing item had an image but the new item doesn't, or has a different image,
          // we need to delete the old image
          if (existingItem && existingItem.image && existingItem.image.public_id) {
            if (!item.image || !item.image.public_id || item.image.public_id !== existingItem.image.public_id) {
              // Schedule the old image for deletion
              cleanupImages([existingItem.image.public_id]).catch(console.error);
            }
          }
        }
        
        return {
          _id: item._id || undefined,
          name: item.name,
          description: item.description || '',
          price: typeof item.price === 'number' ? item.price : parseFloat(item.price) || 0,
          image: item.image || { url: '', public_id: '' }
        };
      });

      listing.items = processedItems;
    }

    // Update other fields
    if (title !== undefined) listing.title = title;
    if (description !== undefined) listing.description = description;
    if (price !== undefined) listing.price = typeof price === 'number' ? price : parseFloat(price);
    if (location !== undefined) listing.location = location;
    if (category !== undefined) listing.category = category;
    if (features !== undefined) listing.features = features;

    await listing.save();

    // FIX 4: Clean up temporary images that weren't used
    if (tempImageIds.length > 0 || tempItemImageIds.length > 0) {
      const usedImageIds = images ? images.map((img: CloudinaryImage) => img.public_id) : [];
      const usedItemImageIds = items ? items
        .map((item: any) => item.image?.public_id)
        .filter((id: string) => id) : [];
      
      const allUsedIds = [...usedImageIds, ...usedItemImageIds];
      const allTempIds = [...tempImageIds, ...tempItemImageIds];
      
      const imagesToCleanup = allTempIds.filter((id: string) => !allUsedIds.includes(id));
      
      if (imagesToCleanup.length > 0) {
        await cleanupImages(imagesToCleanup);
      }
    }

    return NextResponse.json(
      { message: "Listing updated successfully", listing },
      { status: 200 }
    );
  } catch (error: any) {
    // Clean up images on any error
    if (tempImageIds.length > 0 || tempItemImageIds.length > 0) {
      await cleanupImages([...tempImageIds, ...tempItemImageIds]);
    }
    
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

    // Collect ALL image public_ids to delete
    const allImagePublicIds: string[] = [];

    // Main listing images
    if (listing.images && listing.images.length > 0) {
      listing.images.forEach((image: any) => {
        if (image.public_id) {
          allImagePublicIds.push(image.public_id);
        }
      });
    }

    // Item images
    if (listing.items && listing.items.length > 0) {
      listing.items.forEach((item: any) => {
        if (item.image && item.image.public_id) {
          allImagePublicIds.push(item.image.public_id);
        }
      });
    }

    // Delete all images from Cloudinary
    if (allImagePublicIds.length > 0) {
      await cleanupImages(allImagePublicIds);
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