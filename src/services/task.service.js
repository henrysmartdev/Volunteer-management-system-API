import Project from "../models/Project.js";
import Task from "../models/Task.js";
import { validate as isUuid } from "uuid";

export const createTask = async (projectId, body, user) => {
  // Validate UUID
    if (!isUuid(projectId)) {
  throw new Error("Invalid project ID.");
  }

  const project = await Project.findByPk(projectId);

  if (!project) {
    throw new Error("Project not found.");
  }

  if (project.status === "ARCHIVED" || project.status === "COMPLETED") {
    throw new Error(
      "Cannot create tasks for an archived or completed project."
    );
  }

      //Confirm due date falls within project's duration
  const dueDate = new Date(body.dueDate);

  const startDate = new Date(project.startDate);

  const endDate = new Date(project.endDate);

  dueDate.setHours(0,0,0,0);
  startDate.setHours(0,0,0,0);
  endDate.setHours(0,0,0,0);

  if (
    dueDate < startDate ||
    dueDate > endDate
  ) {
    throw new Error(
      "Task due date must fall within the project's duration."
    );
  }

      //Avoid multiple task with the same title within a project
  const existingTask = await Task.findOne({
    where: {
      title: body.title,
      projectId,
    },
  });

  if (existingTask) {
    throw new Error(
      "A task with this title already exists in this project."
    );
  }
      //create task
  const task = await Task.create({
    title: body.title,
    description: body.description,
    dueDate: body.dueDate,
    priority: body.priority,
    projectId,
    createdBy: user.id,
  });
  return task;


};


export const getTasks = async (projectId) => {


  if (!isUuid(projectId)) {
    throw new Error("Invalid project ID.");
  }


  const project = await Project.findByPk(projectId);

  if (!project) {
    throw new Error("Project not found.");
  }

  // Retrieve all tasks for the project in descending order of time created
  const tasks = await Task.findAll({
    where: {
      projectId,
    },
    order: [["createdAt", "DESC"]],
  });

  return tasks;
};


export const getTaskById = async (taskId) => {

  if (!isUuid(taskId)) {
    throw new Error("Invalid task ID.");
  }

  // Find task
  const task = await Task.findByPk(taskId);

  if (!task) {
    throw new Error("Task not found.");
  }

  return task;
};

export const updateTaskById = async (taskId, body) => {
    if (!isUuid(taskId)) {
  throw new Error("Invalid task ID.");
    };
  const task = await Task.findByPk(taskId);

    if (!task) {
    throw new Error("Task not found.");
    };
    

    const allowedFields = [
      "title",
      "description",
      "priority",
      "dueDate",
        ];

    const receivedFields = Object.keys(body);

    const hasValidUpdate = receivedFields.some(field =>
    allowedFields.includes(field)
    );

    if (!hasValidUpdate) {
    throw new Error(
        "Please provide at least one valid field to update."
    );
    };

    //confirm title doesnt exist
    const {
  title,
  description,
  priority,
  dueDate,
    } = body;

    if (title) {

  const existingTask = await Task.findOne({
    where: {
      title,
      projectId: task.projectId,
    },
  });

  if (
    existingTask &&
    existingTask.id !== task.id
   ){
    throw new Error(
      "Task title already exists in this project."
    );
  }};

    //confirm due date is within project timeline
    const project = await Project.findByPk(task.projectId);
    const updatedData = {
        title: title ?? task.title,
        description: description ?? task.description,
        priority: priority ?? task.priority,
        dueDate: dueDate ?? task.dueDate,
        };
    const due = new Date(updatedData.dueDate);

    const start = new Date(project.startDate);

    const end = new Date(project.endDate);

    due.setHours(0,0,0,0);
    start.setHours(0,0,0,0);
    end.setHours(0,0,0,0);

    if (
        due < start ||
        due > end
        ) {
        throw new Error(
            "Task due date must fall within the project's duration."
        );
        };
        
    await task.update(updatedData);

    return task;
        

};

export const deleteTaskById = async (taskId) => {
    if (!isUuid(taskId)) {
  throw new Error("Invalid task ID.");
    }

    const task = await Task.findByPk(taskId);

    if (!task) {
    throw new Error("Task not found.");
    }

    await task.destroy();
    return task;

};