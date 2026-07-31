import { body } from "express-validator";

export const registerValidator = [
  body("firstName").trim().notEmpty().withMessage("First name is required"),

  body("lastName").trim().notEmpty().withMessage("Last name is required"),

  body("email").isEmail().withMessage("Enter a valid email").normalizeEmail(),

  body("password")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters"),

  body("role")
    .optional()
    .isIn(["VOLUNTEER", "COORDINATOR"])
    .withMessage("Role must be VOLUNTEER or COORDINATOR"),
];

export const loginValidator = [
  body("email")
    .isEmail()
    .withMessage("Please provide a valid email")
    .normalizeEmail(),

  body("password").notEmpty().withMessage("Password is required"),
];

export const forgotPasswordValidator = [
  body("email").isEmail().withMessage("Valid email is required"),
];

export const resetPasswordValidator = [
  body("token").notEmpty().withMessage("Token is required"),

  body("password")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters"),
];
