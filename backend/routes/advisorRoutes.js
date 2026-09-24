import express from 'express';
import {
  handleChat,
  getInsights,
  getForecast,
  getReports,
} from '../controllers/advisorController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Private Advisor Endpoints
router.post('/chat', protect, handleChat);
router.get('/insights', protect, getInsights);
router.get('/forecast', protect, getForecast);
router.get('/reports', protect, getReports);

export default router;
