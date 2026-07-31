import { Op } from "sequelize";

import Project from "../models/Project.js";
import Task from "../models/Task.js";
import TaskAssignment from "../models/TaskAssignment.js";

export const getProjectDashboard = async (projectId, coordinatorId) => {
  // Verify project exists
  const project = await Project.findByPk(projectId);

  if (!project) {
    throw new Error("Project not found");
  }

  // Verify ownership
  if (project.createdBy !== coordinatorId) {
    throw new Error("You are not authorized to view this dashboard");
  }

  // Get all tasks
  const tasks = await Task.findAll({
    where: {
      projectId,
    },
    attributes: ["id", "title"],
  });

  const totalTasks = tasks.length;

  let completedTasks = 0;

  for (const task of tasks) {
    const assignments = await TaskAssignment.findAll({
      where: {
        taskId: task.id,
      },
    });

    // Ignore tasks with no volunteers assigned
    if (assignments.length === 0) continue;

    const allCompleted = assignments.every(
      (assignment) => assignment.status === "COMPLETED",
    );

    if (allCompleted) {
      completedTasks++;
    }
  }

  const outstandingTasks = totalTasks - completedTasks;

  const completionPercentage =
    totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);

  // Volunteer statistics
  const assignments = await TaskAssignment.findAll({
    where: {
      taskId: {
        [Op.in]: tasks.map((task) => task.id),
      },
    },
    attributes: ["volunteerId", "status"],
  });

  const totalVolunteers = new Set(
    assignments.map((assignment) => assignment.volunteerId),
  ).size;

  const activeVolunteers = new Set(
    assignments
      .filter((assignment) => assignment.status !== "NOT_STARTED")
      .map((assignment) => assignment.volunteerId),
  ).size;

  return {
    project: {
      id: project.id,
      title: project.title,
      status: project.status,
    },

    statistics: {
      completionPercentage,
      totalTasks,
      completedTasks,
      outstandingTasks,
      totalVolunteers,
      activeVolunteers,
    },
  };
};
