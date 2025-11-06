import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
/**
 * Middleware factory to validate request body with Zod schema
 */
export declare const validateBody: (schema: z.ZodSchema) => (req: Request, res: Response, next: NextFunction) => Response<any, Record<string, any>> | undefined;
/**
 * Middleware factory to validate request query parameters with Zod schema
 */
export declare const validateQuery: (schema: z.ZodSchema) => (req: Request, res: Response, next: NextFunction) => Response<any, Record<string, any>> | undefined;
/**
 * Middleware factory to validate request params with Zod schema
 */
export declare const validateParams: (schema: z.ZodSchema) => (req: Request, res: Response, next: NextFunction) => Response<any, Record<string, any>> | undefined;
//# sourceMappingURL=validation.middleware.d.ts.map