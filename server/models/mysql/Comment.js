import { DataTypes } from "sequelize";
import sequelize from "../../databases/mysql/connect.js";
import Article from "./Article.js";
import Profile from "./Profile.js";

const Comment = sequelize.define(
  "Comment",
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },

    articleId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: Article, key: "id" },
    },

    authorId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: Profile, key: "id" },
    },

    parentCommentId: { type: DataTypes.INTEGER, allowNull: true },

    repliesCount: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },

    depth: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 1 },

    content: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },

  {
    tableName: "comments",
    timestamps: true,
  }
);

export default Comment;
