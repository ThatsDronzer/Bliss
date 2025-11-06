import { getUserByClerkIdFromDb, createOrUpdateUserInDb, updateUserInDb } from '@repository/user/user.repository';
import { DBConnectionError } from '@exceptions/core.exceptions';
import { FETCH_USER_ERROR, CREATE_USER_ERROR, UPDATE_USER_ERROR } from '@exceptions/errors';
export class UserService {
    async getUserByClerkId(clerkId) {
        try {
            return await getUserByClerkIdFromDb(clerkId);
        }
        catch (error) {
            if (error instanceof DBConnectionError)
                throw error;
            throw new Error(FETCH_USER_ERROR.message);
        }
    }
    async createOrUpdateUser(clerkId, userData, role = 'user') {
        try {
            return await createOrUpdateUserInDb(clerkId, userData, role);
        }
        catch (error) {
            if (error instanceof DBConnectionError)
                throw error;
            throw new Error(CREATE_USER_ERROR.message);
        }
    }
    async updateUser(clerkId, updateData) {
        try {
            return await updateUserInDb(clerkId, updateData);
        }
        catch (error) {
            if (error instanceof DBConnectionError)
                throw error;
            throw new Error(UPDATE_USER_ERROR.message);
        }
    }
}
//# sourceMappingURL=user.service.js.map