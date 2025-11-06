import { Request, Response, NextFunction } from 'express';
import { BaseException } from '../exceptions/core.exceptions.js';
export declare const errorHandler: (err: BaseException | Error, req: Request, res: Response, next: NextFunction) => Response<any, Record<string, any>>;
export default errorHandler;
//# sourceMappingURL=error.middleware.d.ts.map