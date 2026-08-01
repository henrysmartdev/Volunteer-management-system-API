import { createProject, getProjects, updateProjectById, getProjectById, deleteProjectById } from "../services/project.service.js";
import asyncHandler from "../middleware/asyncHandler.js";

export const createProjectController = asyncHandler(
  async (req, res) => {
    
    const project = await createProject(req.body, req.user);
    res.status(201).json({
      success: true,
      message: "Project created successfully",
      data: project,
    });
});

export const getProjectController = asyncHandler(
  async (req, res) => {
    const projects = await getProjects(req.user);
    res.status(200).json({
      success: true,
      message: "Projects returned successfully",
      data: projects,
    });

  
});

export const getProjectByIdController = asyncHandler(
  async (req, res) => {
    const { id } = req.params;
    const project = await getProjectById(id);

    res.status(200).json({
      success: true,
      message: "Project retrieved successfully.",
      data: project,
    });

  
});


export const updateProjectByIdController = asyncHandler(
  async (req, res) => {
    const project = await updateProjectById( req.params.id, req.body );
    return res.status(200).json({
      success: true,
      message: "Project updated successfully.",
      data: project,
    });

  
});

export const deleteProjectByIdController = asyncHandler(
  async (req, res) => {
    const { id } = req.params;
    const projects = await deleteProjectById(id);
    res.status(200).json({
      success: true,
      message: "Project deleted successfully.",
      
    });
  
});