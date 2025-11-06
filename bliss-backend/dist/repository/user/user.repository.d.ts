import type { IUser, ICreateUserInput, IUpdateUserInput } from '@models/user/user.model';
export declare function getUserByClerkIdFromDb(clerkId: string): Promise<IUser | null>;
export declare function createUserInDb(data: ICreateUserInput): Promise<IUser>;
export declare function createOrUpdateUserInDb(clerkId: string, userData: any, role?: string): Promise<{
    user: IUser | any;
    isNew: boolean;
}>;
export declare function updateUserInDb(clerkId: string, data: IUpdateUserInput): Promise<IUser | null>;
//# sourceMappingURL=user.repository.d.ts.map