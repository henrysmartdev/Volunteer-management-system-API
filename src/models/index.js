import sequelize from "../config/database.js";

import User from "./User.js";
import Project from "./Project.js";
import Task from "./Task.js";
import TaskAssignment from "./TaskAssignment.js";
import PasswordReset from "./PasswordReset.js";
import Notification from "./Notification.js";
import Attendance from "./Attendance.js";

/*Relationships*/

// A coordinator creates many projects
Project.belongsTo(User, {
  foreignKey: "createdBy",
  as: "creator",
});

User.hasMany(Project, {
  foreignKey: "createdBy",
  as: "projects",
});

Project.hasMany(Task, {
  foreignKey: "projectId",
  as: "tasks",
});

Task.belongsTo(Project, {
  foreignKey: "projectId",
  as: "project",
});

// Volunteers are assigned to tasks
User.belongsToMany(Task, {
  through: TaskAssignment,
  foreignKey: "volunteerId",
  otherKey: "taskId",
  as: "assignedTasks",
});

Task.belongsToMany(User, {
  through: TaskAssignment,
  foreignKey: "taskId",
  otherKey: "volunteerId",
  as: "volunteers",
});
Task.hasMany(TaskAssignment, {
  foreignKey: "taskId",
  as: "assignments",
});
User.hasMany(TaskAssignment, {
  foreignKey: "volunteerId",
  as: "taskAssignments",
});
TaskAssignment.belongsTo(Task, {
  foreignKey: "taskId",
  as: "task",
});

TaskAssignment.belongsTo(User, {
  foreignKey: "volunteerId",
  as: "volunteer",
});
// Password resets
User.hasMany(PasswordReset, {
  foreignKey: "userId",
});

PasswordReset.belongsTo(User, {
  foreignKey: "userId",
});

User.hasMany(Notification, {
  foreignKey: "userId",
  as: "notifications",
});
Notification.belongsTo(User, {
  foreignKey: "userId",
  as: "user",
});

Project.hasMany(Attendance, {
  foreignKey: "projectId",
  as: "attendances",
});
User.hasMany(Attendance, {
  foreignKey: "volunteerId",
  as: "attendances",
});
Attendance.belongsTo(Project, {
  foreignKey: "projectId",
  as: "project",
});

Attendance.belongsTo(User, {
  foreignKey: "volunteerId",
  as: "volunteer",
});

export {
  sequelize,
  User,
  Project,
  Task,
  TaskAssignment,
  PasswordReset,
  Notification,
  Attendance,
};
