import { DBConnectionError } from '@exceptions/core.exceptions';
import { dbConnect } from '@repository/repository';
import Listing from '../../infrastructure/db/models/listing.model.js';
import Vendor from '../../infrastructure/db/models/vendor.model.js';
import { cleanupImages } from '../../utils/cloudinary.js';
export async function getVendorListingsFromDb(clerkId) {
    try {
        await dbConnect();
        const vendor = await Vendor.findOne({ clerkId });
        if (!vendor) {
            throw new Error('Vendor not found');
        }
        const listings = await Listing.find({ owner: vendor._id });
        return { listings };
    }
    catch (error) {
        throw new DBConnectionError('Failed to fetch vendor listings from database');
    }
}
export async function getListingByIdFromDb(listingId, clerkId) {
    try {
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
    catch (error) {
        throw new DBConnectionError('Failed to fetch listing from database');
    }
}
export async function createListingInDb(clerkId, listingData) {
    try {
        await dbConnect();
        const { title, description, price, location, category, features, images, items, tempImageIds, tempItemImageIds, } = listingData;
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
    catch (error) {
        if (error instanceof DBConnectionError)
            throw error;
        throw new DBConnectionError('Failed to create listing in database');
    }
}
export async function updateListingInDb(clerkId, updateData) {
    try {
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
        if (itemImagesToDelete && Array.isArray(itemImagesToDelete) && itemImagesToDelete.length > 0) {
            const validItemImageIds = itemImagesToDelete.filter((id) => id && id.trim().length > 0);
            if (validItemImageIds.length > 0) {
                await cleanupImages(validItemImageIds);
            }
        }
        if (images && Array.isArray(images) && images.length > 0) {
            listing.images = [...listing.images, ...images];
        }
        if (items && Array.isArray(items)) {
            const processedItems = items.map((item) => ({
                name: item.name,
                description: item.description || '',
                price: typeof item.price === 'number' ? item.price : parseFloat(item.price) || 0,
                image: item.image || { url: '', public_id: '' },
            }));
            listing.items = processedItems;
        }
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
    catch (error) {
        if (error instanceof DBConnectionError)
            throw error;
        throw new DBConnectionError('Failed to update listing in database');
    }
}
export async function deleteListingFromDb(clerkId, listingId) {
    try {
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
    catch (error) {
        throw new DBConnectionError('Failed to delete listing from database');
    }
}
export async function toggleListingStatusInDb(clerkId, listingId) {
    try {
        await dbConnect();
        if (!listingId) {
            throw new Error('Listing ID is required');
        }
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
        listing.isActive = !listing.isActive;
        await listing.save();
        return listing;
    }
    catch (error) {
        throw new DBConnectionError('Failed to toggle listing status in database');
    }
}
export async function addImagesToListingInDb(clerkId, listingId, images) {
    try {
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
        if (images && Array.isArray(images) && images.length > 0) {
            listing.images = [...listing.images, ...images];
            await listing.save();
        }
        return listing;
    }
    catch (error) {
        throw new DBConnectionError('Failed to add images to listing in database');
    }
}
//# sourceMappingURL=listing.repository.js.map