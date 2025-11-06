export declare class AdminService {
    /**
     * Get all admin payments
     */
    getAdminPayments(): Promise<{
        success: boolean;
        data: {
            _id: any;
            paymentId: any;
            user: any;
            vendor: any;
            amount: any;
            advanceAmount: any;
            advancePaid: any;
            advancePaidAt: any;
            bookingDate: any;
            bookingTime: any;
            service: any;
            createdAt: any;
        }[];
        count: number;
    }>;
    /**
     * Process advance payment
     */
    processAdvancePayment(paymentId: string): Promise<{
        success: boolean;
        message: string;
        bookingId: any;
        advanceAmount: any;
    }>;
}
//# sourceMappingURL=admin.service.d.ts.map