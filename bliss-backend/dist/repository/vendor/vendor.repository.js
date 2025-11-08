import { DBConnectionError } from '@exceptions/core.exceptions';
import { dbConnect } from '@repository/repository';
import { isValidObjectId } from 'mongoose';
import Vendor from '../../infrastructure/db/models/vendor.model.js';
import Listing from '../../infrastructure/db/models/listing.model.js';
export async function getVendorByClerkIdFromDb(clerkId) {
    try {
        await dbConnect();
        const vendor = await Vendor.findOne({ clerkId }).lean();
        return vendor;
    }
    catch (error) {
        console.error('Error while getVendorByClerkIdFromDb()', {
            error: error.message,
            stack: error.stack,
            data: { clerkId },
        });
        throw new DBConnectionError('Failed to fetch vendor from database');
    }
}
export async function getVendorByIdFromDb(id) {
    try {
        await dbConnect();
        if (!id || !isValidObjectId(id)) {
            throw new Error('Invalid vendor ID');
        }
        const vendor = await Vendor.findById(id).select({
            ownerName: 1,
            service_name: 1,
            service_email: 1,
            service_phone: 1,
            service_address: 1,
            service_description: 1,
            establishedYear: 1,
            service_type: 1,
            isVerified: 1,
            createdAt: 1,
        }).lean();
        if (!vendor) {
            return null;
        }
        const listings = await Listing.find({ owner: id })
            .select('title description price images features isActive')
            .lean();
        const services = listings.map((listing) => ({
            id: listing._id.toString(),
            name: listing.title,
            price: listing.price,
            description: listing.description,
            images: listing.images?.map((img) => img.url) || [],
            features: listing.features || [],
            isActive: listing.isActive,
        }));
        return {
            id: vendor._id.toString(),
            name: vendor.service_name,
            location: `${vendor.service_address?.City || ''}, ${vendor.service_address?.State || ''}`,
            rating: 4.5,
            category: vendor.service_type,
            coverImage: '/images/vendors/default-cover.jpg',
            description: vendor.service_description,
            shortDescription: vendor.service_description?.slice(0, 150) + '...',
            services: services,
            packages: [],
            gallery: [],
            reviews: [],
            availability: [],
            refundPolicy: {
                description: 'Standard refund policy applies',
                cancellationTerms: [
                    { daysBeforeEvent: 7, refundPercentage: 100 },
                    { daysBeforeEvent: 3, refundPercentage: 50 },
                ],
            },
            contact: {
                phone: vendor.service_phone,
                email: vendor.service_email,
                whatsapp: vendor.service_phone,
            },
            businessHours: 'Mon-Sat: 10:00 AM - 7:00 PM',
            socialLinks: {},
        };
    }
    catch (error) {
        // Re-throw validation errors for controller to handle
        if (error instanceof Error && error.message === 'Invalid vendor ID') {
            throw error;
        }
        console.error('Error while getVendorByIdFromDb()', {
            error: error.message,
            stack: error.stack,
            data: { id },
        });
        throw new DBConnectionError('Failed to fetch vendor from database');
    }
}
export async function getVendorServicesFromDb(id) {
    try {
        await dbConnect();
        if (!id || !isValidObjectId(id)) {
            throw new Error('Invalid vendor ID');
        }
        const listings = await Listing.find({ owner: id })
            .select('title description price images features isActive')
            .lean();
        return listings.map((listing) => ({
            id: listing._id.toString(),
            name: listing.title,
            price: listing.price,
            description: listing.description,
            images: listing.images?.map((img) => img.url) || [],
            features: listing.features || [],
            isActive: listing.isActive,
        }));
    }
    catch (error) {
        // Re-throw validation errors for controller to handle
        if (error instanceof Error && error.message === 'Invalid vendor ID') {
            throw error;
        }
        console.error('Error while getVendorServicesFromDb()', {
            error: error.message,
            stack: error.stack,
            data: { id },
        });
        throw new DBConnectionError('Failed to fetch vendor services from database');
    }
}
export async function getVendorServicesForExploreFromDb() {
    try {
        await dbConnect();
        const vendors = await Vendor.find({ isVerified: true });
        if (!vendors || vendors.length === 0) {
            return {
                message: 'No verified vendors found',
                services: [],
                vendorServices: [],
            };
        }
        const vendorMap = new Map(vendors.map((vendor) => [
            vendor._id.toString(),
            {
                id: vendor._id.toString(),
                name: vendor.service_name || vendor.ownerName,
                rating: 4.5,
                reviewsCount: 0,
                image: vendor.ownerImage || '/placeholder.svg?height=200&width=300&text=Vendor',
                location: vendor.service_address?.City || vendor.owner_address?.City || 'Location not specified',
                experience: 'Established: ' + (vendor.establishedYear || 'N/A'),
                description: vendor.service_description || 'No description available',
                verified: vendor.isVerified,
            },
        ]));
        const vendorIds = vendors.map((vendor) => vendor._id);
        const listings = await Listing.find({
            owner: { $in: vendorIds },
            isActive: true,
        });
        const services = listings.map((listing) => {
            const vendor = vendorMap.get(listing.owner.toString());
            return {
                id: listing._id.toString(),
                name: listing.title,
                price: listing.price,
                category: listing.features[0] || 'Other',
                description: listing.description,
                images: listing.images || [],
                featured: false,
                vendor: vendor ||
                    {
                        id: listing.owner.toString(),
                        name: 'Unknown Vendor',
                        rating: 0,
                        reviewsCount: 0,
                        image: '/placeholder.svg?height=200&width=300&text=Vendor',
                        location: 'Location not specified',
                        verified: false,
                    },
            };
        });
        const vendorServices = vendors.map((vendor) => {
            const vendorListings = listings.filter((listing) => listing.owner.toString() === vendor._id.toString());
            const vendorServicesList = vendorListings.map((listing) => ({
                id: listing._id.toString(),
                name: listing.title,
                price: listing.price,
                category: listing.features[0] || 'Other',
                description: listing.description,
                startingPrice: `₹${listing.price.toLocaleString('en-IN')}`,
            }));
            return {
                id: vendor._id.toString(),
                name: vendor.service_name || vendor.ownerName,
                rating: 4.5,
                reviewsCount: 0,
                image: vendor.ownerImage || '/placeholder.svg?height=200&width=300&text=Vendor',
                location: vendor.service_address?.City || vendor.owner_address?.City || 'Location not specified',
                experience: 'Established: ' + (vendor.establishedYear || 'N/A'),
                description: vendor.service_description || 'No description available',
                featured: false,
                verified: vendor.isVerified,
                services: vendorServicesList,
            };
        });
        return {
            services,
            vendorServices,
        };
    }
    catch (error) {
        console.error('Error while getVendorServicesForExploreFromDb()', {
            error: error.message,
            stack: error.stack,
        });
        throw new DBConnectionError('Failed to fetch vendor services for explore from database');
    }
}
export async function getVendorVerificationFromDb(clerkId) {
    try {
        await dbConnect();
        if (!clerkId) {
            throw new Error('clerkId is required');
        }
        const vendor = await Vendor.findOne({ clerkId });
        if (!vendor) {
            return {
                isVerified: false,
                message: 'Vendor not found',
            };
        }
        return {
            isVerified: vendor.isVerified || false,
            vendor: vendor.toObject(),
        };
    }
    catch (error) {
        // Re-throw validation errors for controller to handle
        if (error instanceof Error && error.message === 'clerkId is required') {
            throw error;
        }
        console.error('Error while getVendorVerificationFromDb()', {
            error: error.message,
            stack: error.stack,
            data: { clerkId },
        });
        throw new DBConnectionError('Failed to fetch vendor verification from database');
    }
}
export async function submitVendorVerificationInDb(verificationData) {
    try {
        await dbConnect();
        const { clerkId, businessName, businessType, businessAddress, businessCity, businessState, businessPincode, businessPhone, businessEmail, businessDescription, establishedYear, gstNumber, panNumber, ownerName, ownerEmail, ownerPhone, ownerCity, ownerState, ownerPincode, ownerAadhar, bankName, accountNumber, ifscCode, accountHolderName, } = verificationData;
        if (!clerkId) {
            throw new Error('clerkId is required');
        }
        let vendor = await Vendor.findOne({ clerkId });
        if (!vendor) {
            vendor = new Vendor({
                clerkId,
                ownerName: ownerName || businessName,
                ownerEmail: ownerEmail || businessEmail,
                service_name: businessName,
                service_email: businessEmail,
                service_phone: businessPhone,
                service_address: {
                    City: businessCity,
                    State: businessState,
                    location: businessAddress || '',
                    pinCode: businessPincode,
                },
                service_description: businessDescription,
                establishedYear: establishedYear,
                service_type: businessType,
                gstNumber: gstNumber,
                panNumber: panNumber,
                bankName: bankName,
                accountNumber: accountNumber,
                ifscCode: ifscCode,
                accountHolderName: accountHolderName,
                owner_address: {
                    City: ownerCity,
                    State: ownerState,
                    location: '',
                    pinCode: ownerPincode,
                },
                ownerAadhar: ownerAadhar,
                isVerified: true,
                updatedAt: new Date(),
            });
        }
        else {
            if (ownerName)
                vendor.ownerName = ownerName;
            if (ownerEmail)
                vendor.ownerEmail = ownerEmail;
            if (businessName)
                vendor.service_name = businessName;
            if (businessEmail)
                vendor.service_email = businessEmail;
            if (businessPhone)
                vendor.service_phone = businessPhone;
            if (businessCity || businessState || businessAddress || businessPincode) {
                vendor.service_address = {
                    City: businessCity || vendor.service_address?.City,
                    State: businessState || vendor.service_address?.State,
                    location: businessAddress || vendor.service_address?.location || '',
                    pinCode: businessPincode || vendor.service_address?.pinCode,
                };
            }
            if (businessDescription)
                vendor.service_description = businessDescription;
            if (establishedYear)
                vendor.establishedYear = establishedYear;
            if (businessType)
                vendor.service_type = businessType;
            if (gstNumber)
                vendor.gstNumber = gstNumber;
            if (panNumber)
                vendor.panNumber = panNumber;
            if (bankName)
                vendor.bankName = bankName;
            if (accountNumber)
                vendor.accountNumber = accountNumber;
            if (ifscCode)
                vendor.ifscCode = ifscCode;
            if (accountHolderName)
                vendor.accountHolderName = accountHolderName;
            if (ownerCity || ownerState || ownerPincode) {
                vendor.owner_address = {
                    City: ownerCity || vendor.owner_address?.City,
                    State: ownerState || vendor.owner_address?.State,
                    location: vendor.owner_address?.location || '',
                    pinCode: ownerPincode || vendor.owner_address?.pinCode,
                };
            }
            if (ownerAadhar)
                vendor.ownerAadhar = ownerAadhar;
            vendor.isVerified = true;
            vendor.updatedAt = new Date();
        }
        await vendor.save();
        return {
            success: true,
            vendor: vendor.toObject(),
            message: 'Verification submitted successfully. Your application has been verified.',
        };
    }
    catch (error) {
        // Re-throw validation errors for controller to handle
        if (error instanceof Error && error.message === 'clerkId is required') {
            throw error;
        }
        console.error('Error while submitVendorVerificationInDb()', {
            error: error.message,
            stack: error.stack,
            data: { clerkId: verificationData.clerkId },
        });
        throw new DBConnectionError('Failed to submit vendor verification in database');
    }
}
export async function updateVendorByClerkIdInDb(clerkId, updateData) {
    try {
        await dbConnect();
        const updatePayload = {
            ...updateData,
            updatedAt: new Date(),
        };
        const updatedVendor = await Vendor.findOneAndUpdate({ clerkId }, { $set: updatePayload }, {
            new: true,
            upsert: true,
            runValidators: true,
        }).lean();
        return updatedVendor;
    }
    catch (error) {
        console.error('Error while updateVendorByClerkIdInDb()', {
            error: error.message,
            stack: error.stack,
            data: { clerkId },
        });
        throw new DBConnectionError('Failed to update vendor in database');
    }
}
//# sourceMappingURL=vendor.repository.js.map