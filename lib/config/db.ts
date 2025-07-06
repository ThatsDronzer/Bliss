import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();
const MONGODB_URI = process.env.MONGODB_URI!;

const connectDB = async () => {
  try {
    await mongoose.connect(MONGODB_URI,{
      dbName:'bliss app',
    })
    console.log('MongoDB connected');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

export default connectDB;
