import type { IUserService } from './user.service.interface.js';
import type { IUser, IUpdateUserInput } from '@models/user/user.model';
import { getUserByClerkIdFromDb, createOrUpdateUserInDb, updateUserInDb } from '@repository/user/user.repository';
import { DBConnectionError } from '@exceptions/core.exceptions';
import { FETCH_USER_ERROR, CREATE_USER_ERROR, UPDATE_USER_ERROR } from '@exceptions/errors';

export class UserService implements IUserService {
	async getUserByClerkId(clerkId: string): Promise<IUser | null> {
		try {
			return await getUserByClerkIdFromDb(clerkId);
		} catch (error) {
			if (error instanceof DBConnectionError) throw error;
			throw new Error(FETCH_USER_ERROR.message);
		}
	}

	async createOrUpdateUser(clerkId: string, userData: any, role: string = 'user'): Promise<{ user: IUser | any; isNew: boolean }> {
		try {
			return await createOrUpdateUserInDb(clerkId, userData, role);
		} catch (error) {
			if (error instanceof DBConnectionError) throw error;
			throw new Error(CREATE_USER_ERROR.message);
		}
	}

	async updateUser(clerkId: string, updateData: IUpdateUserInput): Promise<IUser | null> {
		try {
			return await updateUserInDb(clerkId, updateData);
		} catch (error) {
			if (error instanceof DBConnectionError) throw error;
			throw new Error(UPDATE_USER_ERROR.message);
		}
	}
}

