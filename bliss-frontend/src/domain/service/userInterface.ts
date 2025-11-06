import type { User } from '@domain/interfaces/user';

export interface IUserService {
  getUser(id: string): Promise<User>;
  updateUser(id: string, data: Partial<User>): Promise<User>;
  createUser(data: Partial<User>): Promise<User>;
  getUserBookingRequests(): Promise<any>;
}


