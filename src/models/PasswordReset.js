import { DataTypes, Sequelize } from "sequelize";
import sequelize from "../config/database.js";

const PasswordReset = sequelize.define(
  "PasswordReset",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },

    userId: {
      type: Sequelize.UUID,
      allowNull: false,
      references: {
        model: "Users",
        key: "id",
      },
      onDelete: "CASCADE",
    },

    tokenHash: {
      type: DataTypes.STRING,
      allowNull: false,
      field: "token",
    },

    used: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false,
    },

    expiresAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  },
  {
    timestamps: true,
  },
);

export default PasswordReset;
