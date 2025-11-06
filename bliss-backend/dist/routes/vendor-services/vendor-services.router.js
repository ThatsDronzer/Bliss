import express from 'express';
import { getVendorServicesForExplore, } from '@controllers/vendor/vendor.controller';
const router = express.Router();
router.get('/', getVendorServicesForExplore);
export default router;
//# sourceMappingURL=vendor-services.router.js.map