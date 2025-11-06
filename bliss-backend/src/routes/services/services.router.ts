import express, { Router } from 'express';
import {
	getServiceById,
} from '@controllers/search/search.controller';

const router: Router = express.Router();

router.get('/:serviceId', getServiceById);

export default router;

