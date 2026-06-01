import { Router } from 'express';
import { getMonthlyInsights, getNextMonthPrediction } from '../controllers/ai-controller.js';

const router = Router();

router.get('/insights', getMonthlyInsights);
router.get('/prediction', getNextMonthPrediction);

export default router;
