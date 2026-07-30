import { Router } from 'express';
const router = Router();

import { getVolunteerHoursReport, getAttendanceReport } from '../controllers/reportController';

import { protect, authorize } from '../middleware/auth';

router.get('/volunteer-hours', protect, authorize('coordinator'), getVolunteerHoursReport);
router.get('/attendance', protect, authorize('coordinator'), getAttendanceReport);

export default router;