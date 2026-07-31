import { Router } from "express";

import authenticate from "../middleware/auth.middleware.js";
import authorize from "../middleware/authorize.middleware.js";

import { ROLES } from "../constants/roles.js";

import {
  generateProjectQRCodeController,
  checkInController,
  manualCheckInController,
  getAttendanceHistoryController,
  checkOutController,
} from "../controllers/attendance.controller.js";
import { checkInValidator } from "../validators/attendance.validator.js";
import validate from "../middleware/validate.js";

const router = Router();
const projectAttendanceRoutes = Router({ mergeParams: true });

projectAttendanceRoutes.post(
  "/qr-code",
  authenticate,
  authorize(ROLES.COORDINATOR),
  generateProjectQRCodeController,
);

router.post(
  "/check-in",
  authenticate,
  authorize(ROLES.VOLUNTEER),
  checkInValidator,
  validate,
  checkInController,
);

projectAttendanceRoutes.post(
  "/manual-check-in",
  authenticate,
  authorize(ROLES.VOLUNTEER),
  manualCheckInController,
);

projectAttendanceRoutes.patch(
  "/check-out",
  authenticate,
  authorize(ROLES.VOLUNTEER),
  checkOutController,
);

router.get(
  "/history",
  authenticate,
  authorize(ROLES.VOLUNTEER),
  getAttendanceHistoryController,
);

export default router;
export { projectAttendanceRoutes };
