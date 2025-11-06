import { clerkClient } from '@clerk/clerk-sdk-node';
import { NextFunction, Request, Response } from 'express';

declare global {
	namespace Express {
		interface Request {
			userId?: string;
			userRole?: string;
			user?: any;
		}
	}
}

export interface AuthRequest extends Request {
	userId: string;
	userRole: string;
	user: any;
}

export const authenticate = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const authHeader = req.headers.authorization;

		if (!authHeader || !authHeader.startsWith('Bearer ')) {
			return res.status(401).json({ error: 'Unauthorized', message: 'No token provided' });
		}

		const token = authHeader.replace('Bearer ', '');

		try {
			const session = await clerkClient.verifyToken(token);

			req.userId = session.sub;
			req.user = session;
			req.userRole = ((session as any).metadata?.role as string) || 'user';

			next();
		} catch (tokenError) {
			return res.status(401).json({ 
				error: 'Unauthorized', 
				message: 'Invalid or expired token' 
			});
		}
	} catch (error) {
		console.error('Authentication error:', error);
		return res.status(500).json({ 
			error: 'Authentication failed', 
			message: 'Internal server error during authentication' 
		});
	}
};

export const requireRole = (...allowedRoles: string[]) => {
	return (req: Request, res: Response, next: NextFunction) => {
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

export const optionalAuth = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const authHeader = req.headers.authorization;

		if (authHeader && authHeader.startsWith('Bearer ')) {
			const token = authHeader.replace('Bearer ', '');

			try {
				const session = await clerkClient.verifyToken(token);
				req.userId = session.sub;
				req.user = session;
				req.userRole = ((session as any).metadata?.role as string) || 'user';
			} catch (tokenError) {
				// Token invalid, continue without authentication
			}
		}

		next();
	} catch (error) {
		next();
	}
};

