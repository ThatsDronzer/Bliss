import { getAdminPaymentsFromDb, processAdvancePaymentInDb, processFullPaymentInDb, } from '@repository/admin/admin.repository';
import { DBConnectionError } from '@exceptions/core.exceptions';
import { ADMIN_ERROR } from '@exceptions/errors';
export class AdminService {
    async getAdminPayments() {
        try {
            return await getAdminPaymentsFromDb();
        }
        catch (error) {
            if (error instanceof DBConnectionError)
                throw error;
            throw new Error(ADMIN_ERROR.message);
        }
    }
    async processAdvancePayment(paymentId) {
        try {
            return await processAdvancePaymentInDb(paymentId);
        }
        catch (error) {
            if (error instanceof DBConnectionError)
                throw error;
            throw new Error(ADMIN_ERROR.message);
        }
    }
    async processFullPayment(paymentId) {
        try {
            return await processFullPaymentInDb(paymentId);
        }
        catch (error) {
            if (error instanceof DBConnectionError)
                throw error;
            throw new Error(ADMIN_ERROR.message);
        }
    }
}
//# sourceMappingURL=admin.service.js.map