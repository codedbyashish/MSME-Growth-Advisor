import express from 'express';
import { validateImportData, executeImport } from '../controllers/importController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.post('/validate', validateImportData);
router.post('/execute', executeImport);

export default router;
