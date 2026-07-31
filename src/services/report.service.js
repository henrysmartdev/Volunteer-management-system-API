import Attendance from "../models/Attendance.js";
import User from "../models/User.js";
import Project from "../models/Project.js";

export const getVolunteerHoursReport = async () => {
  const attendances = await Attendance.findAll({
    include: [
      {
        model: User,
        as: "volunteer",
        attributes: ["id", "firstName", "lastName", "email"],
      },
      {
        model: Project,
        as: "project",
        attributes: ["id", "title"],
      },
    ],
    order: [["checkedInAt", "DESC"]],
  });

  const report = {};

  attendances.forEach((attendance) => {
    const volunteer = attendance.volunteer;

    if (!report[volunteer.id]) {
      report[volunteer.id] = {
        volunteer: {
          id: volunteer.id,
          firstName: volunteer.firstName,
          lastName: volunteer.lastName,
          email: volunteer.email,
        },
        totalHours: 0,
        projects: [],
      };
    }

    report[volunteer.id].totalHours += Number(attendance.totalHours || 0);

    report[volunteer.id].projects.push({
      projectId: attendance.project.id,
      projectName: attendance.project.title,
      checkIn: attendance.checkedInAt,
      checkOut: attendance.checkOutAt,
      hours: Number(attendance.totalHours || 0),
    });
  });

  return Object.values(report);
};

export const getProjectAttendanceReport = async (projectId, coordinatorId) => {
  const project = await Project.findByPk(projectId);

  if (!project) {
    throw new Error("Project not found");
  }

  if (project.createdBy !== coordinatorId) {
    throw new Error("You are not authorized to view this report");
  }

  const attendances = await Attendance.findAll({
    where: {
      projectId,
    },
    include: [
      {
        model: User,
        as: "volunteer",
        attributes: ["id", "firstName", "lastName", "email"],
      },
    ],
    order: [["checkedInAt", "ASC"]],
  });

  const checkedOut = attendances.filter(
    (attendance) => attendance.checkOutAt,
  ).length;

  const currentlyPresent = attendances.length - checkedOut;

  const totalHours = attendances.reduce(
    (sum, attendance) => sum + Number(attendance.totalHours || 0),
    0,
  );

  const averageHours =
    attendances.length > 0
      ? Number((totalHours / attendances.length).toFixed(2))
      : 0;

  return {
    project: {
      id: project.id,
      title: project.title,
      description: project.description,
      status: project.status,
      startDate: project.startDate,
      endDate: project.endDate,
    },

    summary: {
      totalAttendance: attendances.length,
      checkedOut,
      currentlyPresent,
      averageHours,
    },

    attendees: attendances.map((attendance) => ({
      volunteerId: attendance.volunteer.id,
      firstName: attendance.volunteer.firstName,
      lastName: attendance.volunteer.lastName,
      email: attendance.volunteer.email,

      attendanceStatus: attendance.checkOutAt ? "COMPLETED" : "PRESENT",

      checkIn: attendance.checkedInAt,
      checkOut: attendance.checkOutAt,
      hours: Number(attendance.totalHours || 0),
      method: attendance.method,
    })),
  };
};
