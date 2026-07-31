import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const Attendance = sequelize.define(
  "Attendance",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },

    projectId: {
      type: DataTypes.UUID,
      allowNull: false,
    },

    volunteerId: {
      type: DataTypes.UUID,
      allowNull: false,
    },

    checkedInAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    checkOutAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },

    totalHours: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: true,
      defaultValue: 0,
    },
    method: {
      type: DataTypes.ENUM("QR", "MANUAL"),
      allowNull: false,
      defaultValue: "QR",
    },
  },
  {
    tableName: "Attendances",
    timestamps: true,
  },
);

export default Attendance;
