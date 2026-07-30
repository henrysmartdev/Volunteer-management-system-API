import { Router } from "express";

import authenticate from "../middleware/auth.middleware.js";
import authorize from "../middleware/authorize.middleware.js";
import validate from "../middleware/validate.js";

import { ROLES } from "../constants/roles.js";

import { createProjectController } from "../controllers/project.controller.js";
import { createProjectValidator } from "../validators/project.validator.js";

const router = Router();

router.post(
  "/",
  authenticate,
  authorize(ROLES.COORDINATOR),
  createProjectValidator,
  validate,
  createProjectController,
);

export default router;
