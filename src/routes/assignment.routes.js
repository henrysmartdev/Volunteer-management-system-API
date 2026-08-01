import express from "express";

import authenticate from "../middleware/auth.middleware.js";
import authorize from "../middleware/authorize.middleware.js";
import validate from "../middleware/validate.js";
import { ROLES } from "../constants/roles.js";
import { createAssignmentController, getAssignmentsController, getAssignmentByIdController, getMyAssignmentsController, updateAssignmentController, deleteAssignmentController } from "../controllers/assignment.controller.js";
import { createAssignmentValidator, updateAssignmentValidator } from "../validators/assignment.validator.js";

const router = express.Router();

router.post(
  "/:taskId/assignments",
  authenticate,
  authorize(ROLES.COORDINATOR),
  createAssignmentValidator,
  validate,
  createAssignmentController
);

router.get(
  "/:taskId/assignments",
  authenticate,
  getAssignmentsController
);

router.get(
  "/my",
  authenticate,
  authorize(ROLES.VOLUNTEER),
  getMyAssignmentsController
);

router.get(
  "/:assignmentId",
  authenticate,
  getAssignmentByIdController
);

router.patch(
  "/:assignmentId",
  authenticate,
  updateAssignmentValidator,
  validate,
  updateAssignmentController
);

router.delete(
  "/:assignmentId",
  authenticate,
  authorize(ROLES.COORDINATOR),
  deleteAssignmentController
);

export default router;