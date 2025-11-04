import express from 'express';
import {
  createListingReview,
  deleteListingReview,
} from '../controllers/review.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';

const router = express.Router();

// POST /api/reviews - Create listing review
router.post('/', authenticate, createListingReview);

// DELETE /api/reviews - Delete listing review
router.delete('/', authenticate, deleteListingReview);

export default router;

