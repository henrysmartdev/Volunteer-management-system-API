import { createTask, getTasks, getTaskById, updateTaskById, deleteTaskById } from "../services/task.service.js";
import asyncHandler from "../middleware/asyncHandler.js";

export const createTaskController = asyncHandler(async (req, res) => {

  const task = await createTask(
    req.params.projectId,
    req.body,
    req.user
  );

  res.status(201).json({
    success: true,
    message: "Task created successfully.",
    data: task,
  });

});

export const getTaskController = asyncHandler(async (req, res) => {

    const tasks = await getTasks(req.params.projectId);

    res.status(200).json({
    success: true,
    message: "Tasks retrieved successfully.",
    data: tasks,
    });
});

export const getTaskByIdController = asyncHandler(async (req, res) => {
  const task = await getTaskById(req.params.taskId);

  res.status(200).json({
    success: true,
    message: "Task retrieved successfully.",
    data: task,
  });
});

export const updateTaskController = asyncHandler(async (req, res) => {

  const task = await updateTaskById(
    req.params.taskId,
    req.body
  );

  res.status(200).json({
    success: true,
    message: "Task updated successfully.",
    data: task,
  });

});

export const deleteTaskController = asyncHandler(async (req, res) => {

  await deleteTaskById(req.params.taskId);

  res.status(200).json({
    success: true,
    message: `Task "${task.title}" deleted successfully.`,
  data: {
    id: task.id,
    title: task.title,
    },
  });

});
