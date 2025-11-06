import { AdminService } from '@services/admin/admin.service';
import { BadRequestError, NotFoundError } from '@exceptions/core.exceptions';
import { sendSuccessResponse } from '@utils/Response.utils';
const adminService = new AdminService();
export async function getAdminPayments(req, res, next) {
    try {
        const result = await adminService.getAdminPayments();
        return sendSuccessResponse(res, result);
    }
    catch (error) {
        next(error);
    }
}
export async function processAdvancePayment(req, res, next) {
    try {
        const { paymentId } = req.body;
        if (!paymentId) {
            throw new BadRequestError('Payment ID is required');
        }
        const result = await adminService.processAdvancePayment(paymentId);
        return sendSuccessResponse(res, result);
    }
    catch (error) {
        if (error instanceof Error) {
            if (error.message === 'Payment ID is required') {
                return next(new BadRequestError(error.message));
            }
            if (error.message === 'Payment not found') {
                return next(new NotFoundError(error.message));
            }
            if (error.message === 'Message not found') {
                return next(new NotFoundError(error.message));
            }
            if (error.message.includes('already processed')) {
                return next(new BadRequestError(error.message));
            }
        }
        next(error);
    }
}
export async function processFullPayment(req, res, next) {
    try {
        const { paymentId } = req.body;
        if (!paymentId) {
            throw new BadRequestError('Payment ID is required');
        }
        const result = await adminService.processFullPayment(paymentId);
        return sendSuccessResponse(res, result);
    }
    catch (error) {
        if (error instanceof Error) {
            if (error.message === 'Payment ID is required') {
                return next(new BadRequestError(error.message));
            }
            if (error.message === 'Payment not found') {
                return next(new NotFoundError(error.message));
            }
            if (error.message.includes('already processed')) {
                return next(new BadRequestError(error.message));
            }
        }
        next(error);
    }
}
//# sourceMappingURL=admin.controller.js.map