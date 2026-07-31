import Project from "../models/Project.js";
import Task from "../models/Task.js";

export const createTask = async (projectId, userId, taskData) => {
  // Find the project
  const project = await Project.findByPk(projectId);

  if (!project) {
    throw new Error("Project not found");
  }

  // Ensure the authenticated coordinator owns the project
  if (project.createdBy !== userId) {
    throw new Error("You are not authorized to add tasks to this project");
  }

  // Optional business rule
  if (new Date(taskData.dueDate) > new Date(project.endDate)) {
    throw new Error("Task due date cannot be after the project end date");
  }

  const task = await Task.create({
    title: taskData.title,
    description: taskData.description,
    dueDate: taskData.dueDate,
    projectId,
    status: "PENDING",
  });

  return task;
};

export const getProjectTasks = async (projectId) => {
  const project = await Project.findByPk(projectId);

  if (!project) {
    throw new Error("Project not found");
  }

  const tasks = await Task.findAll({
    where: {
      projectId,
    },
    order: [["createdAt", "DESC"]],
  });

  return tasks;
};

export const getTaskById = async (projectId, taskId) => {
  const task = await Task.findOne({
    where: {
      id: taskId,
      projectId,
    },
  });

  if (!task) {
    throw new Error("Task not found");
  }

  return task;
};

export const updateTask = async (projectId, taskId, userId, data) => {
  const project = await Project.findByPk(projectId);

  if (!project) {
    throw new Error("Project not found");
  }

  if (project.createdBy !== userId) {
    throw new Error("Unauthorized");
  }

  const task = await Task.findOne({
    where: {
      id: taskId,
      projectId,
    },
  });

  if (!task) {
    throw new Error("Task not found");
  }

  const dueDate = data.dueDate ?? task.dueDate;

  if (new Date(dueDate) > new Date(project.endDate)) {
    throw new Error("Task due date cannot be after the project end date");
  }

  const fields = ["title", "description", "dueDate", "status"];

  fields.forEach((field) => {
    if (data[field] !== undefined) {
      task[field] = data[field];
    }
  });

  await task.save();

  return task;
};

export const deleteTask = async (projectId, taskId, userId) => {
  const project = await Project.findByPk(projectId);

  if (!project) {
    throw new Error("Project not found");
  }

  if (project.createdBy !== userId) {
    throw new Error("Unauthorized");
  }

  const task = await Task.findOne({
    where: {
      id: taskId,
      projectId,
    },
  });

  if (!task) {
    throw new Error("Task not found");
  }

  await task.destroy();
};
