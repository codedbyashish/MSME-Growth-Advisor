import express from 'express';
import { getSales, createSale, deleteSale, updateSale } from '../controllers/saleController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.route('/')
  .get(getSales)
  .post(createSale);

router.route('/:id')
  .put(updateSale)
  .delete(deleteSale);

export default router;

