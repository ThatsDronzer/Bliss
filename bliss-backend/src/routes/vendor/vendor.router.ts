import {
	getVendorByClerkId, getVendorServices, getVendorVerification,
	submitVendorVerification,
	updateVendorByClerkId
} from '@controllers/vendor/vendor.controller';
import express, { Router } from 'express';
import { authenticate } from '../../middlewares/auth.middleware.js';

const router: Router = express.Router();

router.get('/:id', getVendorByClerkId);
router.put('/:id', authenticate, updateVendorByClerkId);
router.get('/:id/services', getVendorServices);
router.get('/verification', authenticate, getVendorVerification);
router.post('/verification', authenticate, submitVendorVerification);

export default router;

