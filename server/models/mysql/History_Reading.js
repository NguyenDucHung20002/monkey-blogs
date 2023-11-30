import { DataTypes } from "sequelize";
import sequelize from "../../databases/mysql/connect.js";
import Article from "./Article.js";
import Profile from "./Profile.js";

const History_Reading = sequelize.define(
  "History_Reading",
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },

    articleId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: Article, key: "id" },
    },

    profileId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: Profile, key: "id" },
    },
  },
  {
    tableName: "history_readings",
    timestamps: true,
  }
);

export default History_Reading;
