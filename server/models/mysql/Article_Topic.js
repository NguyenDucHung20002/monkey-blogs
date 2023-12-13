import { DataTypes } from "sequelize";
import sequelize from "../../databases/mysql/connect.js";
import Topic from "./Topic.js";
import Article from "./Article.js";

const Article_Topic = sequelize.define(
  "Article_Topic",
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },

    articleId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: Article, key: "id" },
    },

    topicId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: Topic, key: "id" },
    },
  },

  {
    tableName: "articles_topics",
    timestamps: false,
  }
);

export default Article_Topic;
