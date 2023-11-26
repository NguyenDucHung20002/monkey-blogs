import { DataTypes } from "sequelize";
import sequelize from "../../databases/mysql/connect.js";
import Role from "../mysql/Role.js";

const User = sequelize.define(
  "User",
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },

    username: { type: DataTypes.STRING, allowNull: false, unique: true },

    email: { type: DataTypes.STRING, allowNull: false, unique: true },

    reportsCount: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },

    bannedsCount: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },

    banType: {
      type: DataTypes.ENUM("1week", "1year", "1month", "permanent"),
      allowNull: true,
    },

    bannedUntil: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },

    bannedById: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },

    roleId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Role,
        key: "id",
      },
      defaultValue: 1,
    },

    status: {
      type: DataTypes.ENUM("normal", "banned"),
      allowNull: false,
      defaultValue: "normal",
    },
  },

  {
    tableName: "users",
    timestamps: true,
  }
);

export default User;
