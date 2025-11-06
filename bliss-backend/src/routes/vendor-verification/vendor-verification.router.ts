import express, { Router } from 'express';
import {
	getVendorVerification,
	submitVendorVerification,
} from '@controllers/vendor/vendor.controller';
import { authenticate } from '../../middlewares/auth.middleware.js';

const router: Router = express.Router();

router.get('/', authenticate, getVendorVerification);
router.post('/', authenticate, submitVendorVerification);

export default router;

