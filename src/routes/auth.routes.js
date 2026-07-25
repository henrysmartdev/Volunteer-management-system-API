import { Router } from "express";
import {
  register,
  login,
  forgotPasswordController,
  resetPasswordController,
} from "../controllers/auth.controller.js";
import {
  registerValidator,
  loginValidator,
  resetPasswordValidator,
  forgotPasswordValidator,
} from "../validators/auth.validator.js";
import validate from "../middleware/validate.js";
import asyncHandler from "../middleware/asyncHandler.js";

const router = Router();

router.post("/register", registerValidator, validate, asyncHandler(register));
router.post("/login", loginValidator, validate, asyncHandler(login));
router.post(
  "/forgot-password",
  forgotPasswordValidator,
  validate,
  asyncHandler(forgotPasswordController),
);

router.post(
  "/reset-password",
  resetPasswordValidator,
  validate,
  asyncHandler(resetPasswordController),
);

export default router;
