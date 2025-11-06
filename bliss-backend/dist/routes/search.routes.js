import express from 'express';
import { searchVendors } from '../controllers/search.controller.js';
const router = express.Router();
// GET /api/search/vendors - Search vendors by query and location
router.get('/vendors', searchVendors);
export default router;
//# sourceMappingURL=search.routes.js.map