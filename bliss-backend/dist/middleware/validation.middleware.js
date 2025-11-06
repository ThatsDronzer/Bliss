import { ZodError } from 'zod';
/**
 * Middleware factory to validate request body with Zod schema
 */
export const validateBody = (schema) => {
    return (req, res, next) => {
        try {
            schema.parse(req.body);
            next();
        }
        catch (error) {
            if (error instanceof ZodError) {
                const errors = error.errors.map((err) => ({
                    path: err.path.join('.'),
                    message: err.message,
                }));
                return res.status(400).json({
                    error: 'Validation Error',
                    message: 'Invalid request data',
                    errors,
                });
            }
            next(error);
        }
    };
};
/**
 * Middleware factory to validate request query parameters with Zod schema
 */
export const validateQuery = (schema) => {
    return (req, res, next) => {
        try {
            schema.parse(req.query);
            next();
        }
        catch (error) {
            if (error instanceof ZodError) {
                const errors = error.errors.map((err) => ({
                    path: err.path.join('.'),
                    message: err.message,
                }));
                return res.status(400).json({
                    error: 'Validation Error',
                    message: 'Invalid query parameters',
                    errors,
                });
            }
            next(error);
        }
    };
};
/**
 * Middleware factory to validate request params with Zod schema
 */
export const validateParams = (schema) => {
    return (req, res, next) => {
        try {
            schema.parse(req.params);
            next();
        }
        catch (error) {
            if (error instanceof ZodError) {
                const errors = error.errors.map((err) => ({
                    path: err.path.join('.'),
                    message: err.message,
                }));
                return res.status(400).json({
                    error: 'Validation Error',
                    message: 'Invalid URL parameters',
                    errors,
                });
            }
            next(error);
        }
    };
};
//# sourceMappingURL=validation.middleware.js.map