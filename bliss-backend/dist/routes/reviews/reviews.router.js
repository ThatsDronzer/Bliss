import express from 'express';
import { createListingReview, deleteListingReview, } from '@controllers/review/review.controller';
import { authenticate } from '../../middlewares/auth.middleware.js';
const router = express.Router();
router.post('/', authenticate, createListingReview);
router.delete('/', authenticate, deleteListingReview);
export default router;
//# sourceMappingURL=reviews.router.js.map