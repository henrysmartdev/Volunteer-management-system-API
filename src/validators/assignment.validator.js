import { body } from "express-validator";

export const assignVolunteersValidator = [
  body("volunteerIds")
    .isArray({ min: 1 })
    .withMessage("At least one volunteer must be selected"),

  body("volunteerIds.*")
    .isUUID()
    .withMessage("Each volunteer ID must be a valid UUID"),
];
