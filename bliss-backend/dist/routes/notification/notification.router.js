import express from 'express';
import { notifyCustomer, notifyVendor, } from '@controllers/notification/notification.controller';
const router = express.Router();
router.post('/customer', notifyCustomer);
router.post('/vendor', notifyVendor);
export default router;
//# sourceMappingURL=notification.router.js.map