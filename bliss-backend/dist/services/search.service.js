import Listing from '../models/listing.js';
import Vendor from '../models/vendor.js';
import dbConnect from '../utils/dbConnect.js';
export class SearchService {
    /**
     * Search vendors by query and location
     */
    async searchVendors(query, location) {
        await dbConnect();
        // Return empty array if neither query nor location is provided
        if (!query && !location) {
            return { vendors: [], total: 0, listings: [] };
        }
        // Build the query object based on provided parameters
        const searchQuery = {
            $or: [],
        };
        if (query) {
            // Search in multiple fields
            searchQuery.$or.push({ title: { $regex: query, $options: 'i' } }, { description: { $regex: query, $options: 'i' } }, { features: { $regex: query, $options: 'i' } });
        }
        if (location) {
            searchQuery.location = { $regex: location, $options: 'i' };
        }
        // Find all listings that match the criteria
        const listings = await Listing.find(searchQuery)
            .populate('owner', 'ownerName ownerEmail ownerImage service_name service_description')
            .exec();
        // Get unique vendors (removing duplicates)
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
    /**
     * Get service by ID
     */
    async getServiceById(serviceId) {
        await dbConnect();
        if (!serviceId) {
            throw new Error('Service ID is required');
        }
        const service = await Listing.findById(serviceId);
        if (!service) {
            throw new Error('Service not found');
        }
        // Get vendor details
        const vendor = await Vendor.findById(service.owner).select('service_name name service_type');
        if (!vendor) {
            throw new Error('Vendor not found');
        }
        // Transform the data
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
}
//# sourceMappingURL=search.service.js.map