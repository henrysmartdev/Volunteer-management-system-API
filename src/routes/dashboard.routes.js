import { Router } from "express";

import authenticate from "../middleware/auth.middleware.js";
import authorize from "../middleware/authorize.middleware.js";

import { ROLES } from "../constants/roles.js";
import { getProjectDashboardController } from "../controllers/dashboard.controller.js";

const router = Router({ mergeParams: true });

router.get(
  "/",
  authenticate,
  authorize(ROLES.COORDINATOR),
  getProjectDashboardController,
);

export default router;
