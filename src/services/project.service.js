import Project from "../models/Project.js";
import { ROLES } from "../constants/roles.js";
import { Op } from "sequelize";

export const createProject = async (data, user) => {

  const project = await Project.create({
    title: data.title,
    description: data.description,
    startDate: data.startDate,
    endDate: data.endDate,
    createdBy: user.id,
  });

  return project
  
};


export const getProjects = async (user) => {
 
  if (user.role === ROLES.COORDINATOR) {
    return await Project.findAll();
  }

  return await Project.findAll({
    where: {
      status: {
        [Op.notIn]: ["DRAFT", "ARCHIVED"],
      },
    },
  });
};

export const getProjectById = async (id) => {

  const project = await Project.findByPk(id);

  if (!project) {
    throw new Error("Project not found.");
  }

  return project;
};


export const updateProjectById = async (id, body) => {

  // Fields users are allowed to update
  const allowedFields = [
    "title",
    "description",
    "status",
    "startDate",
    "endDate",
  ];

  

  // Checks that at least one valid field was sent
  const receivedFields = Object.keys(body);

  const hasValidUpdate = receivedFields.some(field =>
    allowedFields.includes(field)
  );

  if (!hasValidUpdate) {
    throw new Error("Please provide at least one valid field to update.");
  }

  // Find project
  const project = await Project.findByPk(id);

  if (!project) {
    throw new Error("Project not found.");
  }

  
  const {
    title,
    description,
    status,
    startDate,
    endDate,
  } = body;

  // Check title uniqueness
  if (title) {

    const existingProject = await Project.findOne({
      where: {
        title,
      },
    });

    if (
      existingProject &&
      existingProject.id !== project.id
    ) {
      throw new Error("Project title already exists.");
    }
  }

  
  const updatedData = {

    title: title ?? project.title,
    description: description ?? project.description,
    status: status ?? project.status,
    startDate: startDate ?? project.startDate,
    endDate: endDate ?? project.endDate,

  };

  // Validate dates
  const start = new Date(updatedData.startDate);
  const end = new Date(updatedData.endDate);

  start.setHours(0,0,0,0);
  end.setHours(0,0,0,0);

  if (end < start) {
    throw new Error(
      "End date cannot be before the start date."
    );
  }

  // Update database
  await project.update(updatedData);

  return project;

};

export const deleteProjectById = async (id) => {

 
  const project = await Project.findByPk(id);

  if (!project) {
    throw new Error("Project not found.");
  }

  await project.destroy();
};