import { DataTypes } from "sequelize";
import sequelize from "../../databases/mysql/connect.js";

const Topic = sequelize.define(
  "Topic",
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },

    name: { type: DataTypes.STRING, allowNull: false, unique: true },

    followersCount: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },

    articlesCount: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },

    slug: { type: DataTypes.STRING, allowNull: false, unique: true },

    status: {
      type: DataTypes.ENUM("pending", "approved"),
      allowNull: false,
      defaultValue: "pending",
    },
  },

  {
    tableName: "topics",
    timestamps: true,
  }
);

export default Topic;
