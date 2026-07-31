import { body } from "express-validator";

export const createTaskValidator = [
  body("title").trim().notEmpty().withMessage("Task title is required"),

  body("description").optional().trim(),

  body("dueDate")
    .notEmpty()
    .withMessage("Due date is required")
    .isISO8601()
    .withMessage("Due date must be a valid date"),
];

export const updateTaskValidator = [
  body("title").optional().notEmpty(),
  body("description").optional(),
  body("dueDate").optional().isISO8601(),

  body("status").optional().isIn(["PENDING", "IN_PROGRESS", "COMPLETED"]),
];
