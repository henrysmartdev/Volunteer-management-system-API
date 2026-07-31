import jwt from "jsonwebtoken";
import QRCode from "qrcode";

import Attendance from "../models/Attendance.js";
import Project from "../models/Project.js";
import Task from "../models/Task.js";
import TaskAssignment from "../models/TaskAssignment.js";

export const generateProjectQRCode = async (projectId, coordinatorId) => {
  // Check project exists
  const project = await Project.findByPk(projectId);

  if (!project) {
    throw new Error("Project not found");
  }

  // Verify ownership
  if (project.createdBy !== coordinatorId) {
    throw new Error("You are not authorized to generate this QR code");
  }

  // Create JWT payload
  const payload = {
    projectId: project.id,
    type: "PROJECT_ATTENDANCE",
  };

  // Sign JWT
  const token = jwt.sign(payload, process.env.QR_SECRET, {
    expiresIn: process.env.QR_EXPIRES_IN,
  });

  // Convert token to QR image
  const qrCode = await QRCode.toDataURL(token);

  return {
    token,
    qrCode,
    expiresIn: process.env.QR_EXPIRES_IN,
  };
};

export const checkInToProject = async (token, volunteerId) => {
  let payload;

  // Verify QR token
  try {
    payload = jwt.verify(token, process.env.QR_SECRET);
  } catch (error) {
    throw new Error("Invalid or expired QR code");
  }

  // Verify project exists
  const project = await Project.findByPk(payload.projectId);

  if (!project) {
    throw new Error("Project not found");
  }

  // Verify volunteer is assigned to at least one task in this project
  const assignedTask = await Task.findOne({
    where: {
      projectId: payload.projectId,
    },
    include: [
      {
        model: TaskAssignment,
        as: "assignments",
        where: {
          volunteerId,
        },
        required: true,
      },
    ],
  });

  if (!assignedTask) {
    throw new Error("You are not assigned to this project and cannot check in");
  }

  // Prevent duplicate check-in
  const existingAttendance = await Attendance.findOne({
    where: {
      projectId: payload.projectId,
      volunteerId,
    },
  });

  if (existingAttendance) {
    throw new Error("You have already checked in to this project");
  }

  // Save attendance
  const attendance = await Attendance.create({
    projectId: payload.projectId,
    volunteerId,
    checkedInAt: new Date(),
  });

  return attendance;
};

export const manualCheckIn = async (projectId, volunteerId) => {
  const project = await Project.findByPk(projectId);

  if (!project) {
    throw new Error("Project not found");
  }

  // Verify volunteer belongs to the project
  const assignedTask = await Task.findOne({
    where: {
      projectId,
    },
    include: [
      {
        model: TaskAssignment,
        as: "assignments",
        where: {
          volunteerId,
        },
        required: true,
      },
    ],
  });

  if (!assignedTask) {
    throw new Error("You are not assigned to this project");
  }

  const existingAttendance = await Attendance.findOne({
    where: {
      projectId,
      volunteerId,
    },
  });

  if (existingAttendance) {
    throw new Error("Attendance has already been submitted");
  }

  return Attendance.create({
    projectId,
    volunteerId,
    checkedInAt: new Date(),
    method: "MANUAL",
  });
};

export const getAttendanceHistory = async (volunteerId) => {
  const attendanceHistory = await Attendance.findAll({
    where: {
      volunteerId,
    },
    include: [
      {
        model: Project,
        as: "project",
        attributes: ["id", "title", "status"],
      },
    ],
    order: [["checkedInAt", "DESC"]],
  });

  return attendanceHistory;
};

export const checkOutFromProject = async (projectId, volunteerId) => {
  const attendance = await Attendance.findOne({
    where: {
      projectId,
      volunteerId,
    },
  });

  if (!attendance) {
    throw new Error("Attendance record not found");
  }

  if (attendance.checkOutAt) {
    throw new Error("You have already checked out");
  }

  const checkOutTime = new Date();

  const totalHours = (checkOutTime - attendance.checkedInAt) / (1000 * 60 * 60);

  attendance.checkOutAt = checkOutTime;
  attendance.totalHours = Number(totalHours.toFixed(2));

  await attendance.save();

  return attendance;
};
