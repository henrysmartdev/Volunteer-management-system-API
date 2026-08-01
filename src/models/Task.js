import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const Task = sequelize.define(
  "Task",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },

    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },

    dueDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },

    priority: {
      type: DataTypes.ENUM("LOW", "MEDIUM", "HIGH"),
      allowNull: false,
      defaultValue: "MEDIUM",
    },

    status: {
      type: DataTypes.ENUM(
        "NOT_STARTED",
        "IN_PROGRESS",
        "COMPLETED"
      ),
      allowNull: false,
      defaultValue: "NOT_STARTED",
    },

    projectId: {
      type: DataTypes.UUID,
      allowNull: false,
    },

    createdBy: {
      type: DataTypes.UUID,
      allowNull: false,
    },
  },
  {
    tableName: "tasks",
    timestamps: true,
  }
);



export default Task;
