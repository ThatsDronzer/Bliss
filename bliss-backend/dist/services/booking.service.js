import MessageData from '../models/message.js';
import User from '../models/user.js';
import Vendor from '../models/vendor.js';
import Listing from '../models/listing.js';
import dbConnect from '../utils/dbConnect.js';
export class BookingService {
    /**
     * Get booking status by service ID
     */
    async getBookingStatus(userId, serviceId) {
        await dbConnect();
        const booking = await MessageData.findOne({
            'user.id': userId,
            'listing.id': serviceId,
            'bookingDetails.status': { $in: ['pending', 'accepted', 'cancelled'] },
        })
            .sort({ createdAt: -1 })
            .select('_id bookingDetails.status paymentStatus createdAt listing.title bookingDetails.totalPrice')
            .lean();
        if (!booking) {
            return { booking: null, message: 'No booking found for this service' };
        }
        return {
            booking: {
                _id: booking._id.toString(),
                status: booking.bookingDetails.status,
                paymentStatus: booking.paymentStatus,
                createdAt: booking.createdAt,
                listingTitle: booking.listing.title,
                totalPrice: booking.bookingDetails.totalPrice,
                canMakePayment: booking.bookingDetails.status === 'accepted' &&
                    booking.paymentStatus.status === 'pending',
            },
        };
    }
    /**
     * Cancel booking
     */
    async cancelBooking(userId, requestId) {
        await dbConnect();
        const updatedMessage = await MessageData.findOneAndUpdate({
            _id: requestId,
            'user.id': userId,
            'bookingDetails.status': { $in: ['pending', 'accepted'] },
        }, {
            'bookingDetails.status': 'cancelled',
            $set: {
                'paymentStatus.status': 'cancelled',
            },
        }, { new: true });
        if (!updatedMessage) {
            throw new Error('Booking request not found or cannot be cancelled');
        }
        return {
            _id: updatedMessage._id.toString(),
            status: updatedMessage.bookingDetails.status,
            paymentStatus: updatedMessage.paymentStatus.status,
        };
    }
    /**
     * Create booking message
     */
    async createBookingMessage(bookingData) {
        await dbConnect();
        const { userId, vendorId, listingId, selectedItems = [], totalPrice, address, bookingDate, bookingTime, specialInstructions, } = bookingData;
        // Validate required fields
        if (!userId ||
            !vendorId ||
            !listingId ||
            !address ||
            !bookingDate ||
            !bookingTime ||
            totalPrice === undefined) {
            throw new Error('Missing required fields: userId, vendorId, listingId, address, bookingDate, bookingTime, totalPrice');
        }
        if (!address.houseNo ||
            !address.areaName ||
            !address.landmark ||
            !address.state ||
            !address.pin) {
            throw new Error('Missing required address fields');
        }
        const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
        if (!timeRegex.test(bookingTime)) {
            throw new Error('Invalid booking time format. Please use HH:MM format');
        }
        if (typeof totalPrice !== 'number' || totalPrice < 0) {
            throw new Error('Total price must be a positive number');
        }
        // Find the person making the booking
        let booker = await User.findOne({ clerkId: userId });
        let bookerIsVendor = false;
        if (!booker) {
            booker = await Vendor.findOne({ clerkId: userId });
            if (booker) {
                bookerIsVendor = true;
            }
        }
        // Fetch the service listing and its owner
        const [listing, vendor] = await Promise.all([
            Listing.findById(listingId).exec(),
            Vendor.findById(vendorId).exec(),
        ]);
        if (!booker) {
            throw new Error('Booking user not found');
        }
        if (!vendor) {
            throw new Error('Vendor not found');
        }
        if (!listing) {
            throw new Error('Listing not found');
        }
        // Process selected items
        const selectedItemsWithDetails = [];
        const itemsSource = listing.items && listing.items.length > 0 ? listing.items : [];
        const itemNamesToFind = selectedItems && selectedItems.length > 0
            ? selectedItems
            : itemsSource.map((item) => item.name);
        itemNamesToFind.forEach((itemName) => {
            const listingItem = itemsSource.find((item) => item.name === itemName);
            if (listingItem) {
                selectedItemsWithDetails.push({
                    name: listingItem.name,
                    description: listingItem.description,
                    price: listingItem.price,
                    image: listingItem.image,
                });
            }
        });
        // Create the message
        const newMessage = new MessageData({
            user: {
                id: booker.clerkId,
                name: bookerIsVendor
                    ? booker.ownerName
                    : booker.name,
                email: bookerIsVendor
                    ? booker.ownerEmail
                    : booker.email,
                phone: bookerIsVendor
                    ? booker.owner_contactNo?.[0]
                    : booker.phone,
                address: booker.address,
            },
            vendor: {
                id: vendor.clerkId,
                name: vendor.service_name || vendor.ownerName,
                email: vendor.service_email || vendor.ownerEmail,
                phone: vendor.service_phone || vendor.owner_contactNo?.[0],
                service: listing.title,
                service_address: vendor.service_address,
            },
            listing: {
                id: listing._id,
                title: listing.title,
                description: listing.description,
                basePrice: listing.price,
                location: listing.location,
            },
            bookingDetails: {
                selectedItems: selectedItemsWithDetails,
                totalPrice: totalPrice,
                bookingDate: new Date(bookingDate),
                bookingTime: bookingTime,
                address: address,
                specialInstructions: specialInstructions,
                status: 'pending',
            },
        });
        const savedMessage = await newMessage.save();
        // Update booker and vendor with the new message reference
        const updateBookerPromise = bookerIsVendor
            ? Vendor.findByIdAndUpdate(booker._id, {
                $push: { messages: savedMessage._id },
            })
            : User.findByIdAndUpdate(booker._id, {
                $push: { messages: savedMessage._id },
            });
        await Promise.all([
            updateBookerPromise,
            Vendor.findByIdAndUpdate(vendor._id, {
                $push: { messages: savedMessage._id },
            }),
        ]);
        return savedMessage;
    }
    /**
     * Get vendor booking requests
     */
    async getVendorBookingRequests(userId, options) {
        await dbConnect();
        const { status, limit = 50, page = 1 } = options;
        const query = {
            'vendor.id': userId,
        };
        if (status && status !== 'all') {
            query['bookingDetails.status'] = status;
        }
        const total = await MessageData.countDocuments(query);
        const messages = await MessageData.find(query)
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(limit)
            .lean();
        const transformedMessages = messages.map((message) => ({
            id: message._id.toString(),
            user: {
                id: message.user.id,
                name: message.user.name,
                email: message.user.email,
                phone: message.user.phone,
            },
            listing: {
                id: message.listing.id.toString(),
                title: message.listing.title,
                description: message.listing.description,
                basePrice: message.listing.basePrice,
                location: message.listing.location,
            },
            bookingDetails: {
                selectedItems: message.bookingDetails.selectedItems.map((item) => ({
                    name: item.name,
                    description: item.description,
                    price: item.price,
                    image: item.image,
                })),
                totalPrice: message.bookingDetails.totalPrice,
                bookingDate: message.bookingDetails.bookingDate.toISOString(),
                bookingTime: message.bookingDetails.bookingTime,
                address: message.bookingDetails.status === 'accepted'
                    ? message.bookingDetails.address
                    : null,
                status: message.bookingDetails.status,
                specialInstructions: message.bookingDetails.specialInstructions,
            },
            createdAt: message.createdAt.toISOString(),
        }));
        return {
            messages: transformedMessages,
            pagination: {
                total,
                pages: Math.ceil(total / limit),
                currentPage: page,
                perPage: limit,
            },
        };
    }
    /**
     * Update vendor booking request status
     */
    async updateVendorBookingRequestStatus(userId, requestId, status) {
        await dbConnect();
        if (!status || !['accepted', 'not-accepted'].includes(status)) {
            throw new Error('Invalid status');
        }
        const updatedMessage = await MessageData.findOneAndUpdate({
            _id: requestId,
            'vendor.id': userId,
            'bookingDetails.status': 'pending',
        }, {
            'bookingDetails.status': status,
        }, { new: true, lean: true });
        if (!updatedMessage) {
            throw new Error('Booking request not found or cannot be updated');
        }
        const msg = updatedMessage;
        const transformedMessage = {
            id: msg._id.toString(),
            user: {
                id: msg.user.id,
                name: msg.user.name,
                email: msg.user.email,
                phone: msg.user.phone,
            },
            listing: {
                id: msg.listing.id.toString(),
                title: msg.listing.title,
                description: msg.listing.description,
                basePrice: msg.listing.basePrice,
                location: msg.listing.location,
            },
            bookingDetails: {
                selectedItems: msg.bookingDetails.selectedItems.map((item) => ({
                    name: item.name,
                    description: item.description,
                    price: item.price,
                    image: item.image,
                })),
                totalPrice: msg.bookingDetails.totalPrice,
                bookingDate: msg.bookingDetails.bookingDate.toISOString(),
                bookingTime: msg.bookingDetails.bookingTime,
                address: status === 'accepted' ? msg.bookingDetails.address : null,
                status: msg.bookingDetails.status,
                specialInstructions: msg.bookingDetails.specialInstructions,
            },
            createdAt: msg.createdAt.toISOString(),
        };
        return transformedMessage;
    }
}
//# sourceMappingURL=booking.service.js.map