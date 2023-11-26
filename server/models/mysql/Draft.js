import { DataTypes } from "sequelize";
import sequelize from "../../databases/mysql/connect.js";
import Profile from "../mysql/Profile.js";

const Draft = sequelize.define(
  "Draft",
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },

    authorId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: Profile, key: "id" },
    },

    title: { type: DataTypes.STRING, allowNull: true },

    content: { type: DataTypes.TEXT, allowNull: true },
  },

  {
    tableName: "drafts",
    timestamps: true,
  }
);

export default Draft;
