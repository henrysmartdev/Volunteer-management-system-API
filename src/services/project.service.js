import Project from "../models/Project.js";

export const createProject = async (data, user) => {
  const project = await Project.create({
    title: data.title,
    description: data.description,
    startDate: data.startDate,
    endDate: data.endDate,
    createdBy: user.id,
  });

  return project;
};
