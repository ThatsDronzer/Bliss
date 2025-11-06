import type { IMessageService } from './message.service.interface.js';
export declare class MessageService implements IMessageService {
    createBookingMessage(bookingData: any): Promise<any>;
    getVendorBookingRequests(userId: string, options: any): Promise<any>;
    updateVendorBookingRequestStatus(userId: string, requestId: string, status: 'accepted' | 'not-accepted'): Promise<any>;
    getUserBookingRequests(userId: string, options: any): Promise<any>;
}
//# sourceMappingURL=message.service.d.ts.map