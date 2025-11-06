export declare class UserService {
    /**
     * Get user by Clerk ID
     */
    getUserByClerkId(clerkId: string): Promise<(import("mongoose").FlattenMaps<any> & Required<{
        _id: unknown;
    }> & {
        __v: number;
    })[] | (import("mongoose").FlattenMaps<any> & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }) | null>;
    /**
     * Create or update user
     */
    createOrUpdateUser(clerkId: string, userData: any, role?: string): Promise<{
        user: any;
        isNew: boolean;
    }>;
    /**
     * Update user
     */
    updateUser(clerkId: string, updateData: any): Promise<any>;
}
//# sourceMappingURL=user.service.d.ts.map