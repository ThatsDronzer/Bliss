import { createPaymentOrderInDb, verifyPaymentInDb, getPaymentByIdFromDb, } from '@repository/payment/payment.repository';
import { DBConnectionError } from '@exceptions/core.exceptions';
import { CREATE_PAYMENT_ERROR, FETCH_PAYMENT_ERROR } from '@exceptions/errors';
export class PaymentService {
    async createPaymentOrder(messageId) {
        try {
            return await createPaymentOrderInDb(messageId);
        }
        catch (error) {
            if (error instanceof DBConnectionError)
                throw error;
            throw new Error(CREATE_PAYMENT_ERROR.message);
        }
    }
    async verifyPayment(verificationData) {
        try {
            return await verifyPaymentInDb(verificationData);
        }
        catch (error) {
            if (error instanceof DBConnectionError)
                throw error;
            throw new Error(CREATE_PAYMENT_ERROR.message);
        }
    }
    async getPaymentById(paymentId) {
        try {
            return await getPaymentByIdFromDb(paymentId);
        }
        catch (error) {
            if (error instanceof DBConnectionError)
                throw error;
            throw new Error(FETCH_PAYMENT_ERROR.message);
        }
    }
}
//# sourceMappingURL=payment.service.js.map