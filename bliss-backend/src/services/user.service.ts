import User from '../models/user.js';
import Vendor from '../models/vendor.js';
import dbConnect from '../utils/dbConnect.js';

export class UserService {
  /**
   * Get user by Clerk ID
   */
  async getUserByClerkId(clerkId: string) {
    await dbConnect();
    const user = await User.findOne({ clerkId }).lean();
    return user;
  }

  /**
   * Create or update user
   */
  async createOrUpdateUser(clerkId: string, userData: any, role: string = 'user') {
    await dbConnect();

    if (role === 'vendor') {
      const existingVendor = await Vendor.findOne({ clerkId });
      
      if (existingVendor) {
        return { user: existingVendor, isNew: false };
      }

      const newVendor = await Vendor.create({
        clerkId,
        ownerName: userData.name || 'Vendor',
        ownerEmail: userData.email || 'vendor@example.com',
      });

      return { user: newVendor, isNew: true };
    } else {
      const existingUser = await User.findOne({ clerkId });
      
      if (existingUser) {
        return { user: existingUser, isNew: false };
      }

      const newUser = await User.create({
        clerkId,
        name: userData.name || 'User',
        email: userData.email || 'user@example.com',
        coins: 0,
        userVerified: false,
      });

      return { user: newUser, isNew: true };
    }
  }

  /**
   * Update user
   */
  async updateUser(clerkId: string, updateData: any) {
    await dbConnect();

    const updateFields: any = {};
    
    if (updateData.name) updateFields.name = updateData.name;
    if (updateData.phone) updateFields.phone = updateData.phone;

    if (updateData.address) {
      updateFields.address = {
        houseNo: updateData.address.houseNo || '',
        areaName: updateData.address.areaName || '',
        landmark: updateData.address.landmark || '',
        postOffice: updateData.address.postOffice || '',
        state: updateData.address.state || '',
        pin: updateData.address.pin || '',
      };
    }

    const updatedUser = await User.findOneAndUpdate(
      { clerkId },
      { $set: updateFields },
      { new: true }
    );

    return updatedUser;
  }
}

