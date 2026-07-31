import { Op } from "sequelize";
import sequelize from "../config/database.js";

import Project from "../models/Project.js";
import Task from "../models/Task.js";
import User from "../models/User.js";
import TaskAssignment from "../models/TaskAssignment.js";

import { ROLES } from "../constants/roles.js";
import { createNotifications } from "./notification.service.js";

/**
 * Assign one or more volunteers to a task
 */
export const assignVolunteers = async (taskId, coordinatorId, volunteerIds) => {
  const transaction = await sequelize.transaction();

  try {
    // Check task exists
    const task = await Task.findByPk(taskId, { transaction });

    if (!task) {
      throw new Error("Task not found");
    }

    // Check project exists
    const project = await Project.findByPk(task.projectId, {
      transaction,
    });

    if (!project) {
      throw new Error("Project not found");
    }

    // Ensure coordinator owns the project
    if (project.createdBy !== coordinatorId) {
      throw new Error("You are not authorized to assign volunteers");
    }

    // Validate volunteers
    const volunteers = await User.findAll({
      where: {
        id: {
          [Op.in]: volunteerIds,
        },
        role: ROLES.VOLUNTEER,
      },
      transaction,
    });

    if (volunteers.length !== volunteerIds.length) {
      throw new Error("One or more volunteers are invalid");
    }

    // Prevent duplicate assignments
    const existingAssignments = await TaskAssignment.findAll({
      where: {
        taskId,
        volunteerId: {
          [Op.in]: volunteerIds,
        },
      },
      transaction,
    });

    if (existingAssignments.length > 0) {
      throw new Error("One or more volunteers are already assigned");
    }

    // Create task assignments
    const assignments = volunteerIds.map((volunteerId) => ({
      taskId,
      volunteerId,
    }));

    const createdAssignments = await TaskAssignment.bulkCreate(assignments, {
      transaction,
    });

    // Generate notifications
    await createNotifications(
      volunteerIds,
      "New Task Assignment",
      `You have been assigned to the task "${task.title}".`,
      "TASK_ASSIGNMENT",
      transaction,
    );

    // Commit transaction
    await transaction.commit();

    return createdAssignments;
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

/**
 * Get all volunteers assigned to a task
 */
export const getTaskAssignments = async (taskId) => {
  const task = await Task.findByPk(taskId);

  if (!task) {
    throw new Error("Task not found");
  }

  return TaskAssignment.findAll({
    where: { taskId },
    include: [
      {
        model: User,
        as: "volunteer",
        attributes: ["id", "firstName", "lastName", "email", "avatar"],
      },
    ],
    attributes: ["id", "status", "assignedAt", "createdAt", "updatedAt"],
    order: [["createdAt", "DESC"]],
  });
};

/**
 * Remove a volunteer from a task
 */
export const removeVolunteerAssignment = async (
  taskId,
  volunteerId,
  coordinatorId,
) => {
  const task = await Task.findByPk(taskId);

  if (!task) {
    throw new Error("Task not found");
  }

  const project = await Project.findByPk(task.projectId);

  if (!project) {
    throw new Error("Project not found");
  }

  if (project.createdBy !== coordinatorId) {
    throw new Error("You are not authorized to remove assignments");
  }

  const assignment = await TaskAssignment.findOne({
    where: {
      taskId,
      volunteerId,
    },
  });

  if (!assignment) {
    throw new Error("Assignment not found");
  }

  await assignment.destroy();

  return assignment;
};

export const updateTaskStatus = async (taskId, volunteerId, status) => {
  const assignment = await TaskAssignment.findOne({
    where: {
      taskId,
      volunteerId,
    },
  });

  if (!assignment) {
    throw new Error("Task assignment not found");
  }

  assignment.status = status;

  await assignment.save();

  return assignment;
};
