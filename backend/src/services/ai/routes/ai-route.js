import { Router } from 'express';
import authenticateToken from '../../../middlewares/authentication.js'
import { getMonthlyInsights, getNextMonthPrediction } from '../controllers/ai-controller.js';

const router = Router();

router.get('/insights', authenticateToken, getMonthlyInsights);
router.get('/prediction', authenticateToken, getNextMonthPrediction);

export default router;
