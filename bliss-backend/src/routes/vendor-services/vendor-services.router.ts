import express, { Router } from 'express';
import {
	getVendorServicesForExplore,
} from '@controllers/vendor/vendor.controller';

const router: Router = express.Router();

router.get('/', getVendorServicesForExplore);

export default router;

