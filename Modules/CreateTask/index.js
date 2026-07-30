
import { sequelize } from '../config/db';

import User from './User';

import Project from './Project';

import Task from './Task';

import Assignment from './Assignment';

import Attendance from './Attendance';


Project.belongsTo(User, { as: 'coordinator', foreignKey: 'coordinatorId' });

User.hasMany(Project, { as: 'projectsCoordinated', foreignKey: 'coordinatorId' });

Task.belongsTo(Project, { foreignKey: 'projectId', allowNull: false });

Project.hasMany(Task, { foreignKey: 'projectId' });


Assignment.belongsTo(Task, { foreignKey: 'taskId', allowNull: false });
Assignment.belongsTo(User, { as: 'volunteer', foreignKey: 'volunteerId', allowNull: false });
Task.hasMany(Assignment, { foreignKey: 'taskId' });
User.hasMany(Assignment, { foreignKey: 'volunteerId' });


Attendance.belongsTo(User, { as: 'volunteer', foreignKey: 'volunteerId', allowNull: false });
Attendance.belongsTo(Project, { foreignKey: 'projectId', allowNull: false });
Attendance.belongsTo(Task, { foreignKey: 'taskId', allowNull: true }); // optional link
User.hasMany(Attendance, { foreignKey: 'volunteerId' });
Project.hasMany(Attendance, { foreignKey: 'projectId' });

module.exports = { sequelize, User, Project, Task, Assignment, Attendance };

