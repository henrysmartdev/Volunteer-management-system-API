import { body } from "express-validator";

export const createAssignmentValidator = [

  body("volunteerId")
    .notEmpty()
    .withMessage("Volunteer ID is required.")
    .isUUID()
    .withMessage("Volunteer ID must be a valid UUID."),

];

export const updateAssignmentValidator = [

  body("status")
    .notEmpty()
    .withMessage("Status is required.")
    .isIn([
      "NOT_STARTED",
      "IN_PROGRESS",
      "COMPLETED",
    ])
    .withMessage("Invalid assignment status."),

];