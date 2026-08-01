import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const Assignment = sequelize.define(
  "Assignment",
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
      type: DataTypes.ENUM(
        "NOT_STARTED",
        "IN_PROGRESS",
        "COMPLETED"
      ),
      allowNull: false,
      defaultValue: "NOT_STARTED",
    },
  },
  {
    tableName: "assignments",
    timestamps: true,

      //no same taskId having the same assigned volunteerId
    indexes: [
      {
        unique: true,
        fields: ["taskId", "volunteerId"],
      },
    ],
  }
);

export default Assignment;
