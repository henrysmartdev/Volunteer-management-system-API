import { Router } from "express";

import authenticate from "../middleware/auth.middleware.js";
import authorize from "../middleware/authorize.middleware.js";
import validate from "../middleware/validate.js";
import assignmentRoutes from "./assignment.routes.js";

import { ROLES } from "../constants/roles.js";

import {
  createTaskController,
  deleteTaskController,
  getProjectTasksController,
  getTaskByIdController,
  updateTaskController,
} from "../controllers/task.controller.js";
import {
  createTaskValidator,
  updateTaskValidator,
} from "../validators/task.validator.js";

const router = Router({ mergeParams: true });

router.post(
  "/",
  authenticate,
  authorize(ROLES.COORDINATOR),
  createTaskValidator,
  validate,
  createTaskController,
);

router.get("/", authenticate, getProjectTasksController);
router.get("/:taskId", authenticate, getTaskByIdController);
router.put(
  "/:taskId",
  authenticate,
  authorize(ROLES.COORDINATOR),
  updateTaskValidator,
  validate,
  updateTaskController,
);

router.delete(
  "/:taskId",
  authenticate,
  authorize(ROLES.COORDINATOR),
  deleteTaskController,
);

router.use("/:taskId/assignments", assignmentRoutes);

export default router;
