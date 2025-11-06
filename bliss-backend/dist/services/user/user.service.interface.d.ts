import type { IUpdateUserInput, IUser } from '@models/user/user.model';
export interface IUserService {
    getUserByClerkId(clerkId: string): Promise<IUser | null>;
    createOrUpdateUser(clerkId: string, userData: any, role?: string): Promise<{
        user: IUser | any;
        isNew: boolean;
    }>;
    updateUser(clerkId: string, updateData: IUpdateUserInput): Promise<IUser | null>;
}
//# sourceMappingURL=user.service.interface.d.ts.map