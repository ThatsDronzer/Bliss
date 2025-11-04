import express from 'express';
import {
  createReview,
  getReviews,
  deleteReview,
  createListingReview,
  deleteListingReview,
} from '../controllers/review.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';

const router = express.Router();

// POST /api/review - Create review (for service or vendor)
router.post('/', authenticate, createReview);

// GET /api/review - Get reviews by target
router.get('/', getReviews);

// DELETE /api/review - Delete review
router.delete('/', authenticate, deleteReview);

export default router;

