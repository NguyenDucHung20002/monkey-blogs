import { DataTypes } from "sequelize";
import sequelize from "../../databases/mysql/connect.js";
import Article from "./Article.js";
import Profile from "./Profile.js";

const Like = sequelize.define(
  "Like",
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
    tableName: "likes",
    timestamps: true,
  }
);

export default Like;
