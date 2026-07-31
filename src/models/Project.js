import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const Project = sequelize.define(
  "Project",
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

    startDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },

    endDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },

    status: {
      type: DataTypes.ENUM("DRAFT", "ACTIVE", "COMPLETED", "ARCHIVED"),
      defaultValue: "DRAFT",
    },

    createdBy: {
      type: DataTypes.UUID,
      allowNull: false,
    },
  },
  {
    tableName: "Projects",
    freezeTableName: true,
    timestamps: true,
  },
);

export default Project;
