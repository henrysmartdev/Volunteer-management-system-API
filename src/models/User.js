import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const User = sequelize.define(
  "User",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },

    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },

    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    role: {
      type: DataTypes.ENUM("VOLUNTEER", "COORDINATOR"),
      allowNull: false,
      defaultValue: "VOLUNTEER",
    },

    avatar: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    avatarPublicId: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    tableName: "Users",
    timestamps: true,
  },
);



export default User;
