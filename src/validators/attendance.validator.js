import { body } from "express-validator";

export const checkInValidator = [
  body("token").notEmpty().withMessage("QR token is required"),
];
