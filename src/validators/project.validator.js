import { body } from "express-validator";

export const createProjectValidator = [
  body("title").trim().notEmpty().withMessage("Project title is required"),

  body("description")
    .trim()
    .notEmpty()
    .withMessage("Project description is required"),

  body("startDate")
    .notEmpty()
    .withMessage("Start date is required")
    .isISO8601()
    .withMessage("Start date must be a valid date"),

  body("endDate")
    .notEmpty()
    .withMessage("End date is required")
    .isISO8601()
    .withMessage("End date must be a valid date")
    .custom((value, { req }) => {
      if (new Date(value) < new Date(req.body.startDate)) {
        throw new Error("End date cannot be earlier than start date");
      }

      return true;
    }),
];

export const updateProjectValidator = [
  body("title")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Project title cannot be empty"),

  body("description")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Project description cannot be empty"),

  body("startDate").optional().isISO8601().withMessage("Invalid start date"),

  body("endDate").optional().isISO8601().withMessage("Invalid end date"),

  body("status")
    .optional()
    .isIn(["DRAFT", "ACTIVE", "COMPLETED", "ARCHIVED"])
    .withMessage("Invalid project status"),
];
