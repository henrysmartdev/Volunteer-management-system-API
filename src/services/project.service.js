import { Project, User } from "../models/index.js";

export const createProject = async (projectData, coordinatorId) => {
  const project = await Project.create({
    title: projectData.title,
    description: projectData.description,
    startDate: projectData.startDate,
    endDate: projectData.endDate,

    // Business rules
    status: "DRAFT",
    createdBy: coordinatorId,
  });

  return project;
};

export const getProjects = async (page = 1, limit = 10) => {
  const offset = (page - 1) * limit;

  const { rows, count } = await Project.findAndCountAll({
    limit,
    offset,
    order: [["createdAt", "DESC"]],

    include: [
      {
        model: User,
        as: "creator",
        attributes: ["id", "firstName", "lastName", "email", "avatar"],
      },
    ],
  });

  return {
    projects: rows,
    pagination: {
      total: count,
      page,
      limit,
      totalPages: Math.ceil(count / limit),
    },
  };
};

export const getProjectById = async (projectId) => {
  const project = await Project.findByPk(projectId, {
    include: [
      {
        model: User,
        as: "creator",
        attributes: ["id", "firstName", "lastName", "email", "avatar"],
      },
    ],
  });

  if (!project) {
    throw new Error("Project not found");
  }

  return project;
};

export const updateProject = async (projectId, userId, updateData) => {
  const project = await Project.findByPk(projectId);

  if (!project) {
    throw new Error("Project not found");
  }

  if (project.createdBy !== userId) {
    throw new Error("You are not authorized to update this project");
  }

  const startDate = updateData.startDate ?? project.startDate;
  const endDate = updateData.endDate ?? project.endDate;

  if (new Date(endDate) < new Date(startDate)) {
    throw new Error("End date cannot be earlier than start date");
  }

  const allowedFields = [
    "title",
    "description",
    "startDate",
    "endDate",
    "status",
  ];

  allowedFields.forEach((field) => {
    if (updateData[field] !== undefined) {
      project[field] = updateData[field];
    }
  });

  await project.save();

  return project;
};

export const deleteProject = async (projectId, userId) => {
  const project = await Project.findByPk(projectId);

  if (!project) {
    throw new Error("Project not found");
  }

  if (project.createdBy !== userId) {
    throw new Error("You are not authorized to delete this project");
  }

  await project.destroy();

  return;
};
