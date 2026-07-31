import { Op } from "sequelize";

import User from "../models/User.js";
import Project from "../models/Project.js";
import Task from "../models/Task.js";
import Attendance from "../models/Attendance.js";

import { ROLES } from "../constants/roles.js";

export const getSystemAnalytics = async () => {
  const [
    totalVolunteers,
    totalCoordinators,
    totalProjects,
    activeProjects,
    completedProjects,
    totalTasks,
    completedTasks,
    attendanceRecords,
    volunteerHours,
  ] = await Promise.all([
    User.count({
      where: {
        role: ROLES.VOLUNTEER,
      },
    }),

    User.count({
      where: {
        role: ROLES.COORDINATOR,
      },
    }),

    Project.count(),

    Project.count({
      where: {
        status: "ACTIVE",
      },
    }),

    Project.count({
      where: {
        status: "COMPLETED",
      },
    }),

    Task.count(),

    Task.count({
      where: {
        status: "COMPLETED",
      },
    }),

    Attendance.count(),

    Attendance.sum("totalHours"),
  ]);

  const pendingTasks = totalTasks - completedTasks;

  const averageVolunteerHours =
    attendanceRecords === 0
      ? 0
      : Number((Number(volunteerHours || 0) / attendanceRecords).toFixed(2));

  return {
    summary: {
      totalVolunteers,
      totalCoordinators,
      totalProjects,
      activeProjects,
      completedProjects,
      totalTasks,
      completedTasks,
      pendingTasks,
      attendanceRecords,
      averageVolunteerHours,
    },
  };
};
