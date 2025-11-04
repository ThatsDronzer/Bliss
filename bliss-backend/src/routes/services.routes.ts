import express from 'express';
import { getServiceById } from '../controllers/search.controller.js';

const router = express.Router();

// GET /api/services/:serviceId - Get service by ID
router.get('/:serviceId', getServiceById);

export default router;

