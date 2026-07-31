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
