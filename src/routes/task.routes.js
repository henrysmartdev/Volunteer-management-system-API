import express from "express";

import authenticate from "../middleware/auth.middleware.js";
import authorize from "../middleware/authorize.middleware.js";
import validate from "../middleware/validate.js";

import { ROLES } from "../constants/roles.js";

import { createTaskController, getTaskController, getTaskByIdController, updateTaskController, deleteTaskController } from "../controllers/task.controller.js";
import { createTaskValidator, updateTaskValidator } from "../validators/task.validator.js";

const router = express.Router();

router.post(
  "/:projectId/tasks",
  authenticate,
  authorize(ROLES.COORDINATOR),
  createTaskValidator,
  validate,
  createTaskController
);

router.get(
    "/:projectId/tasks",
    authenticate,
    getTaskController
);

router.get(
  "/:taskId",
  authenticate,
  getTaskByIdController
);

router.patch(
  "/:taskId",
  authenticate,
  authorize(ROLES.COORDINATOR),
  updateTaskValidator,
  validate,
  updateTaskController
);

router.delete(
  "/:taskId",
  authenticate,
  authorize(ROLES.COORDINATOR),
  deleteTaskController
);


export default router;