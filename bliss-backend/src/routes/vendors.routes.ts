import express from 'express';
import { getVendorById, getVendorServices } from '../controllers/vendor.controller.js';

const router = express.Router();

// GET /api/vendors/:id/services - Get vendor services
router.get('/:id/services', getVendorServices);

// GET /api/vendors/:id - Get vendor by MongoDB ID with listings
router.get('/:id', getVendorById);

export default router;

