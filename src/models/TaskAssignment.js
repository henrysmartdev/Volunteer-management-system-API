import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const TaskAssignment = sequelize.define(
  "TaskAssignment",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },

    taskId: {
      type: DataTypes.UUID,
      allowNull: false,
    },

    volunteerId: {
      type: DataTypes.UUID,
      allowNull: false,
    },

    status: {
      type: DataTypes.ENUM("NOT_STARTED", "IN_PROGRESS", "COMPLETED"),
      allowNull: false,
      defaultValue: "NOT_STARTED",
    },

    assignedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "TaskAssignments",
    timestamps: true,
  },
);

export default TaskAssignment;
