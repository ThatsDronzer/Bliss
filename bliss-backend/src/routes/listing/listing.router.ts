import express, { Router } from 'express';
import {
	getVendorListings,
	createListing,
	updateListing,
	deleteListing,
	getListingById,
	toggleListingStatus,
	addImages,
	getListingReviews,
} from '@controllers/listing/listing.controller';
import { authenticate, requireRole } from '../../middlewares/auth.middleware.js';

const router: Router = express.Router();

router.get('/', authenticate, getVendorListings);
router.post('/', authenticate, requireRole('vendor'), createListing);
router.put('/', authenticate, requireRole('vendor'), updateListing);
router.delete('/', authenticate, requireRole('vendor'), deleteListing);
router.get('/:id', authenticate, getListingById);
router.patch('/:id/status', authenticate, requireRole('vendor'), toggleListingStatus);
router.patch('/add-images', authenticate, requireRole('vendor'), addImages);
router.get('/reviews', authenticate, getListingReviews);

export default router;

