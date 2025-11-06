import express from 'express';
import { getServiceById, } from '@controllers/search/search.controller';
const router = express.Router();
router.get('/:serviceId', getServiceById);
export default router;
//# sourceMappingURL=services.router.js.map