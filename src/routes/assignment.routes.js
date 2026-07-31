import { Router } from "express";

import authenticate from "../middleware/auth.middleware.js";
import authorize from "../middleware/authorize.middleware.js";
import validate from "../middleware/validate.js";

import { ROLES } from "../constants/roles.js";

import {
  assignVolunteersController,
  getTaskAssignmentsController,
  removeVolunteerAssignmentController,
  updateTaskStatusController,
} from "../controllers/assignment.controller.js";
import { assignVolunteersValidator } from "../validators/assignment.validator.js";
import { updateTaskStatusValidator } from "../validators/taskStatus.validator.js";

const router = Router({ mergeParams: true });

router.post(
  "/",
  authenticate,
  authorize(ROLES.COORDINATOR),
  assignVolunteersValidator,
  validate,
  assignVolunteersController,
);

router.get(
  "/",
  authenticate,
  authorize(ROLES.COORDINATOR),
  getTaskAssignmentsController,
);

router.delete(
  "/:volunteerId",
  authenticate,
  authorize(ROLES.COORDINATOR),
  removeVolunteerAssignmentController,
);

router.patch(
  "/status",
  authenticate,
  authorize(ROLES.VOLUNTEER),
  updateTaskStatusValidator,
  validate,
  updateTaskStatusController,
);
export default router;
