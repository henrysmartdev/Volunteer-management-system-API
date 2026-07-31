import { Op } from "sequelize";
import sequelize from "../config/database.js";

import Project from "../models/Project.js";
import Task from "../models/Task.js";
import User from "../models/User.js";
import TaskAssignment from "../models/TaskAssignment.js";
import { ROLES } from "../constants/roles.js";

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

    // Only the project owner can assign volunteers
    if (project.createdBy !== coordinatorId) {
      throw new Error("You are not authorized to assign volunteers");
    }

    // Ensure all users exist and are volunteers
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

    // Check for duplicate assignments
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

    // Create assignments
    const assignments = volunteerIds.map((volunteerId) => ({
      taskId,
      volunteerId,
    }));

    const createdAssignments = await TaskAssignment.bulkCreate(assignments, {
      transaction,
    });

    await transaction.commit();

    return createdAssignments;
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

export const getTaskAssignments = async (taskId) => {
  const task = await Task.findByPk(taskId);

  if (!task) {
    throw new Error("Task not found");
  }

  const assignments = await TaskAssignment.findAll({
    where: {
      taskId,
    },

    include: [
      {
        model: User,
        as: "volunteer",
        attributes: ["id", "firstName", "lastName", "email", "avatar"],
      },
    ],

    order: [["createdAt", "DESC"]],
  });

  return assignments;
};

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
