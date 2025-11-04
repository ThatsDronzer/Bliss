import dbConnect from '../utils/dbConnect.js';

/**
 * Database configuration and initialization
 */
export async function initDatabase() {
  try {
    await dbConnect();
    console.log('✅ Database initialized successfully');
  } catch (error) {
    console.error('❌ Database initialization failed:', error);
    throw error;
  }
}

export default dbConnect;

