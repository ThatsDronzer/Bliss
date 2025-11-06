import type { IMessageData, ICreateMessageInput, IUpdateMessageInput } from '@models/message/message.model';

export interface IMessageService {
	createBookingMessage(bookingData: any): Promise<any>;
	getVendorBookingRequests(userId: string, options: any): Promise<any>;
	updateVendorBookingRequestStatus(userId: string, requestId: string, status: 'accepted' | 'not-accepted'): Promise<any>;
	getUserBookingRequests(userId: string, options: any): Promise<any>;
}

