import express from 'express';
import {
  getVendorListings,
  createListing,
  updateListing,
  deleteListing,
  getListingById,
  toggleListingStatus,
  addImages,
  getListingReviews,
} from '../controllers/listing.controller.js';
import { authenticate, requireRole } from '../middleware/auth.middleware.js';

const router = express.Router();

// GET /api/listing - Get all listings for authenticated vendor
router.get('/', authenticate, getVendorListings);

// POST /api/listing - Create new listing (requires vendor role)
router.post('/', authenticate, requireRole('vendor'), createListing);

// PUT /api/listing - Update listing (requires vendor role)
router.put('/', authenticate, requireRole('vendor'), updateListing);

// DELETE /api/listing - Delete listing (requires vendor role)
router.delete('/', authenticate, requireRole('vendor'), deleteListing);

// GET /api/listing/:id - Get listing by ID (authenticated vendor only)
router.get('/:id', authenticate, getListingById);

// PATCH /api/listing/:id/status - Toggle listing status (requires vendor role)
router.patch('/:id/status', authenticate, requireRole('vendor'), toggleListingStatus);

// PATCH /api/listing/add-images - Add images to listing (requires vendor role)
router.patch('/add-images', authenticate, requireRole('vendor'), addImages);

// GET /api/listing/reviews - Get listing reviews
router.get('/reviews', authenticate, getListingReviews);

export default router;

