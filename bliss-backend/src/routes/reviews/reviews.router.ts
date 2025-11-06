import express, { Router } from 'express';
import {
	createListingReview,
	deleteListingReview,
} from '@controllers/review/review.controller';
import { authenticate } from '../../middlewares/auth.middleware.js';

const router: Router = express.Router();

router.post('/', authenticate, createListingReview);
router.delete('/', authenticate, deleteListingReview);

export default router;

