import type { IBookingService } from './booking.service.interface.js';
import {
	getBookingStatusFromDb,
	cancelBookingFromDb,
	createBookingMessageInDb,
	getVendorBookingRequestsFromDb,
	updateVendorBookingRequestStatusFromDb,
} from '@repository/message/message.repository';
import { DBConnectionError } from '@exceptions/core.exceptions';
import { FETCH_BOOKING_ERROR, CREATE_BOOKING_ERROR, UPDATE_BOOKING_ERROR } from '@exceptions/errors';

export class BookingService implements IBookingService {
	async getBookingStatus(userId: string, serviceId: string): Promise<any> {
		try {
			return await getBookingStatusFromDb(userId, serviceId);
		} catch (error) {
			if (error instanceof DBConnectionError) throw error;
			throw new Error(FETCH_BOOKING_ERROR.message);
		}
	}

	async cancelBooking(userId: string, requestId: string): Promise<any> {
		try {
			return await cancelBookingFromDb(userId, requestId);
		} catch (error) {
			if (error instanceof DBConnectionError) throw error;
			throw new Error(UPDATE_BOOKING_ERROR.message);
		}
	}

	async createBookingMessage(bookingData: any): Promise<any> {
		try {
			return await createBookingMessageInDb(bookingData);
		} catch (error) {
			if (error instanceof DBConnectionError) throw error;
			throw new Error(CREATE_BOOKING_ERROR.message);
		}
	}

	async getVendorBookingRequests(userId: string, options: any): Promise<any> {
		try {
			const result = await getVendorBookingRequestsFromDb(userId, options);
			// Transform messages similar to existing service
			const transformedMessages = result.messages.map((message: any) => ({
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
					selectedItems: message.bookingDetails.selectedItems.map((item: any) => ({
						name: item.name,
						description: item.description,
						price: item.price,
						image: item.image,
					})),
					totalPrice: message.bookingDetails.totalPrice,
					bookingDate: message.bookingDetails.bookingDate.toISOString(),
					bookingTime: message.bookingDetails.bookingTime,
					address:
						message.bookingDetails.status === 'accepted'
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
					total: result.total,
					pages: Math.ceil(result.total / result.limit),
					currentPage: result.page,
					perPage: result.limit,
				},
			};
		} catch (error) {
			if (error instanceof DBConnectionError) throw error;
			throw new Error(FETCH_BOOKING_ERROR.message);
		}
	}

	async updateVendorBookingRequestStatus(userId: string, requestId: string, status: 'accepted' | 'not-accepted'): Promise<any> {
		try {
			const updatedMessage = await updateVendorBookingRequestStatusFromDb(userId, requestId, status);
			const msg = updatedMessage as any;

			return {
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
					selectedItems: msg.bookingDetails.selectedItems.map((item: any) => ({
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
		} catch (error) {
			if (error instanceof DBConnectionError) throw error;
			throw new Error(UPDATE_BOOKING_ERROR.message);
		}
	}
}

