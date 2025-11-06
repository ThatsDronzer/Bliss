import express from 'express';
import { getAdminPayments, processAdvancePayment, } from '../controllers/admin.controller.js';
import { authenticate, requireRole } from '../middleware/auth.middleware.js';
const router = express.Router();
// GET /api/admin/payments - Get all admin payments
router.get('/payments', authenticate, requireRole('admin'), getAdminPayments);
// POST /api/admin/payments/advance - Process advance payment
router.post('/payments/advance', authenticate, requireRole('admin'), processAdvancePayment);
export default router;
//# sourceMappingURL=admin.routes.js.map