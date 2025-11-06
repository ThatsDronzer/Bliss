export declare function notifyCustomerInDb(notificationData: {
    requestId: string;
    customerPhone: string;
    vendorName: string;
    status: string;
    customerName?: string;
}): Promise<any>;
export declare function notifyVendorInDb(notificationData: {
    customerName: string;
    requestId: string;
}): Promise<any>;
//# sourceMappingURL=notification.repository.d.ts.map