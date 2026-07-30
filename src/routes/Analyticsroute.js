import { Router } from 'express';
const router = Router();

import { getDashboardAnalytics } from '../controllers/analyticsController';
import { protect, authorize } from '../middleware/auth';

router.get('/dashboard', protect, authorize('coordinator'), getDashboardAnalytics);

export default router;