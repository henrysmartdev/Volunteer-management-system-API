import sequelize from "../config/database.js";

import User from "./User.js";
import Project from "./Project.js";
import Task from "./Task.js";
import Assignment from "./Assignment.js";
import Attendance from "./Attendance.js";
import PasswordReset from "./PasswordReset.js";

/*Relationships*/

// A coordinator creates many projects
User.hasMany(Project, {
  foreignKey: "createdBy",
});

Project.belongsTo(User, {
  foreignKey: "createdBy",
});

// A project has many tasks
Project.hasMany(Task, {
  foreignKey: "projectId",
});

Task.belongsTo(Project, {
  foreignKey: "projectId",
});

// Volunteers are assigned to tasks
User.belongsToMany(Task, {
  through: Assignment,
  foreignKey: "volunteerId",
});

Task.belongsToMany(User, {
  through: Assignment,
  foreignKey: "taskId",
});

// Attendance
User.hasMany(Attendance, {
  foreignKey: "volunteerId",
});

Attendance.belongsTo(User, {
  foreignKey: "volunteerId",
});

Task.hasMany(Attendance, {
  foreignKey: "taskId",
});

Attendance.belongsTo(Task, {
  foreignKey: "taskId",
});

// Password resets
User.hasMany(PasswordReset, {
  foreignKey: "userId",
});

PasswordReset.belongsTo(User, {
  foreignKey: "userId",
});

export {
  sequelize,
  User,
  Project,
  Task,
  Assignment,
  Attendance,
  PasswordReset,
};
