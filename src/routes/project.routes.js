import { Router } from "express";

import authenticate from "../middleware/auth.middleware.js";
import authorize from "../middleware/authorize.middleware.js";
import validate from "../middleware/validate.js";

import { ROLES } from "../constants/roles.js";

import {
  createProjectController,
  deleteProjectController,
  getProjectByIdController,
  getProjectsController,
  updateProjectController,
} from "../controllers/project.controller.js";
import {
  createProjectValidator,
  updateProjectValidator,
} from "../validators/project.validator.js";

import taskRoutes from "./task.routes.js";
import { projectDashboardRoutes } from "./dashboard.routes.js";

import { projectAttendanceRoutes } from "./attendance.routes.js";

const router = Router();

router.post(
  "/",
  authenticate,
  authorize(ROLES.COORDINATOR),
  createProjectValidator,
  validate,
  createProjectController,
);

router.get("/", authenticate, getProjectsController);

router.get("/:id", authenticate, getProjectByIdController);

router.put(
  "/:id",
  authenticate,
  authorize(ROLES.COORDINATOR),
  updateProjectValidator,
  validate,
  updateProjectController,
);

router.delete(
  "/:id",
  authenticate,
  authorize(ROLES.COORDINATOR),
  deleteProjectController,
);

router.use("/:projectId/tasks", taskRoutes);

router.use("/:projectId/dashboard", projectDashboardRoutes);

router.use("/:projectId", projectAttendanceRoutes);

export default router;
