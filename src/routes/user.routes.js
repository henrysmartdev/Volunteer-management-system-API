import { Router } from "express";

import authenticate from "../middleware/auth.middleware.js";
import validate from "../middleware/validate.js";
import asyncHandler from "../middleware/asyncHandler.js";

import upload from "../config/multer.js";

import {
  getProfileController,
  updateProfileController,
  uploadProfilePictureController,
} from "../controllers/user.controller.js";

import { updateProfileValidator } from "../validators/user.validator.js";

const router = Router();

// Profile

router.get("/profile", authenticate, getProfileController);

router.put(
  "/profile",
  authenticate,
  updateProfileValidator,
  validate,
  updateProfileController,
);

router.patch(
  "/profile/avatar",
  authenticate,
  upload.single("avatar"),
  asyncHandler(uploadProfilePictureController),
);

export default router;
