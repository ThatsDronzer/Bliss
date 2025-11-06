import cors from 'cors';
import dotenv from 'dotenv';
import express, { type Request, type Response } from 'express';
import { initDatabase } from './config/db.js';
import { errorHandler } from './middlewares/error.middleware.js';
// Import other routes - will be migrated gradually
import adminRoutesNew from './routes/admin/admin.router.js';
import bookingRoutesNew from './routes/booking/booking.router.js';
import listingRoutes from './routes/listing/listing.router.js';
import messageRoutesNew from './routes/message/message.router.js';
import notificationRoutesNew from './routes/notification/notification.router.js';
import paymentRoutesNew from './routes/payment/payment.router.js';
import rentalRoutes from './routes/rental.routes.js';
import reviewRoutesNew from './routes/review/review.router.js';
import reviewsRoutesNew from './routes/reviews/reviews.router.js';
import searchRoutesNew from './routes/search/search.router.js';
import servicesRoutesNew from './routes/services/services.router.js';
import userRoutes from './routes/user/user.router.js';
import vendorRoutesNew from './routes/vendor/vendor.router.js';
import vendorBookingRoutesNew from './routes/vendor-booking/vendor-booking.router.js';
import vendorServicesRoutesNew from './routes/vendor-services/vendor-services.router.js';
import vendorVerificationRoutesNew from './routes/vendor-verification/vendor-verification.router.js';
import vendorsRoutesNew from './routes/vendors/vendors.router.js';
import webhookRoutesNew from './routes/webhook/webhook.router.js';

// Load environment variables
dotenv.config();

const app: express.Application = express();
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
app.get('/health', (_req: Request, res: Response) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    service: 'bliss-backend-api'
  });
});

// API Routes
app.use('/api/user', userRoutes);
app.use('/api/listing', listingRoutes);
app.use('/api/vendor', vendorRoutesNew);
app.use('/api/booking-status', bookingRoutesNew);
app.use('/api/payments', paymentRoutesNew);
app.use('/api/review', reviewRoutesNew);
app.use('/api/reviews', reviewsRoutesNew);
app.use('/api/message', messageRoutesNew);
app.use('/api/vendor/booking-requests', vendorBookingRoutesNew);
app.use('/api/admin', adminRoutesNew);
app.use('/api/search', searchRoutesNew);
app.use('/api/notify', notificationRoutesNew);
app.use('/api/webhooks', webhookRoutesNew);
app.use('/api/vendors', vendorsRoutesNew);
app.use('/api/services', servicesRoutesNew);
app.use('/api/vendor-verification', vendorVerificationRoutesNew);
app.use('/api/vendor-services', vendorServicesRoutesNew);
// Legacy routes (to be migrated)
app.use('/api/rental', rentalRoutes);

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

