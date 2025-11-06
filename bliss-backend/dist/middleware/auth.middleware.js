import { clerkClient } from '@clerk/clerk-sdk-node';
/**
 * Middleware to authenticate requests using Clerk
 */
export const authenticate = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ error: 'Unauthorized', message: 'No token provided' });
        }
        const token = authHeader.replace('Bearer ', '');
        try {
            // Verify the token with Clerk
            const session = await clerkClient.verifyToken(token);
            // Attach user info to request
            req.userId = session.sub;
            req.user = session;
            // Get user role from metadata
            req.userRole = session.metadata?.role || 'user';
            next();
        }
        catch (tokenError) {
            return res.status(401).json({
                error: 'Unauthorized',
                message: 'Invalid or expired token'
            });
        }
    }
    catch (error) {
        console.error('Authentication error:', error);
        return res.status(500).json({
            error: 'Authentication failed',
            message: 'Internal server error during authentication'
        });
    }
};
/**
 * Middleware to check if user has required role
 */
export const requireRole = (...allowedRoles) => {
    return (req, res, next) => {
        if (!req.userRole) {
            return res.status(401).json({
                error: 'Unauthorized',
                message: 'User role not found'
            });
        }
        if (!allowedRoles.includes(req.userRole)) {
            return res.status(403).json({
                error: 'Forbidden',
                message: `Access denied. Required role: ${allowedRoles.join(' or ')}`
            });
        }
        next();
    };
};
/**
 * Optional authentication - doesn't fail if no token, but attaches user if token is valid
 */
export const optionalAuth = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (authHeader && authHeader.startsWith('Bearer ')) {
            const token = authHeader.replace('Bearer ', '');
            try {
                const session = await clerkClient.verifyToken(token);
                req.userId = session.sub;
                req.user = session;
                req.userRole = session.metadata?.role || 'user';
            }
            catch (tokenError) {
                // Token invalid, continue without authentication
            }
        }
        next();
    }
    catch (error) {
        // Continue without authentication on error
        next();
    }
};
//# sourceMappingURL=auth.middleware.js.map