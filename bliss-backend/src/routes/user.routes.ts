import express from 'express';
import {
  getUserById,
  createUser,
  updateUser,
  getUserBookingRequests,
} from '../controllers/user.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';

const router = express.Router();

// GET /api/user/:id - Get user by Clerk ID
router.get('/:id', getUserById);

// PUT /api/user/:id - Update user
router.put('/:id', authenticate, updateUser);

// POST /api/user/create - Create or update user (requires auth)
router.post('/create', authenticate, createUser);

// GET /api/user/booking-requests - Get user's booking requests (requires auth)
router.get('/booking-requests', authenticate, getUserBookingRequests);

export default router;

