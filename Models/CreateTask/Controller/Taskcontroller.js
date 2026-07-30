
import { Task, Project } from '../models';
import asyncHandler from '../middleware/asyncHandler';

const createTask = asyncHandler(async (req, res) => {
  const { title, description, projectId, dueDate, priority } = req.body;
 
  if (!title || !projectId || !dueDate) {
    return res.status(400).json({
      success: false,
      message: 'title, projectId, and dueDate are required fields',
    });
  }

  const projectExists = await Project.findByPk(projectId);
  if (!projectExists) {
    return res.status(404).json({ success: false, message: 'Project not found' });
  }
 
  const task = await Task.create({
    title,
    description,
    projectId,
    dueDate,
    priority,
  });
 
  res.status(201).json({ success: true, data: task });
});
 
const getTasks = asyncHandler(async (req, res) => {
  const { projectId } = req.query;
 
  const where = {};
  if (projectId) where.projectId = projectId;
 
  const tasks = await Task.findAll({
    where,

    include: [{ model: Project, attributes: ['id', 'title'] }],
  });
 
  res.status(200).json({ success: true, count: tasks.length, data: tasks });
});
 

const getTaskById = asyncHandler(async (req, res) => {
  const task = await Task.findByPk(req.params.id, {
    include: [{ model: Project, attributes: ['id', 'title'] }],
  });
 
  if (!task) {
    return res.status(404).json({ success: false, message: 'Task not found' });
  }
 
  res.status(200).json({ success: true, data: task });
});
 
const updateTask = asyncHandler(async (req, res) => {
  const task = await Task.findByPk(req.params.id);
 
  if (!task) {
    return res.status(404).json({ success: false, message: 'Task not found' });
  }
 

  await task.update(req.body);
 
  res.status(200).json({ success: true, data: task });
});
 

const deleteTask = asyncHandler(async (req, res) => {
  const task = await Task.findByPk(req.params.id);
 
  if (!task) {
    return res.status(404).json({ success: false, message: 'Task not found' });
  }
 
  await task.destroy(); // Sequelize's equivalent of findByIdAndDelete
 
  res.status(200).json({ success: true, message: 'Task deleted' });
});
 
module.exports = { createTask, getTasks, getTaskById, updateTask, deleteTask };
 