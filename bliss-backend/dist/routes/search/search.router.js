import express from 'express';
import { searchVendors, getServiceById, } from '@controllers/search/search.controller';
const router = express.Router();
router.get('/vendors', searchVendors);
router.get('/services/:serviceId', getServiceById);
export default router;
//# sourceMappingURL=search.router.js.map