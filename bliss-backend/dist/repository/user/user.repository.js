import { DBConnectionError } from '@exceptions/core.exceptions';
import { dbConnect } from '@repository/repository';
import User from '../../infrastructure/db/models/user.model.js';
import Vendor from '../../infrastructure/db/models/vendor.model.js';
export async function getUserByClerkIdFromDb(clerkId) {
    try {
        await dbConnect();
        const user = await User.findOne({ clerkId }).lean();
        return user;
    }
    catch (error) {
        throw new DBConnectionError('Failed to fetch user from database');
    }
}
export async function createUserInDb(data) {
    try {
        await dbConnect();
        const newUser = await User.create({
            clerkId: data.clerkId,
            name: data.name,
            email: data.email,
            phone: data.phone,
            coins: data.coins || 0,
            referralCode: data.referralCode || 'NoT',
            referredBy: data.referredBy || 'Nada',
            userVerified: data.userVerified || false,
            address: data.address,
        });
        return newUser.toObject();
    }
    catch (error) {
        throw new DBConnectionError('Failed to create user in database');
    }
}
export async function createOrUpdateUserInDb(clerkId, userData, role = 'user') {
    try {
        await dbConnect();
        if (role === 'vendor') {
            const existingVendor = await Vendor.findOne({ clerkId }).lean();
            if (existingVendor) {
                return { user: existingVendor, isNew: false };
            }
            const newVendor = await Vendor.create({
                clerkId,
                ownerName: userData.name || 'Vendor',
                ownerEmail: userData.email || 'vendor@example.com',
            });
            return { user: newVendor.toObject(), isNew: true };
        }
        else {
            const existingUser = await User.findOne({ clerkId }).lean();
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
            return { user: newUser.toObject(), isNew: true };
        }
    }
    catch (error) {
        throw new DBConnectionError('Failed to create or update user in database');
    }
}
export async function updateUserInDb(clerkId, data) {
    try {
        await dbConnect();
        const updateFields = {};
        if (data.name)
            updateFields.name = data.name;
        if (data.phone)
            updateFields.phone = data.phone;
        if (data.address) {
            updateFields.address = {
                houseNo: data.address.houseNo || '',
                areaName: data.address.areaName || '',
                landmark: data.address.landmark || '',
                postOffice: data.address.postOffice || '',
                state: data.address.state || '',
                pin: data.address.pin || '',
            };
        }
        const updatedUser = await User.findOneAndUpdate({ clerkId }, { $set: updateFields }, { new: true }).lean();
        return updatedUser;
    }
    catch (error) {
        throw new DBConnectionError('Failed to update user in database');
    }
}
//# sourceMappingURL=user.repository.js.map

// upsert usert in db   

