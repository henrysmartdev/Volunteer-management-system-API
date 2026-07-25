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
  },
  {
    timestamps: true,
  },
);

export default Assignment;
