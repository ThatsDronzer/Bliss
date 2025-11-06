import express, { Router } from 'express';
import {
	createReview,
	getReviews,
	deleteReview,
} from '@controllers/review/review.controller';
import { authenticate } from '../../middlewares/auth.middleware.js';

const router: Router = express.Router();

router.post('/', authenticate, createReview);
router.get('/', getReviews);
router.delete('/', authenticate, deleteReview);

export default router;

