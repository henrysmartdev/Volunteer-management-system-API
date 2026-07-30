
import { Router } from 'express';
const router = Router();

import { assignVolunteer, getAssignmentsForTask, getAssignmentsForVolunteer, removeAssignment } from '../controllers/assignmentController';

import { protect, authorize } from '../middleware/auth';

router.post('/', protect, authorize('coordinator'), assignVolunteer); 
router.get('/task/:taskId', protect, getAssignmentsForTask); 
router.get('/volunteer/:volunteerId', protect, getAssignmentsForVolunteer); 
router.delete('/:id', protect, authorize('coordinator'), removeAssignment); 

export default router;