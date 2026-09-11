import express from 'express';
import { seedUserData } from '../controllers/seedController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.post('/', seedUserData);

export default router;
