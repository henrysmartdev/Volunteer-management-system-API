import { body } from "express-validator";

export const createProjectValidator = [
  body("title").trim().notEmpty().withMessage("Project title is required"),

  body("description")
    .trim()
    .notEmpty()
    .withMessage("Project description is required"),

  body("startDate").isISO8601().withMessage("Valid start date is required"),

  body("endDate").isISO8601().withMessage("Valid end date is required"),
];
