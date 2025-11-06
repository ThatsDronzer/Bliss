import type { IAdminService } from './admin.service.interface.js';
export declare class AdminService implements IAdminService {
    getAdminPayments(): Promise<any>;
    processAdvancePayment(paymentId: string): Promise<any>;
    processFullPayment(paymentId: string): Promise<any>;
}
//# sourceMappingURL=admin.service.d.ts.map