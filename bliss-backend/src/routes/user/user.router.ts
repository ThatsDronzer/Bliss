import express, { Router } from 'express';
import {
	getUserById,
	createUser,
	updateUser,
	getUserBookingRequests,
} from '@controllers/user/user.controller';
import { authenticate } from '../../middlewares/auth.middleware.js';

const router: Router = express.Router();

router.get('/:id', getUserById);
router.put('/:id', authenticate, updateUser);
router.post('/create', authenticate, createUser);
router.get('/booking-requests', authenticate, getUserBookingRequests);

export default router;

