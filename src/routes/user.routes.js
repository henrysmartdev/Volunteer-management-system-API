import { Router } from "express";
import authenticate from "../middleware/auth.middleware.js";
import authorize from "../middleware/authorize.middleware.js";
import { ROLES } from "../constants/roles.js";

const router = Router();

router.get("/profile", authenticate, (req, res) => {
  res.json({
    success: true,
    user: req.user,
  });
});

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
