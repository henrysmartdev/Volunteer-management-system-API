import { body } from "express-validator";

export const createTaskValidator = [

  body("title")
    .trim()
    .notEmpty()
    .withMessage("Task title is required"),

  body("description")
    .trim()
    .notEmpty()
    .withMessage("Task description is required"),

  body("dueDate")
    .isISO8601()
    .withMessage("Valid due date is required (YYYY-MM-DD)"),

  body("priority")
    .notEmpty()
    .isIn(["LOW", "MEDIUM", "HIGH"])
    .withMessage("Priority must be LOW, MEDIUM or HIGH"),
];

export const updateTaskValidator = [

  body("title")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Title cannot be empty."),

  body("description")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Description cannot be empty."),

  body("priority")
    .optional()
    .isIn(["LOW", "MEDIUM", "HIGH"])
    .withMessage("Priority must be LOW, MEDIUM, or HIGH."),

  body("dueDate")
    .optional()
    .isISO8601()
    .withMessage("Due date must be a valid date.")
    .toDate(),

];