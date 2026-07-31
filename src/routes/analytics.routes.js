import { Router } from "express";

import authenticate from "../middleware/auth.middleware.js";
import authorize from "../middleware/authorize.middleware.js";

import { ROLES } from "../constants/roles.js";

import { getSystemAnalyticsController } from "../controllers/analytics.controller.js";

const router = Router();

router.get(
  "/",
  authenticate,
  authorize(ROLES.ADMIN),
  getSystemAnalyticsController,
);

export default router;
