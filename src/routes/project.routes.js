import { Router } from "express";

import authenticate from "../middleware/auth.middleware.js";
import authorize from "../middleware/authorize.middleware.js";
import validate from "../middleware/validate.js";

import { ROLES } from "../constants/roles.js";
import { createProjectController, getProjectController, getProjectByIdController, 
         updateProjectByIdController, deleteProjectByIdController } from "../controllers/project.controller.js";
import { createProjectValidator, updateProjectValidator } from "../validators/project.validator.js";

const router = Router();

router.post(
  "/",
  authenticate,
  authorize(ROLES.COORDINATOR),
  createProjectValidator,
  validate,
  createProjectController
);

router.get("/", 
  authenticate,
  getProjectController
);

router.get("/:id", 
  authenticate,
  getProjectController
);


router.patch("/:id",
  authenticate,
  authorize(ROLES.COORDINATOR),
  updateProjectValidator,
  validate,
  updateProjectByIdController

);

router.delete("/:id",
  authenticate,
  authorize(ROLES.COORDINATOR),
  deleteProjectByIdController

);


export default router;


