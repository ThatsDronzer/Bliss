import cors from 'cors';
import dotenv from 'dotenv';
import express, { Request, Response } from 'express';
import { initDatabase } from './config/db.js';
import { errorHandler } from './middleware/error.middleware.js';
import adminRoutes from './routes/admin.routes.js';
import bookingRoutes from './routes/booking.routes.js';
import listingRoutes from './routes/listing.routes.js';
import messageRoutes from './routes/message.routes.js';
import notificationRoutes from './routes/notification.routes.js';
import paymentRoutes from './routes/payment.routes.js';
import rentalRoutes from './routes/rental.routes.js';
import reviewRoutes from './routes/review.routes.js';
import reviewsRoutes from './routes/reviews.routes.js';
import searchRoutes from './routes/search.routes.js';
import servicesRoutes from './routes/services.routes.js';
import userRoutes from './routes/user.routes.js';
import vendorRoutes from './routes/vendor.routes.js';
import vendorBookingRoutes from './routes/vendor-booking.routes.js';
import vendorServicesRoutes from './routes/vendor-services.routes.js';
import vendorVerificationRoutes from './routes/vendor-verification.routes.js';
import vendorsRoutes from './routes/vendors.routes.js';
import webhookRoutes from './routes/webhook.routes.js';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 8787;

// CORS Configuration
const corsOptions = {
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cors(corsOptions));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health check endpoint
app.get('/health', (req: Request, res: Response) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    service: 'bliss-backend-api'
  });
});

// API Routes
app.use('/api/user', userRoutes);
app.use('/api/vendor', vendorRoutes);
app.use('/api/vendors', vendorsRoutes);
app.use('/api/listing', listingRoutes);
app.use('/api/review', reviewRoutes);
app.use('/api/reviews', reviewsRoutes);
app.use('/api/booking-status', bookingRoutes);
app.use('/api/message', messageRoutes);
app.use('/api/vendor/booking-requests', vendorBookingRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/search', searchRoutes);
app.use('/api/services', servicesRoutes);
app.use('/api/rental', rentalRoutes);
app.use('/api/notify', notificationRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/vendor-verification', vendorVerificationRoutes);
app.use('/api/vendor-services', vendorServicesRoutes);
app.use('/api/webhooks', webhookRoutes);

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({ 
    error: 'Not Found', 
    message: `Cannot ${req.method} ${req.path}` 
  });
});

// Error handling middleware
app.use(errorHandler);

// Initialize database and start server
async function startServer() {
  try {
    await initDatabase();
    app.listen(PORT, () => {
      console.log(`🚀 Backend server running on port ${PORT}`);
      console.log(`📡 CORS enabled for: ${corsOptions.origin}`);
      console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

startServer();

export default app;

