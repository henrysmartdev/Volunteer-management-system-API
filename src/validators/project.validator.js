import { body } from "express-validator";

export const createProjectValidator = [
  body("title")
    .trim()
    .notEmpty()
    .withMessage("Project title is required"),

  body("description")
    .trim()
    .notEmpty()
    .withMessage("Project description is required"),

  body("status")
    .optional()
    .isIn(["DRAFT", "ACTIVE", "COMPLETED", "ARCHIVED"])
    .withMessage("Invalid project status"),  

  body("startDate")
    .isISO8601()
    .withMessage("Valid start date is required (YYYY-MM-DD)")
    .custom((value) => {
      const startDate = new Date(value);
      const today = new Date();

      // Remove the time component
      startDate.setHours(0, 0, 0, 0);
      today.setHours(0, 0, 0, 0);

      if (startDate < today) {
        throw new Error("Start date cannot be in the past");
      }

      return true;
      }),

  body("endDate")
    .isISO8601()
    .withMessage("Valid end date is required (YYYY-MM-DD)")
    .custom((value, { req }) => {
      const endDate = new Date(value);
      const startDate = new Date(req.body.startDate);

      startDate.setHours(0, 0, 0, 0);
      endDate.setHours(0, 0, 0, 0);

      if (endDate < startDate) {
        throw new Error("End date must be on or after the start date");
      }

      return true;

    }
      ),
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

  body("status")
    .optional()
    .isIn(["DRAFT", "ACTIVE", "COMPLETED", "ARCHIVED"])
    .withMessage("Invalid project status"),

  body("startDate")
    .optional()
    .isISO8601()
    .withMessage("Valid start date is required"),

  body("endDate")
    .optional()
    .isISO8601()
    .withMessage("Valid end date is required"),
];
