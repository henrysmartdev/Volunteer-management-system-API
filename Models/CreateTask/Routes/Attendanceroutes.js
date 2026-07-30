
import { Router } from 'express';
const router = Router();

import { logAttendance } from '../controllers/attendanceController';
import { protect, authorize } from '../middleware/auth';

router.post('/', protect, authorize('coordinator'), logAttendance); 

export default router;