import express, { Router } from 'express';
import {
	getVendorById,
	getVendorServices,
} from '@controllers/vendor/vendor.controller';

const router: Router = express.Router();

router.get('/:id/services', getVendorServices);
router.get('/:id', getVendorById);

export default router;

