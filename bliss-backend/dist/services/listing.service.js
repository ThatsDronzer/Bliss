import Listing from '../models/listing.js';
import Vendor from '../models/vendor.js';
import Review from '../models/reviews.js';
import dbConnect from '../utils/dbConnect.js';
import { cleanupImages } from '../utils/cloudinary.js';
export class ListingService {
    /**
     * Get all listings for a vendor
     */
    async getVendorListings(clerkId) {
        await dbConnect();
        const vendor = await Vendor.findOne({ clerkId });
        if (!vendor) {
            throw new Error('Vendor not found');
        }
        const listings = await Listing.find({ owner: vendor._id });
        return { listings };
    }
    /**
     * Get listing by ID (vendor must own it)
     */
    async getListingById(listingId, clerkId) {
        await dbConnect();
        const vendor = await Vendor.findOne({ clerkId });
        if (!vendor) {
            throw new Error('Vendor not found');
        }
        const listing = await Listing.findOne({
            _id: listingId,
            owner: vendor._id,
        });
        if (!listing) {
            throw new Error('Listing not found');
        }
        return { listing };
    }
    /**
     * Create new listing
     */
    async createListing(clerkId, listingData) {
        await dbConnect();
        const { title, description, price, location, category, features, images, items, tempImageIds, tempItemImageIds, } = listingData;
        // Validate required fields
        if (!title || !description || !price || !category) {
            if (tempImageIds?.length > 0 || tempItemImageIds?.length > 0) {
                await cleanupImages([...tempImageIds, ...tempItemImageIds]);
            }
            throw new Error('Missing required fields');
        }
        if (!images || !Array.isArray(images) || images.length === 0) {
            if (tempImageIds?.length > 0 || tempItemImageIds?.length > 0) {
                await cleanupImages([...tempImageIds, ...tempItemImageIds]);
            }
            throw new Error('At least one image is required');
        }
        const vendor = await Vendor.findOne({ clerkId });
        if (!vendor) {
            if (tempImageIds?.length > 0 || tempItemImageIds?.length > 0) {
                await cleanupImages([...tempImageIds, ...tempItemImageIds]);
            }
            throw new Error('Vendor not found');
        }
        const processedItems = items && Array.isArray(items)
            ? items.map((item) => ({
                name: item.name,
                description: item.description || '',
                price: typeof item.price === 'number' ? item.price : parseFloat(item.price) || 0,
                image: item.image || { url: '', public_id: '' },
            }))
            : [];
        const newListing = new Listing({
            title,
            description,
            price: typeof price === 'number' ? price : parseFloat(price),
            location: location || '',
            features: features || [],
            images: images,
            items: processedItems,
            owner: vendor._id,
        });
        await newListing.save();
        vendor.listings.push(newListing._id);
        await vendor.save();
        // Clean up unused temporary images
        if (tempImageIds?.length > 0 || tempItemImageIds?.length > 0) {
            const usedImageIds = images.map((img) => img.public_id);
            const usedItemImageIds = processedItems
                .map((item) => item.image?.public_id)
                .filter((id) => id);
            const allUsedIds = [...usedImageIds, ...usedItemImageIds];
            const allTempIds = [...tempImageIds, ...tempItemImageIds];
            const imagesToDelete = allTempIds.filter((id) => !allUsedIds.includes(id));
            if (imagesToDelete.length > 0) {
                await cleanupImages(imagesToDelete);
            }
        }
        return newListing;
    }
    /**
     * Update listing
     */
    async updateListing(clerkId, updateData) {
        await dbConnect();
        const { listingId, title, description, price, location, category, features, images, items, imagesToDelete, itemImagesToDelete, tempImageIds, tempItemImageIds, } = updateData;
        let tempIds = [];
        if (tempImageIds && Array.isArray(tempImageIds)) {
            tempIds = [...tempIds, ...tempImageIds];
        }
        if (tempItemImageIds && Array.isArray(tempItemImageIds)) {
            tempIds = [...tempIds, ...tempItemImageIds];
        }
        if (!listingId) {
            if (tempIds.length > 0) {
                await cleanupImages(tempIds);
            }
            throw new Error('Listing ID is required');
        }
        const listing = await Listing.findById(listingId);
        if (!listing) {
            if (tempIds.length > 0) {
                await cleanupImages(tempIds);
            }
            throw new Error('Listing not found');
        }
        const vendor = await Vendor.findOne({ clerkId });
        if (!vendor || !listing.owner.equals(vendor._id)) {
            if (tempIds.length > 0) {
                await cleanupImages(tempIds);
            }
            throw new Error('Unauthorized: You do not own this listing');
        }
        // Handle main image deletions
        if (imagesToDelete && Array.isArray(imagesToDelete) && imagesToDelete.length > 0) {
            const imagesToKeep = listing.images.filter((img) => !imagesToDelete.includes(img.public_id));
            const imagesBeingDeleted = listing.images.filter((img) => imagesToDelete.includes(img.public_id));
            if (imagesBeingDeleted.length > 0) {
                const publicIdsToDelete = imagesBeingDeleted
                    .map((img) => img.public_id)
                    .filter((id) => id && id.trim().length > 0);
                if (publicIdsToDelete.length > 0) {
                    await cleanupImages(publicIdsToDelete);
                }
            }
            listing.images = imagesToKeep;
        }
        // Handle item image deletions
        if (itemImagesToDelete && Array.isArray(itemImagesToDelete) && itemImagesToDelete.length > 0) {
            const validItemImageIds = itemImagesToDelete.filter((id) => id && id.trim().length > 0);
            if (validItemImageIds.length > 0) {
                await cleanupImages(validItemImageIds);
            }
        }
        // Add new main images if provided
        if (images && Array.isArray(images) && images.length > 0) {
            listing.images = [...listing.images, ...images];
        }
        // Process items
        if (items && Array.isArray(items)) {
            const processedItems = items.map((item) => {
                if (item._id) {
                    const existingItem = listing.items.find((existing) => existing._id.toString() === item._id);
                    if (existingItem && existingItem.image && existingItem.image.public_id) {
                        if (!item.image ||
                            !item.image.public_id ||
                            item.image.public_id !== existingItem.image.public_id) {
                            cleanupImages([existingItem.image.public_id]).catch(console.error);
                        }
                    }
                }
                return {
                    _id: item._id || undefined,
                    name: item.name,
                    description: item.description || '',
                    price: typeof item.price === 'number' ? item.price : parseFloat(item.price) || 0,
                    image: item.image || { url: '', public_id: '' },
                };
            });
            listing.items = processedItems;
        }
        // Update other fields
        if (title !== undefined)
            listing.title = title;
        if (description !== undefined)
            listing.description = description;
        if (price !== undefined)
            listing.price = typeof price === 'number' ? price : parseFloat(price);
        if (location !== undefined)
            listing.location = location;
        if (category !== undefined)
            listing.category = category;
        if (features !== undefined)
            listing.features = features;
        await listing.save();
        // Clean up temporary images that weren't used
        if (tempIds.length > 0) {
            const usedImageIds = images ? images.map((img) => img.public_id) : [];
            const usedItemImageIds = items
                ? items.map((item) => item.image?.public_id).filter((id) => id)
                : [];
            const allUsedIds = [...usedImageIds, ...usedItemImageIds];
            const imagesToCleanup = tempIds.filter((id) => !allUsedIds.includes(id));
            if (imagesToCleanup.length > 0) {
                await cleanupImages(imagesToCleanup);
            }
        }
        return listing;
    }
    /**
     * Delete listing
     */
    async deleteListing(clerkId, listingId) {
        await dbConnect();
        const listing = await Listing.findById(listingId);
        if (!listing) {
            throw new Error('Listing not found');
        }
        const vendor = await Vendor.findOne({ clerkId });
        if (!vendor) {
            throw new Error('Vendor not found');
        }
        if (!listing.owner.equals(vendor._id)) {
            throw new Error('Unauthorized: You do not own this listing');
        }
        // Collect all image public_ids to delete
        const allImagePublicIds = [];
        if (listing.images && listing.images.length > 0) {
            listing.images.forEach((image) => {
                if (image.public_id) {
                    allImagePublicIds.push(image.public_id);
                }
            });
        }
        if (listing.items && listing.items.length > 0) {
            listing.items.forEach((item) => {
                if (item.image && item.image.public_id) {
                    allImagePublicIds.push(item.image.public_id);
                }
            });
        }
        if (allImagePublicIds.length > 0) {
            await cleanupImages(allImagePublicIds);
        }
        await Listing.deleteOne({ _id: listingId });
        await Vendor.updateOne({ _id: vendor._id }, { $pull: { listings: listingId } });
        return listingId;
    }
    /**
     * Toggle listing active status
     */
    async toggleListingStatus(clerkId, listingId) {
        await dbConnect();
        if (!listingId) {
            throw new Error('Listing ID is required');
        }
        const vendor = await Vendor.findOne({ clerkId });
        if (!vendor) {
            throw new Error('Vendor not found');
        }
        const listing = await Listing.findById(listingId);
        if (!listing) {
            throw new Error('Listing not found');
        }
        if (!listing.owner.equals(vendor._id)) {
            throw new Error('Unauthorized: You do not own this listing');
        }
        listing.isActive = !listing.isActive;
        await listing.save();
        return listing;
    }
    /**
     * Add images to listing
     */
    async addImages(clerkId, listingId, newImages) {
        await dbConnect();
        const vendor = await Vendor.findOne({ clerkId });
        if (!vendor) {
            throw new Error('Vendor not found');
        }
        const listing = await Listing.findOne({ _id: listingId, owner: vendor._id });
        if (!listing) {
            throw new Error('Listing not found or unauthorized');
        }
        listing.images.push(...newImages);
        await listing.save();
        return newImages;
    }
    /**
     * Get listing reviews
     */
    async getListingReviews(listingId) {
        await dbConnect();
        const listing = await Listing.findById(listingId);
        if (!listing) {
            throw new Error('Listing not found');
        }
        const reviews = await Review.find({ listing: listing._id });
        return reviews;
    }
}
//# sourceMappingURL=listing.service.js.map