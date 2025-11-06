import { BaseException } from '../exceptions/core.exceptions.js';
import { sendErrorResponse } from '../utils/Response.utils.js';
export const errorHandler = (err, req, res, next) => {
    if (err instanceof BaseException) {
        return sendErrorResponse(res, err, err.statusCode);
    }
    // Log error in development
    if (process.env.NODE_ENV === 'development') {
        console.error('Error:', {
            message: err.message,
            stack: err.stack,
            path: req.path,
            method: req.method,
        });
    }
    return sendErrorResponse(res, err, 500);
};
export default errorHandler;
//# sourceMappingURL=error.middleware.js.map