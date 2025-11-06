import type { IUserService } from './user.service.interface.js';
import type { IUser, IUpdateUserInput } from '@models/user/user.model';
export declare class UserService implements IUserService {
    getUserByClerkId(clerkId: string): Promise<IUser | null>;
    createOrUpdateUser(clerkId: string, userData: any, role?: string): Promise<{
        user: IUser | any;
        isNew: boolean;
    }>;
    updateUser(clerkId: string, updateData: IUpdateUserInput): Promise<IUser | null>;
}
//# sourceMappingURL=user.service.d.ts.map