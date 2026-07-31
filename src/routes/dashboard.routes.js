import { Router } from "express";

import authenticate from "../middleware/auth.middleware.js";
import authorize from "../middleware/authorize.middleware.js";

import { ROLES } from "../constants/roles.js";
import {
  getCoordinatorDashboardController,
  getProjectDashboardController,
} from "../controllers/dashboard.controller.js";

const router = Router();
const projectDashboardRoutes = Router({ mergeParams: true });

projectDashboardRoutes.get(
  "/",
  authenticate,
  authorize(ROLES.COORDINATOR),
  getProjectDashboardController,
);

router.get(
  "/coordinator",
  authenticate,
  authorize(ROLES.COORDINATOR),
  getCoordinatorDashboardController,
);

export default router;
export { projectDashboardRoutes };
