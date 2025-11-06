import mongoose, { Schema, model } from 'mongoose';
const vendorSchema = new Schema({
    clerkId: {
        type: String,
        required: true,
        unique: true,
    },
    // owner related info-
    ownerName: {
        type: String,
        required: true,
    },
    owner_contactNo: {
        type: [String],
        required: false,
    },
    ownerEmail: {
        type: String,
        required: true,
    },
    ownerImage: {
        type: String,
        default: "https://www.emamiltd.in/wp-content/themes/emami/images/Fair-and-Handsome02-mob-new.jpg"
    },
    owner_address: {
        State: { type: String, required: false },
        City: { type: String, required: false },
        location: { type: String, required: false },
        pinCode: { type: String, required: false },
    },
    ownerAadhar: {
        type: String,
        required: false,
    },
    // Business retaled info------------------------------------
    service_name: {
        type: String,
        required: false,
    },
    service_email: {
        type: String,
        required: false,
    },
    service_phone: {
        type: String,
        required: false,
    },
    service_address: {
        State: { type: String, required: false },
        City: { type: String, required: false },
        location: { type: String, required: false },
        pinCode: { type: String, required: false },
    },
    service_description: {
        type: String,
        required: false,
    },
    establishedYear: {
        type: String,
        required: false,
    },
    service_type: {
        type: String,
        required: false,
    },
    gstNumber: {
        type: String,
        required: false,
    },
    panNumber: {
        type: String,
        required: false,
    },
    //Bank related info-----------------------------------
    bankName: {
        type: String,
        required: false,
    },
    accountNumber: {
        type: String,
        required: false,
    },
    ifscCode: {
        type: String,
        required: false,
    },
    accountHolderName: {
        type: String,
        required: false,
    },
    listings: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Listing',
        },
    ], // Added listings field to schema
    messages: [{ type: Schema.Types.ObjectId, ref: 'MessageData' }],
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
    isVerified: {
        type: Boolean,
        default: false,
    },
});
const Vendor = mongoose.models.Vendor || model('Vendor', vendorSchema);
export default Vendor;
//# sourceMappingURL=vendor.model.js.map