import express from 'express';
import { getAdminPayments, processAdvancePayment, processFullPayment, } from '@controllers/admin/admin.controller';
import { authenticate, requireRole } from '../../middlewares/auth.middleware.js';
const router = express.Router();
router.get('/payments', authenticate, requireRole('admin'), getAdminPayments);
router.post('/payments/advance', authenticate, requireRole('admin'), processAdvancePayment);
router.post('/payments/full', authenticate, requireRole('admin'), processFullPayment);
export default router;
//# sourceMappingURL=admin.router.js.map