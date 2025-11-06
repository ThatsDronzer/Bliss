import type { IUserService } from '@domain/service/userInterface';
import type { User } from '@domain/interfaces/user';
import { userApi } from '@/lib/api/services';

export class UserService implements IUserService {
  async getUser(id: string): Promise<User> {
    const res = await userApi.getUser(id);
    return res.data;
  }

  async updateUser(id: string, data: Partial<User>): Promise<User> {
    const res = await userApi.updateUser(id, data);
    return res.data;
  }

  async createUser(data: Partial<User>): Promise<User> {
    const res = await userApi.createUser(data);
    return res.data;
  }

  async getUserBookingRequests(): Promise<any> {
    const res = await userApi.getUserBookingRequests?.();
    return res?.data ?? {};
  }
}


