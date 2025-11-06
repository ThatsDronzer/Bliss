import mongoose, { Schema, model } from 'mongoose';
const userSchema = new Schema({
    clerkId: {
        type: String,
        required: true,
        unique: true,
    },
    name: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
    },
    phone: {
        type: String,
        required: false,
    },
    // role: {
    //   type: String,
    //   enum: ['user', 'vendor', 'admin'],
    //   default: 'user',
    // },
    coins: {
        type: Number,
        default: 0,
    },
    referralCode: {
        type: String,
        // unique: true,
        default: "NoT",
    },
    referredBy: {
        type: String,
        default: "Nada",
    },
    userVerified: {
        type: Boolean,
        default: false,
    },
    address: {
        houseNo: { type: String, required: false, trim: true, default: "" },
        areaName: { type: String, required: false, trim: true, default: "" },
        landmark: { type: String, required: false, trim: true, default: "" },
        postOffice: { type: String, required: false, trim: true, default: "" },
        state: { type: String, required: false, trim: true, default: "" },
        pin: { type: String, required: false, trim: true, default: "" }
    },
    messages: [{ type: Schema.Types.ObjectId, ref: 'MessageData' }],
}, { timestamps: true });
const User = mongoose.models?.User || model('User', userSchema);
export default User;
//# sourceMappingURL=user.js.map