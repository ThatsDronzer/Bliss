import express from 'express';
import { getVendorServicesForExplore } from '../controllers/vendor.controller.js';
const router = express.Router();
// GET /api/vendor-services - Get vendor services for explore services page
router.get('/', getVendorServicesForExplore);
export default router;
//# sourceMappingURL=vendor-services.routes.js.map