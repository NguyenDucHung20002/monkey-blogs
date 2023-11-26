import { DataTypes } from "sequelize";
import sequelize from "../../databases/mysql/connect.js";
import Profile from "../mysql/Profile.js";

const Article = sequelize.define(
  "Article",
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },

    authorId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: Profile, key: "id" },
    },

    banner: { type: DataTypes.STRING, allowNull: true },

    title: { type: DataTypes.STRING, allowNull: false },

    preview: { type: DataTypes.STRING, allowNull: false },

    slug: { type: DataTypes.STRING, allowNull: false, unique: true },

    content: { type: DataTypes.TEXT, allowNull: false },

    likesCount: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },

    commentsCount: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },

    status: {
      type: DataTypes.ENUM("pending", "approved"),
      allowNull: false,
      defaultValue: "pending",
    },
  },

  {
    tableName: "articles",
    timestamps: true,
  }
);

export default Article;
