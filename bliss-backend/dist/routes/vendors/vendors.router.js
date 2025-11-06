import express from 'express';
import { getVendorById, getVendorServices, } from '@controllers/vendor/vendor.controller';
const router = express.Router();
router.get('/:id/services', getVendorServices);
router.get('/:id', getVendorById);
export default router;
//# sourceMappingURL=vendors.router.js.map