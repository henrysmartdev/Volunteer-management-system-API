import {
  createTask,
  deleteTask,
  getProjectTasks,
  getTaskById,
  updateTask,
} from "../services/task.service.js";

export const createTaskController = async (req, res, next) => {
  try {
    const task = await createTask(req.params.projectId, req.user.id, req.body);

    return res.status(201).json({
      success: true,
      message: "Task created successfully",
      data: task,
    });
  } catch (error) {
    next(error);
  }
};

export const getProjectTasksController = async (req, res, next) => {
  try {
    const tasks = await getProjectTasks(req.params.projectId);

    return res.status(200).json({
      success: true,
      count: tasks.length,
      data: tasks,
    });
  } catch (error) {
    next(error);
  }
};

export const getTaskByIdController = async (req, res, next) => {
  try {
    const task = await getTaskById(req.params.projectId, req.params.taskId);

    res.status(200).json({
      success: true,
      data: task,
    });
  } catch (error) {
    next(error);
  }
};

export const updateTaskController = async (req, res, next) => {
  try {
    const task = await updateTask(
      req.params.projectId,
      req.params.taskId,
      req.user.id,
      req.body,
    );

    res.status(200).json({
      success: true,
      message: "Task updated successfully",
      data: task,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteTaskController = async (req, res, next) => {
  try {
    await deleteTask(req.params.projectId, req.params.taskId, req.user.id);

    res.status(200).json({
      success: true,
      message: "Task deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};
