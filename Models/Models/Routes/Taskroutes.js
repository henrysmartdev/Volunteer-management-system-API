

import { Router } from 'express';
const router = Router();

import { createTask, getTasks, getTaskById, updateTask, deleteTask } from '../controllers/taskController';

import { protect, authorize } from '../middleware/auth';

router
  .route('/')
  .post(protect, authorize('coordinator'), createTask) 
  .get(protect, getTasks); 

router
  .route('/:id')
  .get(protect, getTaskById) 
  .put(protect, authorize('coordinator'), updateTask) 
  .delete(protect, authorize('coordinator'), deleteTask); 

export default router;