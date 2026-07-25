import { Router } from "express";
import { register, login } from "../controllers/auth.controller.js";
import {
  registerValidator,
  loginValidator,
} from "../validators/auth.validator.js";
import validate from "../middleware/validate.js";
import asyncHandler from "../middleware/asyncHandler.js";

const router = Router();

router.post("/register", registerValidator, validate, asyncHandler(register));
router.post("/login", loginValidator, validate, asyncHandler(login));

export default router;
