import { DBConnectionError } from '@exceptions/core.exceptions';
import { dbConnect } from '@repository/repository';
import Listing from '../../infrastructure/db/models/listing.model.js';
import Vendor from '../../infrastructure/db/models/vendor.model.js';
export async function searchVendorsFromDb(query, location) {
    try {
        await dbConnect();
        if (!query && !location) {
            return { vendors: [], total: 0, listings: [] };
        }
        const searchQuery = {
            $or: [],
        };
        if (query) {
            searchQuery.$or.push({ title: { $regex: query, $options: 'i' } }, { description: { $regex: query, $options: 'i' } }, { features: { $regex: query, $options: 'i' } });
        }
        if (location) {
            searchQuery.location = { $regex: location, $options: 'i' };
        }
        const listings = await Listing.find(searchQuery)
            .populate('owner', 'ownerName ownerEmail ownerImage service_name service_description')
            .exec();
        const uniqueVendors = Array.from(new Map(listings.map((listing) => [
            listing.owner._id.toString(),
            listing.owner,
        ])).values());
        return {
            vendors: uniqueVendors,
            total: uniqueVendors.length,
            listings: listings.map((l) => ({
                id: l._id,
                title: l.title,
                description: l.description,
                price: l.price,
                location: l.location,
                features: l.features,
            })),
        };
    }
    catch (error) {
        console.error('Error while searchVendorsFromDb()', {
            error: error.message,
            stack: error.stack,
            data: { query, location },
        });
        throw new DBConnectionError('Failed to search vendors from database');
    }
}
export async function getServiceByIdFromDb(serviceId) {
    try {
        await dbConnect();
        if (!serviceId) {
            throw new Error('Service ID is required');
        }
        const service = await Listing.findById(serviceId);
        if (!service) {
            throw new Error('Service not found');
        }
        const vendor = await Vendor.findById(service.owner).select('service_name name service_type');
        if (!vendor) {
            throw new Error('Vendor not found');
        }
        return {
            _id: service._id.toString(),
            name: service.title,
            description: service.description,
            price: service.price,
            images: service.images?.map((img) => img.url) || [],
            features: service.features || [],
            isActive: service.isActive,
            vendor: {
                _id: vendor._id.toString(),
                name: vendor.service_name || vendor.name || 'Unknown Vendor',
                category: vendor.service_type || 'General',
            },
            category: vendor.service_type || 'General',
            items: service.items || [],
        };
    }
    catch (error) {
        // Re-throw validation errors for controller to handle
        if (error instanceof Error &&
            (error.message === 'Service ID is required' ||
                error.message === 'Service not found' ||
                error.message === 'Vendor not found')) {
            throw error;
        }
        console.error('Error while getServiceByIdFromDb()', {
            error: error.message,
            stack: error.stack,
            data: { serviceId },
        });
        throw new DBConnectionError('Failed to fetch service from database');
    }
}
//# sourceMappingURL=search.repository.js.map