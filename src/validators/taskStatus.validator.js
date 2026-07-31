import { body } from "express-validator";

export const updateTaskStatusValidator = [
  body("status")
    .notEmpty()
    .withMessage("Status is required")
    .isIn(["NOT_STARTED", "IN_PROGRESS", "COMPLETED"])
    .withMessage("Invalid status"),
];
