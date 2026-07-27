import { Router } from "express";

import authenticate from "../middleware/auth.middleware.js";
import authorize from "../middleware/authorize.middleware.js";
import validate from "../middleware/validate.js";
import asyncHandler from "../middleware/asyncHandler.js";

import upload from "../config/multer.js";

import { ROLES } from "../constants/roles.js";

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

/*
Test RBAC
 These routes can be removed later.
*/

router.get(
  "/coordinator",
  authenticate,
  authorize(ROLES.COORDINATOR),
  (req, res) => {
    res.json({
      success: true,
      message: "Welcome Coordinator",
    });
  },
);

router.get(
  "/volunteer",
  authenticate,
  authorize(ROLES.VOLUNTEER),
  (req, res) => {
    res.json({
      success: true,
      message: "Welcome Volunteer",
    });
  },
);

export default router;
