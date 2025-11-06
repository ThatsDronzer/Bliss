import express from 'express';
import { getUserById, createUser, updateUser, getUserBookingRequests, } from '@controllers/user/user.controller';
import { authenticate } from '../../middlewares/auth.middleware.js';
const router = express.Router();
router.get('/:id', getUserById);
router.put('/:id', authenticate, updateUser);
router.post('/create', authenticate, createUser);
router.get('/booking-requests', authenticate, getUserBookingRequests);
export default router;
//# sourceMappingURL=user.router.js.map