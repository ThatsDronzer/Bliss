import express from 'express';
import { getVendorVerification, submitVendorVerification, } from '../controllers/vendor.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';
const router = express.Router();
// GET /api/vendor-verification - Get vendor verification status
router.get('/', authenticate, getVendorVerification);
// POST /api/vendor-verification - Submit vendor verification
router.post('/', authenticate, submitVendorVerification);
export default router;
//# sourceMappingURL=vendor-verification.routes.js.map