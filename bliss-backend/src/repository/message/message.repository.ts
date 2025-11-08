import { DBConnectionError } from '@exceptions/core.exceptions';
import { dbConnect } from '@repository/repository';
import MessageData from '../../infrastructure/db/models/message.model.js';
import User from '../../infrastructure/db/models/user.model.js';
import Vendor from '../../infrastructure/db/models/vendor.model.js';
import Listing from '../../infrastructure/db/models/listing.model.js';
import type { IMessageData, ICreateMessageInput, IUpdateMessageInput } from '@models/message/message.model';

export async function getBookingStatusFromDb(userId: string, serviceId: string): Promise<any> {
	try {
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
				_id: (booking as any)._id.toString(),
				status: (booking as any).bookingDetails.status,
				paymentStatus: (booking as any).paymentStatus,
				createdAt: (booking as any).createdAt,
				listingTitle: (booking as any).listing.title,
				totalPrice: (booking as any).bookingDetails.totalPrice,
				canMakePayment:
					(booking as any).bookingDetails.status === 'accepted' &&
					(booking as any).paymentStatus.status === 'pending',
			},
		};
	} catch (error: any) {
		console.error('Error while getBookingStatusFromDb()', {
			error: error.message,
			stack: error.stack,
			data: { userId, serviceId },
		});
		throw new DBConnectionError('Failed to fetch booking status from database');
	}
}

export async function cancelBookingFromDb(userId: string, requestId: string): Promise<any> {
	try {
		await dbConnect();

		const updatedMessage = await MessageData.findOneAndUpdate(
			{
				_id: requestId,
				'user.id': userId,
				'bookingDetails.status': { $in: ['pending', 'accepted'] },
			},
			{
				'bookingDetails.status': 'cancelled',
				$set: {
					'paymentStatus.status': 'cancelled',
					updatedAt: new Date(),
				},
			},
			{ new: true }
		);

		if (!updatedMessage) {
			throw new Error('Booking request not found or cannot be cancelled');
		}

		return {
			_id: updatedMessage._id.toString(),
			status: updatedMessage.bookingDetails.status,
			paymentStatus: updatedMessage.paymentStatus.status,
		};
	} catch (error: any) {
		// Re-throw validation errors for controller to handle
		if (error instanceof Error && error.message === 'Booking request not found or cannot be cancelled') {
			throw error;
		}
		
		console.error('Error while cancelBookingFromDb()', {
			error: error.message,
			stack: error.stack,
			data: { userId, requestId },
		});
		throw new DBConnectionError('Failed to cancel booking in database');
	}
}

export async function createBookingMessageInDb(bookingData: any): Promise<any> {
	try {
		await dbConnect();

		const {
			userId,
			vendorId,
			listingId,
			selectedItems = [],
			totalPrice,
			address,
			bookingDate,
			bookingTime,
			specialInstructions,
		} = bookingData;

		if (
			!userId ||
			!vendorId ||
			!listingId ||
			!address ||
			!bookingDate ||
			!bookingTime ||
			totalPrice === undefined
		) {
			throw new Error('Missing required fields');
		}

		if (
			!address.houseNo ||
			!address.areaName ||
			!address.landmark ||
			!address.state ||
			!address.pin
		) {
			throw new Error('Missing required address fields');
		}

		const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
		if (!timeRegex.test(bookingTime)) {
			throw new Error('Invalid booking time format');
		}

		if (typeof totalPrice !== 'number' || totalPrice < 0) {
			throw new Error('Total price must be a positive number');
		}

		let booker: any = await User.findOne({ clerkId: userId });
		let bookerIsVendor = false;
		if (!booker) {
			booker = await Vendor.findOne({ clerkId: userId });
			if (booker) {
				bookerIsVendor = true;
			}
		}

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

		const selectedItemsWithDetails: any[] = [];
		const itemsSource = listing.items && listing.items.length > 0 ? listing.items : [];
		const itemNamesToFind = selectedItems && selectedItems.length > 0
			? selectedItems
			: itemsSource.map((item: any) => item.name);

		itemNamesToFind.forEach((itemName: string) => {
			const listingItem = itemsSource.find((item: any) => item.name === itemName);
			if (listingItem) {
				selectedItemsWithDetails.push({
					name: listingItem.name,
					description: listingItem.description,
					price: listingItem.price,
					image: listingItem.image,
				});
			}
		});

		const newMessage = new MessageData({
			user: {
				id: booker.clerkId,
				name: bookerIsVendor ? (booker as any).ownerName : (booker as any).name,
				email: bookerIsVendor ? (booker as any).ownerEmail : (booker as any).email,
				phone: bookerIsVendor ? (booker as any).owner_contactNo?.[0] : (booker as any).phone,
				address: (booker as any).address,
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
	} catch (error: any) {
		// Re-throw validation errors for controller to handle
		if (error instanceof Error && (
			error.message === 'Missing required fields' ||
			error.message === 'Missing required address fields' ||
			error.message === 'Invalid booking time format' ||
			error.message === 'Total price must be a positive number' ||
			error.message === 'Booking user not found' ||
			error.message === 'Vendor not found' ||
			error.message === 'Listing not found'
		)) {
			throw error;
		}
		
		console.error('Error while createBookingMessageInDb()', {
			error: error.message,
			stack: error.stack,
			data: { ...bookingData },
		});
		throw new DBConnectionError('Failed to create booking message in database');
	}
}

export async function getVendorBookingRequestsFromDb(userId: string, options: {
	status?: string;
	limit?: number;
	page?: number;
}): Promise<any> {
	try {
		await dbConnect();

		const { status, limit = 50, page = 1 } = options;

		const query: any = {
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

		return {
			messages,
			total,
			limit,
			page,
		};
	} catch (error: any) {
		console.error('Error while getVendorBookingRequestsFromDb()', {
			error: error.message,
			stack: error.stack,
			data: { userId, options },
		});
		throw new DBConnectionError('Failed to fetch vendor booking requests from database');
	}
}

export async function updateVendorBookingRequestStatusFromDb(
	userId: string,
	requestId: string,
	status: 'accepted' | 'not-accepted'
): Promise<any> {
	try {
		await dbConnect();

		if (!status || !['accepted', 'not-accepted'].includes(status)) {
			throw new Error('Invalid status');
		}

		const updatedMessage = await MessageData.findOneAndUpdate(
			{
				_id: requestId,
				'vendor.id': userId,
				'bookingDetails.status': 'pending',
			},
			{
				'bookingDetails.status': status,
				updatedAt: new Date(),
			},
			{ new: true, lean: true }
		);

		if (!updatedMessage) {
			throw new Error('Booking request not found or cannot be updated');
		}

		return updatedMessage;
	} catch (error: any) {
		// Re-throw validation errors for controller to handle
		if (error instanceof Error && (
			error.message === 'Invalid status' ||
			error.message === 'Booking request not found or cannot be updated'
		)) {
			throw error;
		}
		
		console.error('Error while updateVendorBookingRequestStatusFromDb()', {
			error: error.message,
			stack: error.stack,
			data: { userId, requestId, status },
		});
		throw new DBConnectionError('Failed to update vendor booking request status in database');
	}
}

export async function getUserBookingRequestsFromDb(userId: string, options: {
	status?: string;
	limit?: number;
	page?: number;
}): Promise<any> {
	try {
		await dbConnect();

		const { status, limit = 50, page = 1 } = options;

		const query: any = {
			'user.id': userId,
		};

		if (status) {
			query['bookingDetails.status'] = status;
		}

		const total = await MessageData.countDocuments(query);

		const messages = await MessageData.find(query)
			.sort({ createdAt: -1 })
			.skip((page - 1) * limit)
			.limit(limit)
			.lean();

		return {
			messages,
			total,
			limit,
			page,
		};
	} catch (error: any) {
		console.error('Error while getUserBookingRequestsFromDb()', {
			error: error.message,
			stack: error.stack,
			data: { userId, options },
		});
		throw new DBConnectionError('Failed to fetch user booking requests from database');
	}
}

