import { Router } from "express";

import authenticate from "../middleware/auth.middleware.js";
import authorize from "../middleware/authorize.middleware.js";

import { ROLES } from "../constants/roles.js";

import {
  getProjectAttendanceReportController,
  getVolunteerHoursReportController,
} from "../controllers/report.controller.js";

const router = Router();

router.get(
  "/volunteer-hours",
  authenticate,
  authorize(ROLES.ADMIN),
  getVolunteerHoursReportController,
);

router.get(
  "/projects/:projectId/attendance",
  authenticate,
  authorize(ROLES.COORDINATOR),
  getProjectAttendanceReportController,
);

export default router;
