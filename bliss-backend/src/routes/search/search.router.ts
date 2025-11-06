import express, { Router } from 'express';
import {
	searchVendors,
	getServiceById,
} from '@controllers/search/search.controller';

const router: Router = express.Router();

router.get('/vendors', searchVendors);
router.get('/services/:serviceId', getServiceById);

export default router;

