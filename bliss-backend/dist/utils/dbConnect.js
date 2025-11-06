import dotenv from 'dotenv';
import mongoose from 'mongoose';
// Load environment variables before checking for MONGODB_URI
dotenv.config();
if (!process.env.MONGODB_URI) {
    throw new Error('Please define the MONGODB_URI environment variable inside .env');
}
const MONGODB_URI = process.env.MONGODB_URI;
/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections growing exponentially
 * during API usage.
 */
let globalWithMongoose = global;
if (!globalWithMongoose.mongoose) {
    globalWithMongoose.mongoose = {
        conn: null,
        promise: null,
    };
}
async function dbConnect() {
    if (globalWithMongoose.mongoose.conn) {
        return globalWithMongoose.mongoose.conn;
    }
    if (!globalWithMongoose.mongoose.promise) {
        const opts = {
            bufferCommands: false,
        };
        globalWithMongoose.mongoose.promise = mongoose.connect(MONGODB_URI, opts)
            .then((mongoose) => mongoose);
    }
    try {
        globalWithMongoose.mongoose.conn = await globalWithMongoose.mongoose.promise;
    }
    catch (e) {
        globalWithMongoose.mongoose.promise = null;
        throw e;
    }
    return globalWithMongoose.mongoose.conn;
}
export default dbConnect;
//# sourceMappingURL=dbConnect.js.map