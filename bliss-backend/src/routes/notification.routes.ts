import express from 'express';
import { notifyCustomer, notifyVendor } from '../controllers/notification.controller.js';

const router = express.Router();

// POST /api/notify/customer - Send customer notification
router.post('/customer', notifyCustomer);

// POST /api/notify/vendor - Send vendor notification
router.post('/vendor', notifyVendor);

export default router;

