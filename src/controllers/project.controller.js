import { createProject } from "../services/project.service.js";

export const createProjectController = async (req, res) => {
  const project = await createProject(req.body, req.user);

  res.status(201).json({
    success: true,
    message: "Project created successfully",
    data: project,
  });
};
