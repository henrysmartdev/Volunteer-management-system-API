import { Assignment, Task, User } from '../models';
import { UniqueConstraintError } from 'sequelize';
import asyncHandler from '../middleware/asyncHandler'

const assignVolunteer = asyncHandler(async (req, res) => {
  const { taskId, volunteerId } = req.body;

  if (!taskId || !volunteerId) {
    return res.status(400).json({ success: false, message: 'taskId and volunteerId are required' });
  }

  const taskExists = await Task.findByPk(taskId);
  if (!taskExists) {
    return res.status(404).json({ success: false, message: 'Task not found' });
  }

  const volunteer = await User.findByPk(volunteerId);
  if (!volunteer || volunteer.role !== 'volunteer') {
    return res.status(404).json({ success: false, message: 'Volunteer not found' });
  }

  try {
    const assignment = await Assignment.create({ taskId, volunteerId });
    res.status(201).json({ success: true, data: assignment });
  } catch (error) {

    if (error instanceof UniqueConstraintError) {
      return res.status(400).json({
        success: false,
        message: 'This volunteer is already assigned to this task',
      });
    }
    throw error; 
  }
});


const getAssignmentsForTask = asyncHandler(async (req, res) => {
  const assignments = await Assignment.findAll({
    where: { taskId: req.params.taskId },
    include: [{ model: User, as: 'volunteer', attributes: ['id', 'name', 'email'] }],
  });

  res.status(200).json({ success: true, count: assignments.length, data: assignments });
});

const getAssignmentsForVolunteer = asyncHandler(async (req, res) => {
  const assignments = await Assignment.findAll({
    where: { volunteerId: req.params.volunteerId },
    include: [{ model: Task, attributes: ['id', 'title', 'dueDate', 'priority', 'status'] }],
  });

  res.status(200).json({ success: true, count: assignments.length, data: assignments });
});


const removeAssignment = asyncHandler(async (req, res) => {
  const assignment = await Assignment.findByPk(req.params.id);

  if (!assignment) {
    return res.status(404).json({ success: false, message: 'Assignment not found' });
  }

  await assignment.destroy();

  res.status(200).json({ success: true, message: 'Assignment removed' });
});

export default {
  assignVolunteer,
  getAssignmentsForTask,
  getAssignmentsForVolunteer,
  removeAssignment,
};