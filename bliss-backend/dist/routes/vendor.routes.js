import express from 'express';
import { getVendorByClerkId, updateVendorByClerkId, } from '../controllers/vendor.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';
const router = express.Router();
// GET /api/vendor/:id - Get vendor by Clerk ID
router.get('/:id', getVendorByClerkId);
// PUT /api/vendor/:id - Update vendor by Clerk ID (authenticated)
router.put('/:id', authenticate, updateVendorByClerkId);
export default router;
//# sourceMappingURL=vendor.routes.js.map