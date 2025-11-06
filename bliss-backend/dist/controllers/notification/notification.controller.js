import { NotificationService } from '@services/notification/notification.service';
import { BadRequestError } from '@exceptions/core.exceptions';
import { sendSuccessResponse } from '@utils/Response.utils';
const notificationService = new NotificationService();
export async function notifyCustomer(req, res, next) {
    try {
        const { requestId, customerPhone, vendorName, status, customerName } = req.body;
        if (!requestId || !customerPhone || !vendorName || !status) {
            throw new BadRequestError('Missing required fields: requestId, customerPhone, vendorName, status');
        }
        const result = await notificationService.notifyCustomer({
            requestId,
            customerPhone,
            vendorName,
            status,
            customerName,
        });
        return sendSuccessResponse(res, {
            result,
        });
    }
    catch (error) {
        if (error instanceof Error) {
            if (error.message.includes('Missing required fields')) {
                return next(new BadRequestError(error.message));
            }
            if (error.message.includes('Twilio not configured')) {
                return next(new BadRequestError(error.message));
            }
        }
        next(error);
    }
}
export async function notifyVendor(req, res, next) {
    try {
        const { customerName, requestId } = req.body;
        if (!customerName || !requestId) {
            throw new BadRequestError('Missing required fields: customerName, requestId');
        }
        const result = await notificationService.notifyVendor({
            customerName,
            requestId,
        });
        return sendSuccessResponse(res, {
            sid: result.sid,
        });
    }
    catch (error) {
        if (error instanceof Error) {
            if (error.message.includes('Missing required fields')) {
                return next(new BadRequestError(error.message));
            }
            if (error.message.includes('not configured')) {
                return next(new BadRequestError(error.message));
            }
        }
        next(error);
    }
}
//# sourceMappingURL=notification.controller.js.map