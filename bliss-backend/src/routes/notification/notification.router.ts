import express, { Router } from 'express';
import {
	notifyCustomer,
	notifyVendor,
} from '@controllers/notification/notification.controller';

const router: Router = express.Router();

router.post('/customer', notifyCustomer);
router.post('/vendor', notifyVendor);

export default router;

