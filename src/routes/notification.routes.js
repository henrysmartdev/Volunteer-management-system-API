import { Router } from "express";

import authenticate from "../middleware/auth.middleware.js";

import {
  getNotificationsController,
  markNotificationAsReadController,
  markAllNotificationsAsReadController,
} from "../controllers/notification.controller.js";

const router = Router();

router.get("/", authenticate, getNotificationsController);

router.patch("/:id/read", authenticate, markNotificationAsReadController);

router.patch("/read-all", authenticate, markAllNotificationsAsReadController);

export default router;
